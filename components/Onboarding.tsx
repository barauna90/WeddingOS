
import React, { useState } from 'react';
import { supabase } from '../services/supabase.ts';
import { Heart, Calendar, DollarSign, MapPin, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { WeddingData } from '../types.ts';

interface OnboardingProps {
  userId: string;
  onComplete: (data: WeddingData) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ userId, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    budget: 50000,
    guestsEstimate: 100,
    style: 'Clássico',
    city: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('wedding')
        .insert([{
          name: formData.name,
          date: formData.date,
          budget: formData.budget,
          guests_estimate: formData.guestsEstimate,
          style: formData.style,
          city: formData.city,
          user_id: userId
        }])
        .select()
        .single();

      if (error) throw error;
      
      onComplete({
        name: formData.name,
        date: formData.date,
        budget: formData.budget,
        guestsEstimate: formData.guestsEstimate,
        style: formData.style,
        city: formData.city
      });
    } catch (error: any) {
      console.error("Erro no onboarding:", error);
      alert("Erro ao salvar: " + (error.message || "Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] p-14 border border-pink-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-pink-100 opacity-20 rotate-12">
          <Sparkles size={180} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200">
              <Heart size={28} fill="white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Comece o Planejamento</h2>
              <p className="text-slate-400 text-sm font-medium">Conte-nos um pouco sobre o seu dia especial.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título do Evento</label>
                <input 
                  required
                  placeholder="Ex: Casamento de Ana & Bento"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:bg-white focus:border-pink-200 outline-none transition-all font-bold text-slate-800"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Prevista</label>
                <div className="relative">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="date"
                    required
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:bg-white focus:border-pink-200 outline-none transition-all font-bold text-slate-800"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Orçamento Estimado (R$)</label>
                <div className="relative">
                  <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="number"
                    required
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:bg-white focus:border-pink-200 outline-none transition-all font-bold text-slate-800"
                    value={formData.budget}
                    onChange={e => setFormData({...formData, budget: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cidade do Evento</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    required
                    placeholder="Ex: Curitiba - PR"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:bg-white focus:border-pink-200 outline-none transition-all font-bold text-slate-800"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center space-x-3 disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                  <span>Criar Meu Casamento</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
