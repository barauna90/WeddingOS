
import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';
import { Menu, X, Bell, Search, User, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  weddingName: string;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, weddingName, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col z-50`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold font-serif tracking-tight text-pink-200">WeddingOS</h1>
          ) : (
            <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center font-serif text-white font-bold">W</div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors group ${
                activeTab === item.id 
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isSidebarOpen && <span className="ml-3 font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <button onClick={onLogout} className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors text-sm font-medium">
             <LogOut size={18} />
             {isSidebarOpen && <span>Sair do App</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar em tarefas, convidados..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs w-64 focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 border-2 border-white rounded-full"></span>
            </button>
            
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-3 pl-4 border-l focus:outline-none group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                  {weddingName || 'Meu Casamento'}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Workspace</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-pink-100 group-hover:text-pink-500 transition-all">
                <User size={20} />
              </div>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#fafafa] p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
