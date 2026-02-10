
import React, { useState } from 'react';
import { WeddingData } from '../types.ts';
import { Settings, User, Bell, Shield, Palette, Save, Loader2, Calendar, MapPin, DollarSign, LogOut } from 'lucide-react';

interface SettingsProps {
  wedding: WeddingData;
  user: any;
  onUpdateWedding: (data: Partial<WeddingData>) => void;
  onLogout: () => void;
}

export const SettingsPage: React.FC<SettingsProps> = ({ wedding, user, onUpdateWedding, onLogout }) => {
  const [activeSection, setActiveSection] = useState<'evento' | 'perfil' | 'notificacoes'>('evento');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ ...wedding });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simular atraso para UX premium
    await new Promise(r => setTimeout(r, 800));
    onUpdateWedding(formData);
    setIsSaving(false);
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Configurações</h2>
          <p className="text-slate-500">Personalize sua experiência no WeddingOS.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-2">
          <button 
            onClick={() => setActiveSection('evento')}
            className={`w-full flex items-center space-x-3 px-5 py-4 rounded-[1.5rem] font-bold text-sm transition-all ${
              activeSection === 'evento' ? 'bg-white text-pink-500 shadow-sm border-pink-100 border' : 'text-slate-400 hover:bg-slate-100'
            }`}
          >
            <Settings size={20} />
            <span>Meu Evento</span>
          </button>
          <button 
            onClick={() => setActiveSection('perfil')}
            className={`w-full flex items-center space-x-3 px-5 py-4 rounded-[1.5rem] font-bold text-sm transition-all ${
              activeSection === 'perfil' ? 'bg-white text-pink-500 shadow-sm border-pink-100 border' : 'text-slate-400 hover:bg-slate-100'
            }`}
          >
            <User size={20} />
            <span>Perfil & Conta</span>
          </button>
          <button 
            onClick={() => setActiveSection('notificacoes')}
            className={`w-full flex items-center space-x-3 px-5 py-4 rounded-[1.5rem] font-bold text-sm transition-all ${
              activeSection === 'notificacoes' ? 'bg-white text-pink-500 shadow-sm border-pink-100 border' : 'text-slate-400 hover:bg-slate-100'
            }`}
          >
            <Bell size={20} />
            <span>Notificações</span>
          </button>
          <div className="pt-8 mt-8 border-t border-slate-100">
            <button 
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-5 py-4 rounded-[1.5rem] font-bold text-sm text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <LogOut size={20} />
              <span>Sair da Conta</span>
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
            {activeSection === 'evento' && (
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-pink-50 text-pink-500 rounded-2xl">
                    <Settings size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 font-serif">Detalhes do Evento</h3>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Título do Evento</label>
                    <input 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-100 outline-none text-slate-800 font-bold"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Data</label>
                      <div className="relative">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="date"
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-100 outline-none text-slate-800 font-bold"
                          value={formData.date}
                          onChange={e => setFormData({...formData, date: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Budget Total (R$)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="number"
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-100 outline-none text-slate-800 font-bold"
                          value={formData.budget}
                          onChange={e => setFormData({...formData, budget: parseFloat(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cidade</label>
                      <div className="relative">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-100 outline-none text-slate-800 font-bold"
                          value={formData.city}
                          onChange={e => setFormData({...formData, city: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Estilo</label>
                      <select 
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-100 outline-none text-slate-800 font-bold appearance-none"
                        value={formData.style}
                        onChange={e => setFormData({...formData, style: e.target.value})}
                      >
                        <option>Rústico</option>
                        <option>Clássico</option>
                        <option>Industrial</option>
                        <option>Mini Wedding</option>
                        <option>Praia</option>
                        <option>Campo</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center space-x-3 mt-4"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /><span>Salvar Alterações</span></>}
                  </button>
                </form>
              </div>
            )}

            {activeSection === 'perfil' && (
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                    <User size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 font-serif">Minha Conta</h3>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-400">
                      <User size={40} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{user?.email || 'Usuário WeddingOS'}</h4>
                      <p className="text-sm text-slate-400 font-medium">Cadastrado desde Janeiro de 2025</p>
                      <button className="text-xs font-black uppercase text-pink-500 hover:underline mt-2">Alterar Foto de Perfil</button>
                    </div>
                  </div>

                  <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
                    <h5 className="font-bold text-amber-800 text-sm mb-2">Segurança da Conta</h5>
                    <p className="text-sm text-amber-700 leading-relaxed mb-4">Mantenha sua senha segura para proteger os dados do seu casamento e as informações dos fornecedores.</p>
                    <button className="px-5 py-2.5 bg-white text-amber-700 border border-amber-200 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all">Redefinir Senha</button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notificacoes' && (
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
                    <Bell size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 font-serif">Alertas & Avisos</h3>
                </div>

                <div className="space-y-6">
                  {[
                    { title: 'Pagamentos Próximos', desc: 'Avisar 7 dias antes do vencimento de parcelas.' },
                    { title: 'Checklist Semanal', desc: 'Resumo por e-mail das tarefas da próxima semana.' },
                    { title: 'Novos RSVP', desc: 'Notificar quando um convidado confirmar presença.' },
                    { title: 'Dicas da IA', desc: 'Recomendações periódicas para otimizar o planejamento.' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="max-w-md">
                        <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                      <div className="w-12 h-6 bg-pink-500 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
