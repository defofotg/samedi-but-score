
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthUser } from "@/hooks/useAuthUser";
import { toast } from "@/components/ui/use-toast";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const { isAuthenticated, loading } = useAuthUser();
  const navigate = useNavigate();

  // Redirect si déjà loggé
  if (!loading && isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    if (mode === "signup") {
      const redirectTo = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) {
        toast({ title: "Erreur Inscription", description: error.message });
      } else {
        toast({ 
          title: "Inscription réussie !",
          description: "Vérifiez votre boîte mail pour confirmer votre adresse."
        });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Erreur Connexion", description: error.message });
      }
    }

    setPending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-2">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {mode === "login" ? "Connexion à StatSport" : "Créer un compte"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              placeholder="E-mail"
              autoComplete="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={pending}
            />
            <Input
              placeholder="Mot de passe"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={pending}
              minLength={6}
            />
            <Button type="submit" className="w-full" disabled={pending}>
              {pending
                ? "Chargement..."
                : mode === "login"
                ? "Se connecter"
                : "Créer le compte"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm flex flex-col gap-2">
            <span>
              {mode === "login" ? (
                <>
                  Pas de compte ?{" "}
                  <button onClick={() => setMode("signup")} className="text-green-700 underline">Créer un compte</button>
                </>
              ) : (
                <>
                  Déjà un compte ?{" "}
                  <button onClick={() => setMode("login")} className="text-green-700 underline">Se connecter</button>
                </>
              )}
            </span>
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 underline underline-offset-2 text-xs"
              type="button"
            >
              Retour à l’accueil
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
