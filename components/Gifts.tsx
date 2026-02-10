
import React, { useState } from 'react';
import { Gift, GiftStatus } from '../types';
import { Plus, Gift as GiftIcon, Search, Filter, X, Loader2, CheckCircle, Package, ExternalLink, MessageSquareQuote } from 'lucide-react';

interface GiftsProps {
  gifts: Gift[];
  onAdd: (gift: Gift) => void;
  onUpdate: (id: string, updates: Partial<Gift>) => void;
  onDelete: (id: string) => void;
}

export const Gifts: React.FC<GiftsProps> = ({ gifts, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeType, setActiveType] = useState<'casamento' | 'cha_de_panela' | 'todos'>('todos');
  
  // Explicitly type the state to allow all valid listType values to fix type error on line 217
  const [newGift, setNewGift] = useState<{
    name: string;
    category: string;
    estimatedValue: number;
    status: GiftStatus;
    listType: 'casamento' | 'cha_de_panela' | 'custom';
  }>({
    name: '',
    category: 'Cozinha',
    estimatedValue: 0,
    status: GiftStatus.DISPONIVEL,
    listType: 'casamento'
  });

  const filteredGifts = gifts.filter(g => activeType === 'todos' || g.listType === activeType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const item: Gift = {
      id: Math.random().toString(36).substr(2, 9),
      ...newGift
    };
    await onAdd(item);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setNewGift({ name: '', category: 'Cozinha', estimatedValue: 0, status: GiftStatus.DISPONIVEL, listType: 'casamento' });
  };

  const getStatusInfo = (status: GiftStatus) => {
    switch(status) {
      case GiftStatus.DISPONIVEL: return { label: 'Disponível', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
      case GiftStatus.RESERVADO: return { label: 'Reservado', color: 'bg-blue-50 text-blue-600 border-blue-100' };
      case GiftStatus.RECEBIDO: return { label: 'Recebido', color: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  const totalValue = filteredGifts.reduce((acc, g) => acc + g.estimatedValue, 0);
  const receivedCount = filteredGifts.filter(g => g.status === GiftStatus.RECEBIDO).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Listas de Presentes</h2>
          <p className="text-slate-500">Gerencie seus desejos e agradeça aos convidados.</p>
        </div>
        <div className="flex space-x-3">
           <button className="flex items-center space-x-2 px-5 py-3 bg-white text-slate-600 border rounded-2xl hover:bg-slate-50 transition-all font-bold text-sm">
            <ExternalLink size={18} />
            <span>Compartilhar</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-2xl shadow-lg hover:bg-pink-600 transition-all font-bold text-sm"
          >
            <Plus size={18} />
            <span>Novo Item</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Itens na Lista</p>
          <p className="text-3xl font-bold text-slate-900">{filteredGifts.length}</p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
          <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-1">Valor Estimado</p>
          <p className="text-3xl font-bold text-emerald-700">R$ {totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-white">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Recebidos</p>
          <p className="text-3xl font-bold">{receivedCount} itens</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
        <div className="p-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex space-x-2">
            {(['todos', 'casamento', 'cha_de_panela'] as const).map(type => (
              <button 
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeType === type ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                {type === 'todos' ? 'Todos' : type === 'cha_de_panela' ? 'Chá de Panela' : 'Casamento'}
              </button>
            ))}
          </div>
          <div className="relative">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
              placeholder="Buscar presente..."
              className="pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-sm text-slate-800 w-full md:w-64 focus:ring-2 focus:ring-pink-100"
             />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-8 gap-6">
          {filteredGifts.map((gift) => (
            <div key={gift.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl hover:shadow-pink-500/5 hover:border-pink-100 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-4 rounded-2xl ${gift.status === GiftStatus.RECEBIDO ? 'bg-slate-50 text-slate-300' : 'bg-pink-50 text-pink-500'} group-hover:scale-110 transition-transform`}>
                   <GiftIcon size={24} />
                </div>
                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase border ${getStatusInfo(gift.status).color}`}>
                  {getStatusInfo(gift.status).label}
                </span>
              </div>
              
              <h3 className={`text-lg font-bold mb-1 ${gift.status === GiftStatus.RECEBIDO ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{gift.name}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-4">{gift.category} • {gift.listType.replace('_', ' ')}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-sm font-bold text-slate-900">R$ {gift.estimatedValue.toLocaleString()}</span>
                <div className="flex space-x-2">
                  {gift.status !== GiftStatus.RECEBIDO ? (
                    <button 
                      onClick={() => onUpdate(gift.id, { status: GiftStatus.RECEBIDO })}
                      className="p-2 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                    >
                      <Package size={18} />
                    </button>
                  ) : (
                    <div className="p-2 bg-slate-50 text-slate-300 rounded-xl">
                      <CheckCircle size={18} />
                    </div>
                  )}
                  <button onClick={() => onDelete(gift.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredGifts.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-4">
                <GiftIcon size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Sua lista está vazia</h3>
              <p className="text-slate-400 text-sm max-w-xs mt-1">Adicione itens para que seus convidados saibam como presentear o casal.</p>
              <button onClick={() => setIsModalOpen(true)} className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm">Criar Primeiro Item</button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-8 py-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 font-serif">Novo Presente</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">O que é?</label>
                <input 
                  required
                  placeholder="Ex: Jogo de Jantar 42 Peças"
                  className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-slate-800 font-medium"
                  value={newGift.name}
                  onChange={e => setNewGift({...newGift, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                  <select 
                    className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-slate-800 font-medium"
                    value={newGift.category}
                    onChange={e => setNewGift({...newGift, category: e.target.value})}
                  >
                    <option>Cozinha</option>
                    <option>Quarto</option>
                    <option>Sala de Estar</option>
                    <option>Eletrodomésticos</option>
                    <option>Decoração</option>
                    <option>Lazer</option>
                    <option>Outros</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Valor Médio (R$)</label>
                  <input 
                    type="number"
                    className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-slate-800 font-medium"
                    value={newGift.estimatedValue}
                    onChange={e => setNewGift({...newGift, estimatedValue: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Destinar à Lista</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['casamento', 'cha_de_panela', 'custom'] as const).map(type => (
                    <button 
                      key={type}
                      type="button"
                      // Fix: type is one of "casamento" | "cha_de_panela" | "custom", matching the explicit union type in newGift state
                      onClick={() => setNewGift({...newGift, listType: type})}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                        newGift.listType === type ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center space-x-2 mt-4"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Adicionar à Lista'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
