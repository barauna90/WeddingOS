
import React, { useState, useMemo } from 'react';
import { Task, Priority, TaskStatus, WeddingData } from '../types';
import { generateInitialChecklist, getSmartRecommendations } from '../services/geminiService';
import { 
  Plus, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  BrainCircuit,
  Loader2,
  ListFilter
} from 'lucide-react';

interface ChecklistProps {
  tasks: Task[];
  wedding: WeddingData;
  onAddTask: (task: Task) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export const Checklist: React.FC<ChecklistProps> = ({ tasks, wedding, onAddTask, onUpdateTask, onDeleteTask }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'Todas' | 'Pendentes' | 'Concluídas' | 'Atrasadas' | 'Críticas'>('Todas');

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const newTasks = await generateInitialChecklist(wedding);
      for (const t of newTasks) {
        await onAddTask({
          id: crypto.randomUUID(),
          title: t.title || "Nova Tarefa",
          description: t.description || "",
          category: t.category || "Geral",
          priority: (t.priority as Priority) || Priority.MEDIA,
          deadline: t.deadline || new Date().toISOString().split('T')[0],
          status: TaskStatus.PENDENTE,
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGetRecs = async () => {
    setIsLoadingRecs(true);
    try {
      const rec = await getSmartRecommendations(wedding, tasks, []);
      setRecommendations(rec);
    } finally {
      setIsLoadingRecs(false);
    }
  };

  const filteredTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
      if (activeFilter === 'Todas') return true;
      if (activeFilter === 'Pendentes') return task.status !== TaskStatus.CONCLUIDA;
      if (activeFilter === 'Concluídas') return task.status === TaskStatus.CONCLUIDA;
      if (activeFilter === 'Atrasadas') {
        const deadline = new Date(task.deadline);
        return task.status !== TaskStatus.CONCLUIDA && deadline < today;
      }
      if (activeFilter === 'Críticas') return task.priority === Priority.CRITICA;
      return true;
    });
  }, [tasks, activeFilter]);

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case Priority.CRITICA: return 'text-red-600 bg-red-50 border-red-100';
      case Priority.ALTA: return 'text-orange-600 bg-orange-50 border-orange-100';
      case Priority.MEDIA: return 'text-blue-600 bg-blue-50 border-blue-100';
      case Priority.BAIXA: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Planejamento</h2>
          <p className="text-slate-500">Mantenha cada detalhe sob controle.</p>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <button 
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl shadow-lg shadow-pink-200 hover:shadow-xl disabled:opacity-50 transition-all font-bold text-sm"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            <span>Sincronizar IA</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-5 py-3 bg-white text-slate-700 border rounded-2xl hover:bg-slate-50 transition-all font-bold text-sm shadow-sm">
            <Plus size={18} />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-100 text-slate-500 rounded-2xl">
              <ListFilter size={18} />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {['Todas', 'Pendentes', 'Concluídas', 'Atrasadas', 'Críticas'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveFilter(tab as any)}
                  className={`px-5 py-2.5 text-xs font-bold rounded-full border transition-all whitespace-nowrap shadow-sm ${
                    activeFilter === tab 
                      ? 'bg-slate-900 text-white border-slate-900' 
                      : 'bg-white text-slate-700 border-slate-200 hover:border-pink-300 hover:text-pink-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredTasks.length === 0 && !isGenerating && (
              <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-4">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Nenhuma tarefa encontrada</h3>
                <p className="text-slate-400 max-w-sm mt-1 text-sm font-medium">Experimente mudar o filtro ou use a IA para gerar novas tarefas.</p>
              </div>
            )}
            
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-white p-6 rounded-[2rem] border shadow-sm group hover:border-pink-200 hover:shadow-md transition-all">
                <div className="flex items-start space-x-4">
                  <button 
                    onClick={() => onUpdateTask(task.id, { status: task.status === TaskStatus.CONCLUIDA ? TaskStatus.PENDENTE : TaskStatus.CONCLUIDA })}
                    className={`mt-1 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.status === TaskStatus.CONCLUIDA 
                      ? 'bg-pink-500 border-pink-500 text-white' 
                      : 'border-slate-200 group-hover:border-pink-400 bg-slate-50'
                    }`}
                  >
                    {task.status === TaskStatus.CONCLUIDA && <CheckCircle2 size={18} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-base font-bold truncate ${task.status === TaskStatus.CONCLUIDA ? 'text-slate-300 line-through' : 'text-slate-800'}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center space-x-3">
                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <ChevronRight className="text-slate-300 group-hover:text-pink-400 transition-colors" size={20} />
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1 font-medium">{task.description}</p>
                    <div className="flex items-center mt-4 space-x-6">
                      <div className="flex items-center text-[11px] font-bold text-slate-400">
                        <Clock size={14} className="mr-2 text-pink-400" />
                        <span>{new Date(task.deadline).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center text-[11px] font-bold text-slate-400">
                        <AlertCircle size={14} className="mr-2 text-slate-300" />
                        <span className="uppercase tracking-tighter">{task.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-pink-500/20 rounded-xl">
                  <BrainCircuit className="text-pink-400" size={24} />
                </div>
                <h3 className="font-bold text-lg font-serif">IA Organizadora</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-8 font-medium">
                Sua assistente está analisando seu progresso para oferecer os melhores próximos passos.
              </p>
              <button 
                onClick={handleGetRecs}
                disabled={isLoadingRecs}
                className="w-full py-4 bg-pink-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center space-x-2"
              >
                {isLoadingRecs ? <Loader2 className="animate-spin" size={18} /> : <span>Gerar Insights</span>}
              </button>
            </div>
          </div>

          {recommendations && (
            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] animate-in fade-in zoom-in duration-300">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="text-emerald-500" size={18} />
                <h4 className="font-bold text-emerald-900 text-sm uppercase tracking-widest">Recomendações</h4>
              </div>
              <div className="text-sm text-emerald-800 space-y-3 whitespace-pre-wrap leading-relaxed font-medium">
                {recommendations}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
