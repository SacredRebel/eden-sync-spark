import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { z } from "zod";

function publicClient() {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

const MediaItem = z.object({
  path: z.string(),
  name: z.string(),
  mime: z.string(),
  size: z.number(),
  kind: z.enum(["image", "video", "audio"]),
});

const SubmissionInput = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(255),
  phone: z.string().max(40).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  projectType: z.string().max(120).optional().nullable(),
  vision: z.string().max(5000).optional().nullable(),
  budgetRange: z.string().max(60).optional().nullable(),
  timeline: z.string().max(60).optional().nullable(),
  media: z.array(MediaItem).max(30),
});

export const createSubmission = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SubmissionInput.parse(input))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: row, error } = await sb
      .from("submissions")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        address: data.address ?? null,
        project_type: data.projectType ?? null,
        vision: data.vision ?? null,
        budget_range: data.budgetRange ?? null,
        timeline: data.timeline ?? null,
        media: data.media,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

// Transcribe an uploaded recording via Lovable AI STT, then save into submissions.transcripts
const TranscribeInput = z.object({
  submissionId: z.string().uuid(),
  path: z.string(),
});

export const transcribeRecording = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TranscribeInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: file, error: dlErr } = await supabaseAdmin.storage
      .from("submissions")
      .download(data.path);
    if (dlErr || !file) throw new Error(dlErr?.message ?? "Could not read recording");

    const mime = file.type || "audio/webm";
    const ext =
      mime.includes("mp4") || mime.includes("m4a")
        ? "mp4"
        : mime.includes("mpeg")
          ? "mp3"
          : mime.includes("wav")
            ? "wav"
            : "webm";

    const form = new FormData();
    form.append("model", "openai/gpt-4o-mini-transcribe");
    form.append("file", file, `recording.${ext}`);

    const r = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      throw new Error(`Transcription failed: ${r.status} ${t}`);
    }
    const json = (await r.json()) as { text?: string };
    const text = json.text ?? "";

    // merge into transcripts jsonb
    const { data: existing } = await supabaseAdmin
      .from("submissions")
      .select("transcripts")
      .eq("id", data.submissionId)
      .single();
    const merged = { ...((existing?.transcripts as Record<string, string>) ?? {}), [data.path]: text };
    await supabaseAdmin.from("submissions").update({ transcripts: merged }).eq("id", data.submissionId);
    return { text };
  });

// Chat with the AI assistant about a submission
const ChatInput = z.object({
  submissionId: z.string().uuid(),
  userMessage: z.string().min(1).max(2000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(40),
});

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: sub, error } = await supabaseAdmin
      .from("submissions")
      .select("*")
      .eq("id", data.submissionId)
      .single();
    if (error || !sub) throw new Error("Submission not found");

    const transcriptText = Object.entries((sub.transcripts as Record<string, string>) ?? {})
      .map(([p, t]) => `- ${p.split("/").pop()}: ${t}`)
      .join("\n");

    const mediaSummary = ((sub.media as Array<{ name: string; kind: string }>) ?? [])
      .map((m) => `- ${m.kind}: ${m.name}`)
      .join("\n");

    const system = `You are the friendly AI landscape designer for Eden Local Services in Ojai, California.
You're helping a homeowner who just submitted a free quote request. Be warm, curious, and concise.

Your job in this conversation:
1) Ask 1-2 sharp follow-up questions about their space, lifestyle, or priorities.
2) Suggest 2-3 specific creative ideas that fit their vision (food forest, outdoor living, regenerative design, native plants, etc.).
3) Offer a rough ballpark estimate range in USD when you have enough info, framed as a starting point Sasha (the owner) will refine.
4) Stay grounded — never promise dates or exact prices.

CLIENT SUBMISSION CONTEXT:
Name: ${sub.name}
Project type: ${sub.project_type ?? "(not specified)"}
Budget range: ${sub.budget_range ?? "(not specified)"}
Timeline: ${sub.timeline ?? "(not specified)"}
Address: ${sub.address ?? "(not specified)"}

Their vision:
${sub.vision ?? "(none written)"}

Uploaded media:
${mediaSummary || "(none)"}

Recording transcripts:
${transcriptText || "(none)"}`;

    const messages = [
      { role: "system", content: system },
      ...data.history,
      { role: "user", content: data.userMessage },
    ];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "raw-fetch",
      },
      body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("The AI is busy right now, please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please contact Sasha directly.");
      throw new Error(`AI error: ${res.status} ${t}`);
    }
    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const reply = json.choices?.[0]?.message?.content ?? "Sorry, I didn't catch that.";

    // Persist both messages
    await supabaseAdmin.from("submission_messages").insert([
      { submission_id: data.submissionId, role: "user", content: data.userMessage },
      { submission_id: data.submissionId, role: "assistant", content: reply },
    ]);

    return { reply };
  });

// Admin: list all submissions
export const listSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { data, error } = await context.supabase
      .from("submissions")
      .select("id,name,email,project_type,budget_range,status,created_at,ai_estimate_low,ai_estimate_high")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

// Admin: full submission detail + messages + signed media urls
const GetInput = z.object({ id: z.string().uuid() });
export const getSubmissionDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => GetInput.parse(i))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { data: sub, error } = await context.supabase
      .from("submissions")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error || !sub) throw new Error("Not found");
    const { data: messages } = await context.supabase
      .from("submission_messages")
      .select("*")
      .eq("submission_id", data.id)
      .order("created_at", { ascending: true });

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const media = (sub.media as Array<{ path: string; name: string; mime: string; kind: string }>) ?? [];
    const signed = await Promise.all(
      media.map(async (m) => {
        const { data: s } = await supabaseAdmin.storage.from("submissions").createSignedUrl(m.path, 3600);
        return { ...m, url: s?.signedUrl ?? null };
      }),
    );
    return { submission: sub, messages: messages ?? [], media: signed };
  });

const UpdateStatusInput = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "reviewing", "quoted", "won", "lost", "ready_to_book"]),
  notes: z.string().max(5000).optional(),
});
export const updateSubmissionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => UpdateStatusInput.parse(i))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const patch: Record<string, unknown> = { status: data.status };
    if (data.notes !== undefined) patch.admin_notes = data.notes;
    const { error } = await context.supabase.from("submissions").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });