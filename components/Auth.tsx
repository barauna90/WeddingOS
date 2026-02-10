
import React, { useState } from 'react';
import { supabase } from '../services/supabase.ts';
import { Heart, Mail, Lock, Loader2, ArrowRight, AlertCircle } from 'lucide-react';

export const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success' | 'info', text: string, code?: string } | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { emailRedirectTo: window.location.origin }
        });
        
        if (error) throw error;

        if (data.session) {
          setMessage({ type: 'success', text: 'Conta criada e confirmada! Entrando...' });
          // O hook onAuthStateChange cuidará do redirecionamento
        } else {
          setMessage({ 
            type: 'info', 
            text: 'Conta criada! Verifique seu e-mail para confirmar o cadastro.' 
          });
          setIsSignUp(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            setMessage({ 
              type: 'error', 
              text: 'Este e-mail ainda não foi confirmado. Verifique sua caixa de entrada.',
              code: 'email_not_confirmed'
            });
            setIsLoading(false);
            return;
          }
          throw error;
        }
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro na autenticação.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-100/40 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-rose-100/40 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>

      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(236,72,153,0.15)] p-12 text-center relative z-10 border border-pink-50/50">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-pink-200">
            <Heart size={32} fill="white" />
          </div>
        </div>

        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">WeddingOS</h1>
        <p className="text-slate-400 mb-8 text-sm font-medium">A maneira inteligente de organizar seu sonho.</p>

        {message && (
          <div className={`mb-6 p-4 rounded-2xl text-xs font-bold animate-in fade-in zoom-in flex flex-col items-start text-left ${
            message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 
            message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
            'bg-blue-50 text-blue-600 border border-blue-100'
          }`}>
            <div className="flex items-start space-x-3">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="casal@email.com"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit" disabled={isLoading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 shadow-xl"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <><span>{isSignUp ? 'Criar Conta' : 'Acessar Sistema'}</span><ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <button 
          onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}
          className="mt-4 text-sm font-bold text-pink-500 hover:underline"
        >
          {isSignUp ? 'Já tem conta? Login' : 'Não tem conta? Cadastre-se agora'}
        </button>
      </div>
    </div>
  );
};
