
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Checklist } from './components/Checklist';
import { Financial } from './components/Financial';
import { Guests } from './components/Guests';
import { Padrinhos } from './components/Padrinhos';
import { Gifts } from './components/Gifts';
import { SettingsPage } from './components/SettingsPage';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { WeddingData, Task, Guest, Godparent, Gift, Transaction, TaskStatus, RSVPStatus, Priority, GiftStatus } from './types';
import { supabase } from './services/supabase';
import { MOCK_WEDDING } from './constants';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [wedding, setWedding] = useState<WeddingData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [godparents, setGodparents] = useState<Godparent[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
      } else {
        const demo = localStorage.getItem('weddingos_demo_session');
        if (demo) {
          setSession(JSON.parse(demo));
        } else {
          setIsLoading(false);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) return;

    const fetchData = async () => {
      setIsLoading(true);
      
      if (session.isDemo) {
        setWedding(MOCK_WEDDING);
        setTasks([]);
        setGuests([]);
        setGodparents([]);
        setGifts([]);
        setTransactions([]);
        setNeedsOnboarding(false);
        setIsLoading(false);
        return;
      }

      const userId = session.user.id;
      try {
        const { data: weddingData } = await supabase.from('wedding').select('*').eq('user_id', userId).maybeSingle();

        if (weddingData) {
          setWedding({
            name: weddingData.name,
            date: weddingData.date,
            budget: Number(weddingData.budget),
            guestsEstimate: weddingData.guests_estimate,
            style: weddingData.style,
            city: weddingData.city
          });
          setNeedsOnboarding(false);
        } else {
          setNeedsOnboarding(true);
          setIsLoading(false);
          return;
        }

        const [tasksRes, guestsRes, godparentsRes, giftsRes, txRes] = await Promise.all([
          supabase.from('tasks').select('*').eq('user_id', userId).order('deadline', { ascending: true }),
          supabase.from('guests').select('*').eq('user_id', userId),
          supabase.from('godparents').select('*').eq('user_id', userId),
          supabase.from('gifts').select('*').eq('user_id', userId),
          supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false })
        ]);

        if (tasksRes.data) setTasks(tasksRes.data.map(t => ({ ...t, priority: t.priority as Priority, status: t.status as TaskStatus })));
        
        // Fixed mapping to correctly assign plusOnes and rsvpStatus to match the Guest interface
        if (guestsRes.data) setGuests(guestsRes.data.map(g => ({ 
          id: g.id, 
          name: g.name, 
          group: g.group_name, 
          plusOnes: g.plus_ones, 
          rsvpStatus: g.rsvp_status as RSVPStatus, 
          phone: g.phone 
        })));
        
        if (txRes.data) setTransactions(txRes.data.map(tx => ({ ...tx, value: Number(tx.value) })));
        
        setGodparents(godparentsRes.data || []);
        setGifts(giftsRes.data || []);

      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (!session) return <Auth />;

  if (needsOnboarding && !isLoading) {
    return <Onboarding userId={session.user.id} onComplete={(data) => {
      setWedding(data);
      setNeedsOnboarding(false);
    }} />;
  }

  const addTask = async (task: Task) => {
    setTasks(prev => [task, ...prev]);
    if (!session.isDemo) {
      await supabase.from('tasks').insert([{ ...task, user_id: session.user.id }]);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    if (!session.isDemo) {
      await supabase.from('tasks').update(updates).eq('id', id).eq('user_id', session.user.id);
    }
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (!session.isDemo) {
      await supabase.from('tasks').delete().eq('id', id).eq('user_id', session.user.id);
    }
  };

  const addTransaction = async (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
    if (!session.isDemo) {
      await supabase.from('transactions').insert([{ ...tx, user_id: session.user.id }]);
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updates } : tx));
    if (!session.isDemo) {
      await supabase.from('transactions').update(updates).eq('id', id).eq('user_id', session.user.id);
    }
  };

  const deleteTransaction = async (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
    if (!session.isDemo) {
      await supabase.from('transactions').delete().eq('id', id).eq('user_id', session.user.id);
    }
  };

  const addGuest = async (guest: Guest) => {
    setGuests(prev => [guest, ...prev]);
    if (!session.isDemo) {
      await supabase.from('guests').insert([{
        id: guest.id, name: guest.name, group_name: guest.group, plus_ones: guest.plusOnes, rsvp_status: guest.rsvpStatus, phone: guest.phone, user_id: session.user.id
      }]);
    }
  };

  const addGodparent = async (gp: Godparent) => {
    setGodparents(prev => [gp, ...prev]);
    if (!session.isDemo) {
      await supabase.from('godparents').insert([{ ...gp, user_id: session.user.id }]);
    }
  };

  const updateGodparent = async (id: string, updates: Partial<Godparent>) => {
    setGodparents(prev => prev.map(gp => gp.id === id ? { ...gp, ...updates } : gp));
    if (!session.isDemo) {
      await supabase.from('godparents').update(updates).eq('id', id).eq('user_id', session.user.id);
    }
  };

  const deleteGodparent = async (id: string) => {
    setGodparents(prev => prev.filter(gp => gp.id !== id));
    if (!session.isDemo) {
      await supabase.from('godparents').delete().eq('id', id).eq('user_id', session.user.id);
    }
  };

  const addGift = async (gift: Gift) => {
    setGifts(prev => [gift, ...prev]);
    if (!session.isDemo) {
      await supabase.from('gifts').insert([{ ...gift, user_id: session.user.id }]);
    }
  };

  const updateGift = async (id: string, updates: Partial<Gift>) => {
    setGifts(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    if (!session.isDemo) {
      await supabase.from('gifts').update(updates).eq('id', id).eq('user_id', session.user.id);
    }
  };

  const deleteGift = async (id: string) => {
    setGifts(prev => prev.filter(g => g.id !== id));
    if (!session.isDemo) {
      await supabase.from('gifts').delete().eq('id', id).eq('user_id', session.user.id);
    }
  };

  const updateWedding = async (updates: Partial<WeddingData>) => {
    setWedding(prev => prev ? { ...prev, ...updates } : null);
    if (!session.isDemo) {
      await supabase.from('wedding').update({
        name: updates.name,
        date: updates.date,
        budget: updates.budget,
        guests_estimate: updates.guestsEstimate,
        style: updates.style,
        city: updates.city
      }).eq('user_id', session.user.id);
    }
  };

  const logout = async () => {
    if (session.isDemo) {
      localStorage.removeItem('weddingos_demo_session');
      window.location.reload();
    } else {
      await supabase.auth.signOut();
    }
  };

  const renderContent = () => {
    if (isLoading || !wedding) {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          <p className="text-slate-500 font-serif italic">Preparando seu casamento...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard wedding={wedding} tasks={tasks} transactions={transactions} guests={guests} />;
      case 'checklist': return <Checklist tasks={tasks} wedding={wedding} onAddTask={addTask} onUpdateTask={updateTask} onDeleteTask={deleteTask} />;
      case 'guests': return <Guests guests={guests} onAddGuest={addGuest} onUpdateGuest={() => {}} onDeleteGuest={() => {}} />;
      case 'finance': return <Financial transactions={transactions} wedding={wedding} onAddTransaction={addTransaction} onUpdateTransaction={updateTransaction} onDeleteTransaction={deleteTransaction} />;
      case 'padrinhos': return <Padrinhos godparents={godparents} onAdd={addGodparent} onUpdate={updateGodparent} onDelete={deleteGodparent} />;
      case 'gifts': return <Gifts gifts={gifts} onAdd={addGift} onUpdate={updateGift} onDelete={deleteGift} />;
      case 'settings': return <SettingsPage wedding={wedding} user={session.user} onUpdateWedding={updateWedding} onLogout={logout} />;
      default: return <div className="p-20 text-center text-slate-400">Em desenvolvimento.</div>;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={session.user} weddingName={wedding?.name || ''} onLogout={logout}>
      {session.isDemo && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
          <p className="text-xs text-amber-800 font-bold">Você está usando o <span className="uppercase">Modo Demo</span>. Os dados não serão salvos permanentemente.</p>
          <button onClick={logout} className="text-[10px] font-black uppercase text-amber-600 hover:underline">Sair do Modo Demo</button>
        </div>
      )}
      {renderContent()}
    </Layout>
  );
};

export default App;
