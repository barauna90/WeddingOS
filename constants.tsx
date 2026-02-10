
import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  DollarSign, 
  Gift, 
  Calendar,
  Settings,
  Truck
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'checklist', label: 'Checklist', icon: <CheckSquare size={20} /> },
  { id: 'guests', label: 'Convidados', icon: <Users size={20} /> },
  { id: 'finance', label: 'Financeiro', icon: <DollarSign size={20} /> },
  { id: 'padrinhos', label: 'Padrinhos', icon: <Calendar size={20} /> },
  { id: 'gifts', label: 'Presentes', icon: <Gift size={20} /> },
  { id: 'suppliers', label: 'Fornecedores', icon: <Truck size={20} /> },
  { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
];

export const CATEGORIES = [
  'Planejamento',
  'Local & Buffet',
  'Decoração',
  'Foto & Vídeo',
  'Música',
  'Vestuário',
  'Beleza',
  'Papelaria',
  'Documentação',
  'Lua de Mel'
];

export const MOCK_WEDDING = {
  name: "Casamento de Maria & João",
  date: "2025-12-20",
  budget: 80000,
  guestsEstimate: 150,
  style: "Rústico Chic",
  city: "São Paulo"
};
