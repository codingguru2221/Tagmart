import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useRegister } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { setAuth } from "@/lib/auth";

const LOGO_SRC = "/TG%20logo.png";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const register = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate(
      { data: form },
      {
        onSuccess: (resp) => {
          setAuth(resp.token, resp.user);
          toast({ title: "Account created!", description: `Welcome to Tagmart, ${resp.user.name}!` });
          setLocation("/");
        },
        onError: () => {
          toast({ title: "Registration failed", description: "Email may already be in use.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-muted/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={LOGO_SRC} alt="Tagmart logo" className="mx-auto mb-4 h-16 w-16 rounded-2xl object-contain" />
          <h1 className="text-3xl font-black tracking-tight mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join Tagmart for a better shopping experience</p>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Ahmed Khan" value={form.name} onChange={handleChange} required data-testid="input-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="ahmed@example.com" value={form.email} onChange={handleChange} required data-testid="input-email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" placeholder="03001234567" value={form.phone} onChange={handleChange} data-testid="input-phone" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Create a password" value={form.password} onChange={handleChange} required data-testid="input-password" />
            </div>
            <Button type="submit" className="w-full h-12 text-base font-bold" disabled={register.isPending} data-testid="button-submit">
              {register.isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
