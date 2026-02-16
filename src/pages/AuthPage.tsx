import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Leaf } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = isLogin
      ? await signIn(email, password)
      : await signUp(email, password, name);

    if (result.error) {
      setError(result.error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
      <div className="absolute inset-0 gradient-calm" />

      <div className="relative z-10 w-full max-w-sm animate-fade-up">
        <div className="text-center mb-8 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-serif text-foreground">
              Fresh<span className="text-primary">Start</span>
            </h1>
          </div>
          <p className="text-muted-foreground">Your journey to freedom</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <h2 className="text-xl font-serif text-foreground text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          {!isLogin && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gradient-hero text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "..." : isLogin ? "Sign In" : "Sign Up"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-primary font-semibold hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
