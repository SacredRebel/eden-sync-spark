import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubmissionDetail, updateSubmissionStatus } from "@/lib/submissions.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/$id")({
  head: () => ({ meta: [{ title: "Submission detail" }] }),
  component: AdminDetail,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-red-600">{error.message}</div>
  ),
});

const STATUSES = ["new", "reviewing", "quoted", "ready_to_book", "won", "lost"] as const;
type Status = (typeof STATUSES)[number];

function AdminDetail() {
  const { id } = Route.useParams();
  const fn = useServerFn(getSubmissionDetail);
  const updateFn = useServerFn(updateSubmissionStatus);
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["submission", id],
    queryFn: () => fn({ data: { id } }),
  });
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Status>("new");

  useEffect(() => {
    if (data?.submission) {
      setNotes(data.submission.admin_notes ?? "");
      setStatus(data.submission.status as Status);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: () => updateFn({ data: { id, status, notes } }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["submission", id] });
      qc.invalidateQueries({ queryKey: ["submissions"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  if (isLoading) return <div className="p-10 text-sm">Loading…</div>;
  if (error || !data) return <div className="p-10 text-sm text-red-600">{error?.message ?? "Not found"}</div>;

  const s = data.submission;
  const transcripts = (s.transcripts as Record<string, string>) ?? {};

  return (
    <div className="min-h-screen bg-[#f6f0e2] text-[#2f2f25]">
      <header className="bg-[#203f24] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/admin" className="flex items-center gap-2 text-sm hover:underline">
            <ArrowLeft className="h-4 w-4" /> All submissions
          </Link>
        </div>
      </header>
      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-10 md:grid-cols-3">
        <section className="space-y-6 md:col-span-2">
          <div className="rounded-xl border bg-white p-6">
            <h1 className="font-serif text-2xl">{s.name}</h1>
            <div className="mt-1 text-sm text-[#2f2f25]/60">
              <a href={`mailto:${s.email}`} className="underline">{s.email}</a>
              {s.phone && (
                <>
                  {" · "}
                  <a href={`tel:${s.phone}`} className="underline">{s.phone}</a>
                </>
              )}
            </div>
            {s.address && <div className="mt-1 text-sm">{s.address}</div>}
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
              <Info label="Project" value={s.project_type} />
              <Info label="Budget" value={s.budget_range} />
              <Info label="Timeline" value={s.timeline} />
            </div>
            {s.vision && (
              <div className="mt-4">
                <div className="text-xs font-medium uppercase text-[#2f2f25]/50">Vision</div>
                <p className="mt-1 whitespace-pre-wrap text-sm">{s.vision}</p>
              </div>
            )}
          </div>

          {data.media.length > 0 && (
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-3 font-serif text-lg">Uploads</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {data.media.map((m) => (
                  <div key={m.path} className="rounded-lg border bg-[#203f24]/5 p-3">
                    <div className="mb-2 truncate text-xs font-medium">{m.name}</div>
                    {m.url && m.kind === "image" && (
                      <img src={m.url} alt={m.name} className="w-full rounded" />
                    )}
                    {m.url && m.kind === "video" && (
                      <video src={m.url} controls className="w-full rounded" />
                    )}
                    {m.url && m.kind === "audio" && (
                      <audio src={m.url} controls className="w-full" />
                    )}
                    {transcripts[m.path] && (
                      <div className="mt-2 rounded bg-white p-2 text-xs italic">
                        “{transcripts[m.path]}”
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.messages.length > 0 && (
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-3 font-serif text-lg">AI conversation</h2>
              <div className="space-y-3">
                {data.messages.map((m) => (
                  <div key={m.id} className="text-sm">
                    <div className="text-xs font-medium uppercase text-[#2f2f25]/50">{m.role}</div>
                    <div className="mt-1 whitespace-pre-wrap">{m.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-4 rounded-xl border bg-white p-6">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-[#2f2f25]/50">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-[#2f2f25]/50">Internal notes</label>
            <Textarea rows={8} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button onClick={() => save.mutate()} disabled={save.isPending} className="w-full bg-[#203f24] hover:bg-[#17331d]">
            <Save className="mr-2 h-4 w-4" /> {save.isPending ? "Saving…" : "Save"}
          </Button>
          <div className="text-xs text-[#2f2f25]/50">Submitted {new Date(s.created_at).toLocaleString()}</div>
        </aside>
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase text-[#2f2f25]/50">{label}</div>
      <div className="mt-1">{value ?? "—"}</div>
    </div>
  );
}