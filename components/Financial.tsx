
import React, { useState, useMemo } from 'react';
import { Transaction, WeddingData } from '../types';
import { Plus, Download, Filter, ArrowUpCircle, Wallet, X, Loader2, Edit2, Trash2, CheckCircle2, AlertTriangle, ListFilter } from 'lucide-react';

interface FinancialProps {
  transactions: Transaction[];
  wedding: WeddingData;
  onAddTransaction: (tx: Transaction) => void;
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
}

export const Financial: React.FC<FinancialProps> = ({ transactions, wedding, onAddTransaction, onUpdateTransaction, onDeleteTransaction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pago' | 'pendente' | 'atrasado'>('todos');

  const [formData, setFormData] = useState<{
    description: string;
    value: number;
    date: string;
    category: string;
    status: Transaction['status'];
    type: Transaction['type'];
  }>({
    description: '',
    value: 0,
    date: new Date().toISOString().split('T')[0],
    category: 'Local & Buffet',
    status: 'pendente',
    type: 'despesa'
  });

  // Cálculos Financeiros
  const paidTotal = transactions
    .filter(t => t.type === 'despesa' && t.status === 'pago')
    .reduce((acc, t) => acc + Number(t.value), 0);

  // Comprometido: Soma o que ainda não foi pago (Pendente ou Atrasado)
  const committedTotal = transactions
    .filter(t => t.type === 'despesa' && t.status !== 'pago')
    .reduce((acc, t) => acc + Number(t.value), 0);

  // Saldo Livre = Orçamento - (Já Gasto + O que pretendo gastar/já contratado)
  const availableBalance = Math.max(0, wedding.budget - (paidTotal + committedTotal));

  // Filtro e Ordenação
  const filteredTransactions = useMemo(() => {
    let result = transactions;
    if (statusFilter !== 'todos') {
      result = result.filter(t => t.status === statusFilter);
    }
    return [...result].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, statusFilter]);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      description: '',
      value: 0,
      date: new Date().toISOString().split('T')[0],
      category: 'Local & Buffet',
      status: 'pendente',
      type: 'despesa'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tx: Transaction) => {
    setEditingId(tx.id);
    setFormData({
      description: tx.description,
      value: tx.value,
      date: tx.date,
      category: tx.category,
      status: tx.status,
      type: tx.type
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (editingId) {
      await onUpdateTransaction(editingId, formData);
    } else {
      const tx: Transaction = {
        id: crypto.randomUUID(),
        ...formData
      };
      await onAddTransaction(tx);
    }
    
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
      await onDeleteTransaction(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Financeiro</h2>
          <p className="text-slate-500">Gestão orçamentária e fluxo de caixa.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-5 py-3 bg-white text-slate-600 border rounded-2xl hover:bg-slate-50 transition-all font-bold text-sm shadow-sm">
            <Download size={18} />
            <span>Relatórios</span>
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-2xl shadow-lg hover:bg-pink-600 transition-all font-bold text-sm"
          >
            <Plus size={18} />
            <span>Novo Gasto</span>
          </button>
        </div>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 text-white p-6 rounded-[2rem] relative overflow-hidden shadow-xl">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Budget Total</p>
          <p className="text-2xl font-bold mt-1">R$ {wedding.budget.toLocaleString()}</p>
          <Wallet className="absolute -right-4 -bottom-4 text-slate-800 opacity-40" size={80} />
        </div>

        <div className="bg-white p-6 rounded-[2rem] border shadow-sm border-emerald-100">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
              <CheckCircle2 size={18} />
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Já Pagos</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600">R$ {paidTotal.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border shadow-sm border-amber-100">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
              <AlertTriangle size={18} />
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Comprometido</p>
          </div>
          <p className="text-2xl font-bold text-amber-600">R$ {committedTotal.toLocaleString()}</p>
          <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-tight">* Em aberto / Dívida</p>
        </div>

        <div className="bg-pink-50 p-6 rounded-[2rem] border border-pink-100 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-white text-pink-500 rounded-xl shadow-sm">
              <ArrowUpCircle size={18} />
            </div>
            <p className="text-pink-400 text-[10px] font-bold uppercase tracking-widest">Saldo Livre</p>
          </div>
          <p className="text-2xl font-bold text-pink-600">R$ {availableBalance.toLocaleString()}</p>
        </div>
      </div>

      {/* Lista de Lançamentos com Filtros */}
      <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
        <div className="p-8 border-b flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl">
              <ListFilter size={20} />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'pago', label: 'Pagos' },
                { id: 'pendente', label: 'Pendentes' },
                { id: 'atrasado', label: 'Atrasados' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setStatusFilter(filter.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    statusFilter === filter.id 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                      : 'bg-white text-slate-400 border-slate-100 hover:border-pink-200 hover:text-pink-600 shadow-sm'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Exibindo {filteredTransactions.length} lançamentos</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b">
              <tr>
                <th className="px-8 py-5">Data</th>
                <th className="px-8 py-5">Descrição</th>
                <th className="px-8 py-5">Categoria</th>
                <th className="px-8 py-5">Valor</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 text-slate-400 font-medium">
                    {new Date(t.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-800">{t.description}</td>
                  <td className="px-8 py-5">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-tight">{t.category}</span>
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-900">R$ {Number(t.value).toLocaleString()}</td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase border ${
                      t.status === 'pago' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 
                      t.status === 'atrasado' ? 'bg-red-100 text-red-600 border-red-200' : 'bg-amber-100 text-amber-600 border-amber-200'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenEditModal(t)}
                        className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-medium italic">Nenhum lançamento encontrado para este filtro.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-8 py-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 font-serif">
                {editingId ? 'Editar Lançamento' : 'Novo Lançamento'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
                <input 
                  required
                  placeholder="Ex: Parcela do Buffet"
                  className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-slate-800 font-medium"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Valor (R$)</label>
                  <input 
                    type="number"
                    required
                    step="0.01"
                    className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-slate-800 font-medium"
                    value={formData.value}
                    onChange={e => setFormData({...formData, value: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Data</label>
                  <input 
                    type="date"
                    required
                    className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-slate-800 font-medium"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                  <select 
                    className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-slate-800 font-medium"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Local & Buffet</option>
                    <option>Decoração</option>
                    <option>Foto & Vídeo</option>
                    <option>Vestuário</option>
                    <option>Outros</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
                  <select 
                    className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-slate-800 font-medium"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                    <option value="atrasado">Atrasado</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Salvar' : 'Cadastrar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
