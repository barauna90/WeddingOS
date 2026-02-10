
import React, { useState } from 'react';
import { Guest, RSVPStatus } from '../types';
import { Plus, Search, Users, Phone, CheckCircle2, Trash2, X, Loader2 } from 'lucide-react';

interface GuestsProps {
  guests: Guest[];
  onAddGuest: (guest: Guest) => void;
  onUpdateGuest: (id: string, updates: Partial<Guest>) => void;
  onDeleteGuest: (id: string) => void;
}

export const Guests: React.FC<GuestsProps> = ({ guests, onAddGuest, onUpdateGuest, onDeleteGuest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newGuest, setNewGuest] = useState({
    name: '',
    group: 'Amigos',
    plusOnes: 0,
    phone: '',
    rsvpStatus: RSVPStatus.NAO_ENVIADO
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const guest: Guest = {
      id: Math.random().toString(36).substr(2, 9),
      ...newGuest
    };
    await onAddGuest(guest);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setNewGuest({ name: '', group: 'Amigos', plusOnes: 0, phone: '', rsvpStatus: RSVPStatus.NAO_ENVIADO });
  };

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRSVPBadge = (status: RSVPStatus) => {
    switch(status) {
      case RSVPStatus.CONFIRMADO: return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case RSVPStatus.NAO_VAI: return 'bg-red-100 text-red-600 border-red-200';
      case RSVPStatus.TALVEZ: return 'bg-amber-100 text-amber-600 border-amber-200';
      case RSVPStatus.ENVIADO: return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const totalConfirmed = guests.reduce((acc, g) => g.rsvpStatus === RSVPStatus.CONFIRMADO ? acc + 1 + g.plusOnes : acc, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Convidados</h2>
          <p className="text-slate-500">Controle de presença e grupos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-lg hover:bg-slate-800 transition-all font-bold text-sm"
        >
          <Plus size={18} />
          <span>Novo Convidado</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total</p>
          <p className="text-2xl font-bold text-slate-900">{guests.length}</p>
        </div>
        <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100">
          <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-1">Confirmados</p>
          <p className="text-2xl font-bold text-emerald-700">{totalConfirmed}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Aguardando</p>
          <p className="text-2xl font-bold text-slate-900">{guests.filter(g => g.rsvpStatus !== RSVPStatus.CONFIRMADO).length}</p>
        </div>
        <div className="bg-red-50 p-5 rounded-3xl border border-red-100">
          <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest mb-1">Declinaram</p>
          <p className="text-2xl font-bold text-red-700">{guests.filter(g => g.rsvpStatus === RSVPStatus.NAO_VAI).length}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between flex-wrap gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou grupo..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none transition-all text-sm text-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b">
              <tr>
                <th className="px-8 py-5">Nome</th>
                <th className="px-8 py-5">Grupo</th>
                <th className="px-8 py-5">Acomp.</th>
                <th className="px-8 py-5">RSVP</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 font-bold text-slate-800">{guest.name}</td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">{guest.group}</span>
                  </td>
                  <td className="px-8 py-5 text-slate-600">+{guest.plusOnes}</td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase border ${getRSVPBadge(guest.rsvpStatus)}`}>
                      {guest.rsvpStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => onDeleteGuest(guest.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-8 py-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 font-serif">Novo Convidado</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <input 
                  required
                  className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none transition-all text-slate-800 font-medium"
                  value={newGuest.name}
                  onChange={e => setNewGuest({...newGuest, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Grupo</label>
                  <select 
                    className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-slate-800 font-medium"
                    value={newGuest.group}
                    onChange={e => setNewGuest({...newGuest, group: e.target.value})}
                  >
                    <option className="text-slate-800">Amigos</option>
                    <option className="text-slate-800">Família Noiva</option>
                    <option className="text-slate-800">Família Noivo</option>
                    <option className="text-slate-800">Trabalho</option>
                    <option className="text-slate-800">Padrinhos</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Acompanhantes</label>
                  <input 
                    type="number"
                    className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-slate-800 font-medium"
                    value={newGuest.plusOnes}
                    onChange={e => setNewGuest({...newGuest, plusOnes: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Telefone / WhatsApp</label>
                <input 
                  placeholder="(00) 00000-0000"
                  className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-slate-800 font-medium"
                  value={newGuest.phone}
                  onChange={e => setNewGuest({...newGuest, phone: e.target.value})}
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center space-x-2 mt-4"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Cadastrar Convidado'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
