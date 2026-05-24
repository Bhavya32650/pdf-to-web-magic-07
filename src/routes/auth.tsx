import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Home } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Zepnest" },
      { name: "description", content: "Sign in or create your Zepnest account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [loading, user, navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created!");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg justify-center mb-8">
          <div className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center">
            <Home className="size-5" />
          </div>
          Zepnest
        </Link>
        <div className="rounded-2xl bg-card border shadow-sm p-6">
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-4 mt-4">
                <Field id="email" label="Email" type="email" value={email} onChange={setEmail} />
                <Field id="password" label="Password" type="password" value={password} onChange={setPassword} />
                <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-4 mt-4">
                <Field id="email2" label="Email" type="email" value={email} onChange={setEmail} />
                <Field id="password2" label="Password (min 6 chars)" type="password" value={password} onChange={setPassword} />
                <Button type="submit" className="w-full" disabled={busy}>{busy ? "Creating..." : "Create account"}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function Field({ id, label, type, value, onChange }: {
  id: string; label: string; type: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} required minLength={type === "password" ? 6 : undefined} />
    </div>
  );
}
