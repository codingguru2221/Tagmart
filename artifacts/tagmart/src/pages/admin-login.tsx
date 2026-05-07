import { useState } from "react";
import { useLogin } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { setAuth } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";

const LOGO_SRC = "/TG%20logo.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { data: { email, password } },
      {
        onSuccess: (resp) => {
          if (resp.user.role !== "admin") {
            toast({ title: "Access denied", description: "This portal is for admins only.", variant: "destructive" });
            return;
          }
          setAuth(resp.token, resp.user);
          toast({ title: "Welcome, Admin!", description: `Logged in as ${resp.user.name}` });
          setLocation("/admin/dashboard");
        },
        onError: () => {
          toast({ title: "Login failed", description: "Invalid admin credentials.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-foreground px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src={LOGO_SRC} alt="Tagmart logo" className="mx-auto mb-5 h-20 w-20 rounded-2xl object-contain" />
          <h1 className="text-3xl font-black text-background mb-2">Admin Portal</h1>
          <p className="text-background/60">Tagmart Management Console</p>
        </div>

        <div className="bg-background rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@tagmart.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base font-bold"
              disabled={login.isPending}
              data-testid="button-admin-login"
            >
              {login.isPending ? "Verifying..." : "Access Dashboard"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-6">
            Default: admin@tagmart.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
