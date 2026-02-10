
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { Checklist } from './components/Checklist.tsx';
import { Financial } from './components/Financial.tsx';
import { Guests } from './components/Guests.tsx';
import { Padrinhos } from './components/Padrinhos.tsx';
import { Gifts } from './components/Gifts.tsx';
import { SettingsPage } from './components/SettingsPage.tsx';
import { Auth } from './components/Auth.tsx';
import { Onboarding } from './components/Onboarding.tsx';
import { WeddingData, Task, Guest, Godparent, Gift, Transaction, TaskStatus, RSVPStatus, Priority, GiftStatus } from './types.ts';
import { supabase } from './services/supabase.ts';

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
      setSession(session);
      if (!session) setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) return;

    const fetchData = async () => {
      setIsLoading(true);
      const userId = session.user.id;
      
      try {
        const { data: weddingData, error: wError } = await supabase
          .from('wedding')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (wError) throw wError;

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
        console.error("Erro ao carregar dados do banco:", error);
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
    await supabase.from('tasks').insert([{ ...task, user_id: session.user.id }]);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    await supabase.from('tasks').update(updates).eq('id', id).eq('user_id', session.user.id);
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await supabase.from('tasks').delete().eq('id', id).eq('user_id', session.user.id);
  };

  const addTransaction = async (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
    await supabase.from('transactions').insert([{ ...tx, user_id: session.user.id }]);
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updates } : tx));
    await supabase.from('transactions').update(updates).eq('id', id).eq('user_id', session.user.id);
  };

  const deleteTransaction = async (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
    await supabase.from('transactions').delete().eq('id', id).eq('user_id', session.user.id);
  };

  const addGuest = async (guest: Guest) => {
    setGuests(prev => [guest, ...prev]);
    await supabase.from('guests').insert([{
      id: guest.id, 
      name: guest.name, 
      group_name: guest.group, 
      plus_ones: guest.plusOnes, 
      rsvp_status: guest.rsvpStatus, 
      phone: guest.phone, 
      user_id: session.user.id
    }]);
  };

  const updateGuest = async (id: string, updates: Partial<Guest>) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.group) dbUpdates.group_name = updates.group;
    if (updates.plusOnes !== undefined) dbUpdates.plus_ones = updates.plusOnes;
    if (updates.rsvpStatus) dbUpdates.rsvp_status = updates.rsvpStatus;
    if (updates.phone) dbUpdates.phone = updates.phone;
    await supabase.from('guests').update(dbUpdates).eq('id', id).eq('user_id', session.user.id);
  };

  const deleteGuest = async (id: string) => {
    setGuests(prev => prev.filter(g => g.id !== id));
    await supabase.from('guests').delete().eq('id', id).eq('user_id', session.user.id);
  };

  const addGodparent = async (gp: Godparent) => {
    setGodparents(prev => [gp, ...prev]);
    await supabase.from('godparents').insert([{ ...gp, user_id: session.user.id }]);
  };

  const updateGodparent = async (id: string, updates: Partial<Godparent>) => {
    setGodparents(prev => prev.map(gp => gp.id === id ? { ...gp, ...updates } : gp));
    await supabase.from('godparents').update(updates).eq('id', id).eq('user_id', session.user.id);
  };

  const deleteGodparent = async (id: string) => {
    setGodparents(prev => prev.filter(gp => gp.id !== id));
    await supabase.from('godparents').delete().eq('id', id).eq('user_id', session.user.id);
  };

  const addGift = async (gift: Gift) => {
    setGifts(prev => [gift, ...prev]);
    await supabase.from('gifts').insert([{ ...gift, user_id: session.user.id }]);
  };

  const updateGift = async (id: string, updates: Partial<Gift>) => {
    setGifts(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    await supabase.from('gifts').update(updates).eq('id', id).eq('user_id', session.user.id);
  };

  const deleteGift = async (id: string) => {
    setGifts(prev => prev.filter(g => g.id !== id));
    await supabase.from('gifts').delete().eq('id', id).eq('user_id', session.user.id);
  };

  const updateWedding = async (updates: Partial<WeddingData>) => {
    setWedding(prev => prev ? { ...prev, ...updates } : null);
    await supabase.from('wedding').update({
      name: updates.name,
      date: updates.date,
      budget: updates.budget,
      guests_estimate: updates.guestsEstimate,
      style: updates.style,
      city: updates.city
    }).eq('user_id', session.user.id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const renderContent = () => {
    if (isLoading || !wedding) {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          <p className="text-slate-500 font-serif italic">Sincronizando com a nuvem...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard wedding={wedding} tasks={tasks} transactions={transactions} guests={guests} />;
      case 'checklist': 
        return <Checklist tasks={tasks} wedding={wedding} onAddTask={addTask} onUpdateTask={updateTask} onDeleteTask={deleteTask} />;
      case 'guests': 
        return <Guests guests={guests} onAddGuest={addGuest} onUpdateGuest={updateGuest} onDeleteGuest={deleteGuest} />;
      case 'finance': 
        return <Financial transactions={transactions} wedding={wedding} onAddTransaction={addTransaction} onUpdateTransaction={updateTransaction} onDeleteTransaction={deleteTransaction} />;
      case 'padrinhos': 
        return <Padrinhos godparents={godparents} onAdd={addGodparent} onUpdate={updateGodparent} onDelete={deleteGodparent} />;
      case 'gifts': 
        return <Gifts gifts={gifts} onAdd={addGift} onUpdate={updateGift} onDelete={deleteGift} />;
      case 'settings': 
        return <SettingsPage wedding={wedding} user={session.user} onUpdateWedding={updateWedding} onLogout={logout} />;
      default: 
        return <div className="p-20 text-center text-slate-400">Página em construção.</div>;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={session.user} weddingName={wedding?.name || ''} onLogout={logout}>
      {renderContent()}
    </Layout>
  );
};

export default App;
