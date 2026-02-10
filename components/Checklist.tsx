
import React, { useState } from 'react';
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
  Loader2
} from 'lucide-react';

interface ChecklistProps {
  tasks: Task[];
  wedding: WeddingData;
  onAddTask: (task: Task) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export const Checklist: React.FC<ChecklistProps> = ({ tasks, wedding, onAddTask, onUpdateTask }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const newTasks = await generateInitialChecklist(wedding);
      newTasks.forEach((t) => {
        onAddTask({
          id: Math.random().toString(36).substr(2, 9),
          title: t.title || "Nova Tarefa",
          description: t.description || "",
          category: t.category || "Geral",
          priority: (t.priority as Priority) || Priority.MEDIA,
          deadline: t.deadline || new Date().toISOString().split('T')[0],
          status: TaskStatus.PENDENTE,
        });
      });
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Planejamento</h2>
          <p className="text-slate-500">Mantenha cada detalhe sob controle.</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all font-medium"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            <span>{tasks.length === 0 ? "Gerar Checklist com IA" : "Sincronizar IA"}</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white text-slate-700 border rounded-xl hover:bg-slate-50 transition-all font-medium">
            <Plus size={20} />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-4">
          {/* Filters/Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {['Todas', 'Pendentes', 'Concluídas', 'Atrasadas', 'Críticas'].map((tab) => (
              <button key={tab} className="px-4 py-1.5 text-sm font-medium rounded-full bg-white border whitespace-nowrap hover:bg-slate-50">
                {tab}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {tasks.length === 0 && !isGenerating && (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed flex flex-col items-center">
                <Sparkles size={48} className="text-pink-200 mb-4" />
                <h3 className="text-lg font-semibold text-slate-800">Comece seu planejamento inteligente</h3>
                <p className="text-slate-500 max-w-sm mt-1">Use nossa IA para gerar um checklist completo baseado no seu perfil ou adicione tarefas manualmente.</p>
                <button onClick={handleGenerateAI} className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl font-medium">Gerar Checklist</button>
              </div>
            )}
            
            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-5 rounded-2xl border shadow-sm group hover:border-pink-200 transition-colors">
                <div className="flex items-start space-x-4">
                  <button 
                    onClick={() => onUpdateTask(task.id, { status: task.status === TaskStatus.CONCLUIDA ? TaskStatus.PENDENTE : TaskStatus.CONCLUIDA })}
                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.status === TaskStatus.CONCLUIDA 
                      ? 'bg-pink-500 border-pink-500 text-white' 
                      : 'border-slate-300 group-hover:border-pink-400'
                    }`}
                  >
                    {task.status === TaskStatus.CONCLUIDA && <CheckCircle2 size={16} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-base font-semibold truncate ${task.status === TaskStatus.CONCLUIDA ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <ChevronRight className="text-slate-300 group-hover:text-slate-500 transition-colors" size={18} />
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">{task.description}</p>
                    <div className="flex items-center mt-3 space-x-4">
                      <div className="flex items-center text-xs text-slate-400">
                        <Clock size={14} className="mr-1" />
                        <span>Deadline: {new Date(task.deadline).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center text-xs text-slate-400">
                        <AlertCircle size={14} className="mr-1" />
                        <span>{task.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-4">
                <BrainCircuit className="text-pink-400" size={24} />
                <h3 className="font-bold text-lg">IA Organizadora</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Receba recomendações personalizadas baseadas no progresso atual do seu casamento.
              </p>
              <button 
                onClick={handleGetRecs}
                disabled={isLoadingRecs}
                className="w-full py-3 bg-pink-500 rounded-xl text-sm font-bold hover:bg-pink-600 transition-colors flex items-center justify-center space-x-2"
              >
                {isLoadingRecs ? <Loader2 className="animate-spin" size={18} /> : <span>Gerar Insights</span>}
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500 opacity-10 rounded-full -translate-y-16 translate-x-16 blur-3xl"></div>
          </div>

          {recommendations && (
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl animate-in fade-in zoom-in duration-300">
              <h4 className="font-bold text-emerald-900 text-sm mb-3">Recomendações da IA</h4>
              <div className="text-sm text-emerald-800 space-y-2 whitespace-pre-wrap leading-relaxed">
                {recommendations}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
