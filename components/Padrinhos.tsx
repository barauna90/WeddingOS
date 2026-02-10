
import React, { useState } from 'react';
import { Godparent, GodparentRole } from '../types';
import { Plus, Users, Phone, MessageSquare, CheckCircle2, X, Trash2, Loader2, Star } from 'lucide-react';

interface PadrinhosProps {
  godparents: Godparent[];
  onAdd: (godparent: Godparent) => void;
  onUpdate: (id: string, updates: Partial<Godparent>) => void;
  onDelete: (id: string) => void;
}

export const Padrinhos: React.FC<PadrinhosProps> = ({ godparents, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newGodparent, setNewGodparent] = useState({
    name: '',
    role: GodparentRole.PADRINHO,
    contact: '',
    status: 'convidado' as const,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const item: Godparent = {
      id: crypto.randomUUID(), // Usando UUID real
      ...newGodparent
    };
    await onAdd(item);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setNewGodparent({ name: '', role: GodparentRole.PADRINHO, contact: '', status: 'convidado', notes: '' });
  };

  const getRoleBadge = (role: GodparentRole) => {
    switch(role) {
      case GodparentRole.PADRINHO: return 'bg-blue-100 text-blue-700 border-blue-200';
      case GodparentRole.MADRINHA: return 'bg-pink-100 text-pink-700 border-pink-200';
      case GodparentRole.DAMA: return 'bg-purple-100 text-purple-700 border-purple-200';
      case GodparentRole.PAJEM: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Padrinhos & Madrinhas</h2>
          <p className="text-slate-500">As pessoas mais especiais do seu grande dia.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-lg hover:bg-slate-800 transition-all font-bold text-sm"
        >
          <Plus size={18} />
          <span>Adicionar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {godparents.map((gp) => (
          <div key={gp.id} className="bg-white rounded-[2.5rem] border shadow-sm p-8 group hover:border-pink-200 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-pink-50 group-hover:text-pink-500 transition-all">
                <Users size={28} />
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getRoleBadge(gp.role)}`}>
                {gp.role}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-1">{gp.name}</h3>
            <div className="flex items-center space-x-2 mb-4">
              <span className={`w-2 h-2 rounded-full ${gp.status === 'confirmado' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{gp.status}</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-center text-slate-500 text-sm">
                <Phone size={16} className="mr-3 opacity-50" />
                <span>{gp.contact || 'Sem contato'}</span>
              </div>
              {gp.notes && (
                <div className="flex items-start text-slate-400 text-sm">
                  <MessageSquare size={16} className="mr-3 mt-1 opacity-50 flex-shrink-0" />
                  <p className="line-clamp-2">{gp.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex space-x-2">
                <button 
                  onClick={() => onUpdate(gp.id, { status: gp.status === 'confirmado' ? 'convidado' : 'confirmado' })}
                  className={`p-2 rounded-xl transition-all ${gp.status === 'confirmado' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500'}`}
                >
                  <CheckCircle2 size={18} />
                </button>
                <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-500 transition-all">
                  <Star size={18} />
                </button>
              </div>
              <button 
                onClick={() => onDelete(gp.id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {godparents.length === 0 && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="md:col-span-2 lg:col-span-4 py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group hover:border-pink-300 hover:bg-pink-50/20 transition-all"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-pink-400 group-hover:bg-pink-50 transition-all mb-4">
              <Plus size={32} />
            </div>
            <h3 className="font-bold text-slate-800">Convide seus padrinhos</h3>
            <p className="text-slate-400 text-sm mt-1">Comece a listar as pessoas fundamentais para o altar.</p>
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-8 py-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 font-serif">Adicionar ao Altar</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <input 
                  required
                  className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-slate-800 font-medium"
                  value={newGodparent.name}
                  onChange={e => setNewGodparent({...newGodparent, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Papel</label>
                  <select 
                    className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-slate-800 font-medium"
                    value={newGodparent.role}
                    onChange={e => setNewGodparent({...newGodparent, role: e.target.value as any})}
                  >
                    <option value={GodparentRole.PADRINHO}>Padrinho</option>
                    <option value={GodparentRole.MADRINHA}>Madrinha</option>
                    <option value={GodparentRole.DAMA}>Dama de Honra</option>
                    <option value={GodparentRole.PAJEM}>Pajem</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contato</label>
                  <input 
                    placeholder="(00) 00000-0000"
                    className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-slate-800 font-medium"
                    value={newGodparent.contact}
                    onChange={e => setNewGodparent({...newGodparent, contact: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Observações / Convite</label>
                <textarea 
                  rows={3}
                  placeholder="Ex: Já entregamos o convite físico..."
                  className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-slate-800 font-medium resize-none"
                  value={newGodparent.notes}
                  onChange={e => setNewGodparent({...newGodparent, notes: e.target.value})}
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center space-x-2 mt-4"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Salvar Padrinho'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
