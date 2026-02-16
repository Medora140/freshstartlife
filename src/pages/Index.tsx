import { useAuth } from "@/hooks/useAuth";
import AuthPage from "./AuthPage";
import Dashboard from "./Dashboard";
import { Leaf } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-soft text-primary">
          <Leaf className="w-12 h-12" />
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthPage />;
};

export default Index;
