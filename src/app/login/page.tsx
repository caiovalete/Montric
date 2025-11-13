"use client";

import { useState } from "react";
import { Mail, Chrome, Apple } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Erro no login com Google:', error);
      alert('Erro ao fazer login com Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login de usuário existente
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        // Verificar se tem assinatura ativa
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', data.user.id)
          .eq('status', 'ativa')
          .single();
        
        if (subscription) {
          router.push('/');
        } else {
          router.push('/assinatura');
        }
      } else {
        // Criar nova conta
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`
          }
        });
        
        if (error) throw error;
        
        // Criar perfil inicial
        if (data.user) {
          await supabase.from('profiles').insert({
            user_id: data.user.id,
            email: data.user.email,
            onboarding_completo: false
          });
          
          router.push('/onboarding');
        }
      }
    } catch (error: any) {
      console.error('Erro na autenticação:', error);
      alert(error.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#064D58] to-[#085563] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/2e6264b4-2814-4124-b8d2-6d24827789b8.png" 
            alt="Montric Logo" 
            className="h-20 w-20 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-white mb-2">Montric</h1>
          <p className="text-[#2DD6C1]">Seu acompanhamento inteligente</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-[#064D58] mb-2 text-center">
            {isLogin ? "Acesse sua conta" : "Entre ou crie sua conta"}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {isLogin ? "Bem-vindo de volta!" : "Para continuar sua jornada de saúde"}
          </p>

          {/* Botões de Login Social */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all hover:scale-105 disabled:opacity-50"
            >
              <Chrome className="w-5 h-5" />
              Continuar com Google
            </button>

            <button
              disabled
              className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-lg font-semibold opacity-50 cursor-not-allowed"
            >
              <Apple className="w-5 h-5" />
              Continuar com Apple
            </button>
          </div>

          {/* Divisor */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Formulário de Email */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#064D58] text-white py-3 rounded-lg font-semibold hover:bg-[#085563] transition-all hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar conta com E-mail"}
            </button>
          </form>

          {/* Toggle Login/Cadastro */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#064D58] font-medium hover:text-[#085563] transition-colors"
            >
              {isLogin ? "Não tem uma conta? Criar conta" : "Já tenho uma conta"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white text-sm mt-6 opacity-80">
          Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade
        </p>
      </div>
    </div>
  );
}
