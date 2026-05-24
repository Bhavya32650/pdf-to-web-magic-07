import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Home, Wrench, Sparkles, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zepnest — Home Care, At a Tap" },
      { name: "description", content: "Raise and manage home service requests in seconds." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center">
            <Home className="size-5" />
          </div>
          Zepnest
        </div>
        <div className="flex gap-2">
          <Button asChild variant="ghost"><Link to="/auth">Sign in</Link></Button>
          <Button asChild><Link to="/auth">Get started</Link></Button>
        </div>
      </header>

      <main className="px-6 md:px-12">
        <section className="mx-auto max-w-4xl text-center py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm text-secondary-foreground">
            <Sparkles className="size-4 text-accent" /> Home Care, At a Tap.
          </span>
          <h1 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight">
            Service requests, <span className="text-primary">handled.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Raise a request for cleaning, plumbing, electrical, and more. Track every step from pending to completed — all in one place.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <Button asChild size="lg"><Link to="/auth">Create your first request</Link></Button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto pb-20">
          {[
            { icon: Wrench, title: "Any service", desc: "Cleaning, plumbing, electrical, painting, pest control & more." },
            { icon: ShieldCheck, title: "Secure & private", desc: "Your requests are visible only to you, with secure auth." },
            { icon: Sparkles, title: "End-to-end visibility", desc: "Update status from pending to completed in a tap." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl bg-card p-6 shadow-sm border">
              <div className="size-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
