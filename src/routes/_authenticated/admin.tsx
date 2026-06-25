import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listSubmissions } from "@/lib/submissions.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin · Submissions" }] }),
  component: AdminList,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-red-600">{error.message}</div>
  ),
});

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  reviewing: "bg-amber-100 text-amber-700",
  quoted: "bg-purple-100 text-purple-700",
  ready_to_book: "bg-emerald-100 text-emerald-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-gray-100 text-gray-600",
};

function AdminList() {
  const navigate = useNavigate();
  const fn = useServerFn(listSubmissions);
  const { data, isLoading, error } = useQuery({
    queryKey: ["submissions"],
    queryFn: () => fn(),
  });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-[#f6f0e2]">
      <header className="bg-[#203f24] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="font-serif text-lg">Eden · Admin</Link>
          <Button onClick={signOut} variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-3xl">Submissions</h1>
        <p className="mt-1 text-sm text-[#2f2f25]/60">Every quote request, newest first.</p>

        {isLoading && <div className="mt-8 text-sm">Loading…</div>}
        {error && (
          <div className="mt-8 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error instanceof Error ? error.message : "Error"}
            <div className="mt-2 text-xs text-red-600/70">
              If this says "Forbidden", you need an admin role. Ask the database to be granted to your account.
            </div>
          </div>
        )}
        {data && data.length === 0 && (
          <div className="mt-8 rounded-xl border bg-white p-10 text-center text-sm text-[#2f2f25]/60">
            No submissions yet.
          </div>
        )}
        {data && data.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-xl border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-[#203f24]/5 text-left text-xs uppercase text-[#2f2f25]/60">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {data.map((s) => (
                  <tr key={s.id} className="border-t hover:bg-[#203f24]/5">
                    <td className="px-4 py-3">
                      <Link to="/admin/$id" params={{ id: s.id }} className="font-medium underline">
                        {s.name}
                      </Link>
                      <div className="text-xs text-[#2f2f25]/60">{s.email}</div>
                    </td>
                    <td className="px-4 py-3">{s.project_type ?? "—"}</td>
                    <td className="px-4 py-3">{s.budget_range ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs ${STATUS_COLORS[s.status] ?? ""}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#2f2f25]/60">
                      {new Date(s.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}