import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { createSubmission, transcribeRecording } from "@/lib/submissions.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Image as ImageIcon,
  Mic,
  Square,
  Trash2,
  Upload,
  Video,
  X,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: "Get a Free Quote | Eden Local Services" },
      {
        name: "description",
        content:
          "Tell us your vision in words, photos, video or voice — get a free estimate from Eden Local Services in Ojai.",
      },
    ],
  }),
  component: QuotePage,
});

type Uploaded = { path: string; name: string; mime: string; size: number; kind: "image" | "video" | "audio" };

const PROJECT_TYPES = [
  "Yard Cleanup & Maintenance",
  "Fruit Tree / Orchard Care",
  "Garden Bed Setup",
  "Food Forest / Edible Landscape",
  "Outdoor Living Space",
  "Property Transformation",
  "Soil / Compost / Mulch",
  "Irrigation Help",
  "Drought-Tolerant Planting",
  "Not sure — surprise me",
];
const BUDGETS = ["Under $2k", "$2k – $5k", "$5k – $15k", "$15k – $50k", "$50k+", "Not sure yet"];
const TIMELINES = ["ASAP", "1–4 weeks", "1–3 months", "Just exploring"];

function QuotePage() {
  const navigate = useNavigate();
  const create = useServerFn(createSubmission);
  const transcribe = useServerFn(transcribeRecording);

  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState<string>("");
  const [vision, setVision] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [files, setFiles] = useState<Uploaded[]>([]);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // recording
  const [recording, setRecording] = useState<null | "audio" | "video">(null);
  const [elapsed, setElapsed] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!recording) return;
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(id);
  }, [recording]);

  async function uploadOne(file: File): Promise<Uploaded> {
    const id = crypto.randomUUID();
    const safe = file.name.replace(/[^\w.\-]+/g, "_");
    const path = `pending/${id}-${safe}`;
    const { error } = await supabase.storage.from("submissions").upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    if (error) throw new Error(error.message);
    const kind: Uploaded["kind"] = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
        ? "video"
        : "audio";
    return { path, name: file.name, mime: file.type || "application/octet-stream", size: file.size, kind };
  }

  async function onFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setUploading(true);
    try {
      const arr = Array.from(list).slice(0, 10);
      const results: Uploaded[] = [];
      for (const f of arr) {
        if (f.size > 50 * 1024 * 1024) {
          toast.error(`${f.name} is over 50MB — skipped`);
          continue;
        }
        results.push(await uploadOne(f));
      }
      setFiles((prev) => [...prev, ...results].slice(0, 20));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function startRecording(kind: "audio" | "video") {
    try {
      const constraints: MediaStreamConstraints =
        kind === "audio" ? { audio: true } : { audio: true, video: { facingMode: "user" } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (kind === "video" && videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play().catch(() => {});
      }
      const candidates =
        kind === "audio"
          ? ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"]
          : ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"];
      const mimeType = candidates.find((c) => MediaRecorder.isTypeSupported(c)) ?? "";
      const rec = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const type = rec.mimeType || (kind === "audio" ? "audio/webm" : "video/webm");
        const blob = new Blob(chunksRef.current, { type });
        if (blob.size < 1024) {
          toast.error("That recording was empty — try again");
          return;
        }
        const ext = type.includes("mp4") ? "mp4" : "webm";
        const file = new File([blob], `${kind}-${Date.now()}.${ext}`, { type });
        setUploading(true);
        try {
          const uploaded = await uploadOne(file);
          setFiles((prev) => [...prev, uploaded]);
          toast.success(`${kind === "audio" ? "Voice message" : "Video"} saved`);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Upload failed");
        } finally {
          setUploading(false);
        }
      };
      rec.start();
      mediaRecorderRef.current = rec;
      setElapsed(0);
      setRecording(kind);
    } catch {
      toast.error("Couldn't access mic/camera. Check browser permissions.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setRecording(null);
  }

  function removeFile(path: string) {
    setFiles((prev) => prev.filter((f) => f.path !== path));
    supabase.storage.from("submissions").remove([path]).catch(() => {});
  }

  async function handleSubmit() {
    if (!name.trim() || !email.trim()) {
      toast.error("Please add your name and email");
      return;
    }
    setSubmitting(true);
    try {
      const { id } = await create({
        data: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          address: address.trim() || null,
          projectType: projectType || null,
          vision: vision.trim() || null,
          budgetRange: budget || null,
          timeline: timeline || null,
          media: files,
        },
      });
      // fire-and-forget transcribe of any recordings
      files
        .filter((f) => f.kind === "audio" || f.kind === "video")
        .forEach((f) => {
          transcribe({ data: { submissionId: id, path: f.path } }).catch(() => {});
        });
      navigate({ to: "/quote/thanks", search: { id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit");
    } finally {
      setSubmitting(false);
    }
  }

  const steps = ["Your vision", "Show your space", "Talk to us", "Contact", "Review"] as const;

  return (
    <div className="min-h-screen bg-[#f6f0e2] text-[#2f2f25]">
      <header className="bg-[#203f24] text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-sm hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="text-sm opacity-80">Free quote · ~3 minutes</div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10">
        {/* Progress */}
        <div className="mb-8 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div
                className={`h-2 flex-1 rounded-full transition ${i <= step ? "bg-[#203f24]" : "bg-[#203f24]/15"}`}
              />
            </div>
          ))}
        </div>
        <h1 className="mb-1 font-serif text-3xl md:text-4xl">{steps[step]}</h1>
        <p className="mb-8 text-sm text-[#2f2f25]/70">Step {step + 1} of {steps.length}</p>

        {step === 0 && (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">What kind of project?</label>
              <div className="flex flex-wrap gap-2">
                {PROJECT_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setProjectType(t)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      projectType === t
                        ? "border-[#203f24] bg-[#203f24] text-white"
                        : "border-[#203f24]/30 bg-white hover:border-[#203f24]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Tell us your vision (or skip — just upload)</label>
              <Textarea
                rows={5}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                placeholder="A wild edible food forest in the back, a fire pit with string lights, maybe fix the dead lawn..."
                className="bg-white"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Budget range</label>
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition ${
                        budget === b
                          ? "border-[#203f24] bg-[#203f24] text-white"
                          : "border-[#203f24]/30 bg-white"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Timeline</label>
                <div className="flex flex-wrap gap-2">
                  {TIMELINES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeline(t)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition ${
                        timeline === t
                          ? "border-[#203f24] bg-[#203f24] text-white"
                          : "border-[#203f24]/30 bg-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-[#203f24]/30 bg-white p-10 text-center transition hover:border-[#203f24]">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
              />
              <Upload className="mx-auto mb-3 h-10 w-10 text-[#203f24]" />
              <div className="text-base font-medium">Drop or tap to upload photos & videos</div>
              <div className="mt-1 text-sm text-[#2f2f25]/60">Up to 50MB each</div>
            </label>
            {uploading && <div className="text-sm text-[#2f2f25]/70">Uploading...</div>}
            {files.filter((f) => f.kind !== "audio").length > 0 && (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {files
                  .filter((f) => f.kind !== "audio")
                  .map((f) => (
                    <div key={f.path} className="group relative aspect-square overflow-hidden rounded-lg border bg-[#203f24]/5">
                      <div className="flex h-full items-center justify-center text-[#203f24]/50">
                        {f.kind === "image" ? <ImageIcon className="h-8 w-8" /> : <Video className="h-8 w-8" />}
                      </div>
                      <div className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-2 py-1 text-xs text-white">
                        {f.name}
                      </div>
                      <button
                        onClick={() => removeFile(f.path)}
                        className="absolute right-1 top-1 rounded-full bg-white/90 p-1 opacity-0 transition group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <p className="text-[#2f2f25]/80">
              Record a short voice or video message walking us through what you're imagining. This is often the fastest way.
            </p>
            {recording === "video" && (
              <div className="overflow-hidden rounded-xl border bg-black">
                <video ref={videoPreviewRef} muted playsInline className="aspect-video w-full" />
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              {!recording && (
                <>
                  <Button onClick={() => startRecording("audio")} className="bg-[#203f24] hover:bg-[#17331d]">
                    <Mic className="mr-2 h-4 w-4" /> Record voice
                  </Button>
                  <Button onClick={() => startRecording("video")} variant="outline">
                    <Video className="mr-2 h-4 w-4" /> Record video
                  </Button>
                </>
              )}
              {recording && (
                <Button onClick={stopRecording} className="bg-red-600 hover:bg-red-700">
                  <Square className="mr-2 h-4 w-4" /> Stop ({Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")})
                </Button>
              )}
            </div>
            {files.filter((f) => f.kind === "audio" || (f.kind === "video" && f.name.startsWith("video-"))).length > 0 && (
              <div className="space-y-2">
                {files
                  .filter((f) => f.kind === "audio" || (f.kind === "video" && f.name.startsWith("video-")))
                  .map((f) => (
                    <div key={f.path} className="flex items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        {f.kind === "audio" ? <Mic className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                        {f.name}
                      </div>
                      <button onClick={() => removeFile(f.path)}>
                        <Trash2 className="h-4 w-4 text-[#2f2f25]/60 hover:text-red-600" />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Your name *</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-white" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email *</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-white" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Property address</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} className="bg-white" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 rounded-xl border bg-white p-6">
            <Row label="Project" value={projectType || "—"} />
            <Row label="Budget" value={budget || "—"} />
            <Row label="Timeline" value={timeline || "—"} />
            <Row label="Vision" value={vision || "—"} />
            <Row label="Uploads" value={`${files.length} file${files.length === 1 ? "" : "s"}`} />
            <hr />
            <Row label="Name" value={name} />
            <Row label="Email" value={email} />
            <Row label="Phone" value={phone || "—"} />
            <Row label="Address" value={address || "—"} />
            <p className="pt-2 text-sm text-[#2f2f25]/70">
              <Sparkles className="mr-1 inline h-4 w-4" />
              After you submit, you can chat with our AI assistant to refine ideas and get a ballpark estimate.
            </p>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} className="bg-[#203f24] hover:bg-[#17331d]">
              Next <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting} className="bg-[#203f24] hover:bg-[#17331d]">
              {submitting ? "Sending..." : <>Submit <CheckCircle2 className="ml-1 h-4 w-4" /></>}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 text-sm">
      <div className="font-medium text-[#2f2f25]/60">{label}</div>
      <div className="whitespace-pre-wrap">{value}</div>
    </div>
  );
}