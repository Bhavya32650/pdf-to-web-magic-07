import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Tables, Enums } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Home, Plus, Trash2, LogOut, Search, MapPin, Clock, ImagePlus, X } from "lucide-react";

type SR = Tables<"service_requests">;
type Category = Enums<"service_category">;
type Status = Enums<"service_status">;

const CATEGORIES: Category[] = ["cleaning", "plumbing", "electrical", "appliance", "painting", "pest_control", "other"];
const STATUSES: Status[] = ["pending", "in_progress", "completed", "cancelled"];

const statusColor: Record<Status, string> = {
  pending: "bg-warning/20 text-warning-foreground border-warning/40",
  in_progress: "bg-info/20 text-info border-info/40",
  completed: "bg-success/20 text-success border-success/40",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — Zepnest" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<SR[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  async function load() {
    const { data, error } = await supabase
      .from("service_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return toast.error(error.message);
    setItems(data ?? []);
  }

  useEffect(() => { if (user) load(); }, [user]);

  async function updateStatus(id: string, status: Status) {
    const { error } = await supabase.from("service_requests").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  }

  async function remove(id: string) {
    if (!confirm("Delete this request?")) return;
    const { error } = await supabase.from("service_requests").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  const filtered = items.filter((i) =>
    [i.title, i.description, i.address, i.category].join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 md:px-10 border-b bg-card/60 backdrop-blur sticky top-0 z-10">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <div className="size-8 rounded-lg bg-primary text-primary-foreground grid place-items-center">
            <Home className="size-4" />
          </div>
          Zepnest
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-muted-foreground">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="size-4 mr-1" /> Sign out</Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Service Requests</h1>
            <p className="text-sm text-muted-foreground">Manage your home-care requests end to end.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="size-4 mr-1" /> New request</Button>
            </DialogTrigger>
            <CreateDialog onCreated={() => { setOpen(false); load(); }} />
          </Dialog>
        </div>

        <div className="relative mb-5">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by title, category, address…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground">
            {items.length === 0 ? "No requests yet. Create your first one!" : "No matches."}
          </div>
        ) : (
          <ul className="grid gap-3">
            {filtered.map((r) => (
              <li key={r.id} className="rounded-2xl border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{r.title}</h3>
                      <Badge variant="outline" className="capitalize">{r.category.replace("_", " ")}</Badge>
                      <Badge variant="outline" className={`capitalize ${statusColor[r.status]}`}>
                        {r.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1.5">{r.description}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {r.address}</span>
                      {r.preferred_time && (
                        <span className="flex items-center gap-1"><Clock className="size-3.5" /> {new Date(r.preferred_time).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v as Status)}>
                      <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" onClick={() => remove(r.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="size-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

function CreateDialog({ onCreated }: { onCreated: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("cleaning");
  const [address, setAddress] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("service_requests").insert({
      user_id: user.id,
      title, description, category, address,
      preferred_time: preferredTime ? new Date(preferredTime).toISOString() : null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Request created");
    setTitle(""); setDescription(""); setAddress(""); setPreferredTime(""); setCategory("cleaning");
    onCreated();
  }

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>New service request</DialogTitle></DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Kitchen sink leaking" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="desc">Description</Label>
          <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Describe the issue…" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">{c.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="time">Preferred time</Label>
            <Input id="time" type="datetime-local" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="addr">Address</Label>
          <Input id="addr" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="221B Baker Street" />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={busy}>{busy ? "Creating…" : "Create request"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
