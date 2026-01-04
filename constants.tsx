
import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart2, 
  Settings, 
  Plus, 
  Search, 
  Bell, 
  Sparkles,
  Calendar,
  Tag,
  Clock
} from 'lucide-react';

export const CATEGORIES = ['Engineering', 'Marketing', 'Design', 'Sales', 'HR', 'Admin'];

export const NAVIGATION = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, id: 'dashboard' },
  { name: 'Board', icon: <CheckSquare size={20} />, id: 'board' },
  { name: 'Analytics', icon: <BarChart2 size={20} />, id: 'analytics' },
  { name: 'AI Assistant', icon: <Sparkles size={20} />, id: 'ai' },
];

export const STATUS_COLUMNS = [
  { id: 'TODO', title: 'To Do', color: 'bg-slate-200' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'DONE', title: 'Completed', color: 'bg-emerald-100' },
];
