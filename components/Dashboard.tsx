
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, CheckCircle, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { WeddingData, Task, Transaction, TaskStatus } from '../types';

interface DashboardProps {
  wedding: WeddingData;
  tasks: Task[];
  transactions: Transaction[];
  guests: any[];
}

export const Dashboard: React.FC<DashboardProps> = ({ wedding, tasks, transactions, guests }) => {
  const paidTotal = transactions
    .filter(t => t.type === 'despesa' && t.status === 'pago')
    .reduce((acc, t) => acc + Number(t.value), 0);

  const committedTotal = transactions
    .filter(t => t.type === 'despesa' && t.status !== 'pago')
    .reduce((acc, t) => acc + Number(t.value), 0);

  // Disponível = Orçamento Total - (Tudo que já foi contratado/lançado como gasto)
  const availableBalance = Math.max(0, wedding.budget - (paidTotal + committedTotal));

  const completedTasks = tasks.filter(t => t.status === TaskStatus.CONCLUIDA).length;
  const daysRemaining = Math.ceil((new Date(wedding.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const chartData = [
    { name: 'Pagos', value: paidTotal, fill: '#10b981' }, 
    { name: 'Dívida', value: committedTotal, fill: '#f59e0b' },
    { name: 'Livre', value: availableBalance, fill: '#f472b6' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Olá, {wedding.name.split(' ')[0]}!</h2>
          <p className="text-slate-500 mt-1">Seu casamento em {wedding.city} está tomando forma.</p>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl border shadow-sm flex items-center space-x-3">
          <Clock className="text-pink-500" size={20} />
          <span className="text-sm font-bold text-slate-700">
            {daysRemaining > 0 ? `Faltam ${daysRemaining} dias` : 'É hoje! Felicidades!'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm relative overflow-hidden">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest relative z-10">Orçamento</p>
          <p className="text-2xl font-bold mt-1 relative z-10">R$ {wedding.budget.toLocaleString()}</p>
          <DollarSign className="absolute -right-2 -bottom-2 text-slate-800 opacity-50" size={80} />
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm group hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Já Pagos</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">R$ {paidTotal.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm group hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <AlertTriangle size={24} />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Comprometido</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">R$ {committedTotal.toLocaleString()}</p>
        </div>

        <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100 shadow-sm group hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white text-pink-500 rounded-2xl group-hover:bg-pink-500 group-hover:text-white transition-colors shadow-sm">
              <CheckCircle size={24} />
            </div>
          </div>
          <p className="text-xs font-bold text-pink-400 uppercase tracking-widest">Saldo Livre</p>
          <p className="text-2xl font-bold text-pink-600 mt-1">R$ {availableBalance.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center font-serif italic">
            Visão Geral do Orçamento
          </h3>
          <div className="flex-1 min-h-[300px] w-full" style={{ position: 'relative' }}>
            <ResponsiveContainer width="99%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => `R$ ${value.toLocaleString()}`}
                />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-bold text-slate-800 font-serif italic">Próximos Alvos</h3>
             <span className="text-[10px] font-black text-slate-400">{completedTasks}/{tasks.length} feito</span>
          </div>
          <div className="space-y-4">
            {tasks.filter(t => (t.priority === 'critica' || t.priority === 'alta') && t.status !== TaskStatus.CONCLUIDA).slice(0, 4).map(task => (
              <div key={task.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:border-pink-200 hover:bg-white transition-all">
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-slate-800">{task.title}</h4>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                    task.priority === 'critica' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{task.description}</p>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="text-pink-400" size={24} />
                </div>
                <p className="text-xs text-slate-400 font-medium">Tudo sob controle por enquanto.</p>
              </div>
            )}
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 mt-2">
              Ver Agenda Completa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
