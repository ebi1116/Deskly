
import React, { useState, useEffect, useMemo } from 'react';
import { Task, TaskStatus, TaskPriority, UserRole } from './types';
import { NAVIGATION, CATEGORIES } from './constants';
import Board from './components/Board';
import Dashboard from './components/Dashboard';
import AIChat from './components/AIChat';
import TaskModal from './components/TaskModal';
import Login from './components/Login';
import ProfileMenu from './components/ProfileMenu';
import { Bell, Search, Plus, Sparkles, Contact, LogOut, ShieldCheck, Users } from 'lucide-react';

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Q4 Budget Proposal',
    description: 'Review last year expenses and draft the upcoming budget for stakeholders.',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    category: 'Admin',
    dueDate: '2024-11-20',
    subTasks: ['Review Q3 stats', 'Consult with HR', 'Draft spreadsheet']
  },
  {
    id: '2',
    title: 'Redesign UI components',
    description: 'Update the main dashboard components to match the new style guide.',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    category: 'Design',
    dueDate: '2024-11-25',
  },
  {
    id: '3',
    title: 'Client Onboarding',
    description: 'Finalize contracts and send welcome package to NewCo.',
    status: TaskStatus.DONE,
    priority: TaskPriority.MEDIUM,
    category: 'Sales',
    dueDate: '2024-11-15',
  }
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activeTab, setActiveTab] = useState('board');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.EMPLOYEE);
  const [employeeId, setEmployeeId] = useState('');

  const isTL = userRole === UserRole.TL;

  // Persist session and tasks
  useEffect(() => {
    const savedTasks = localStorage.getItem('syncrotask_data');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    const session = localStorage.getItem('syncrotask_session');
    if (session) {
      const data = JSON.parse(session);
      setIsAuthenticated(true);
      setUserRole(data.role);
      setEmployeeId(data.employeeId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('syncrotask_data', JSON.stringify(tasks));
  }, [tasks]);

  const handleLogin = (role: UserRole, id: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setEmployeeId(id);
    localStorage.setItem('syncrotask_session', JSON.stringify({ role, employeeId: id }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('syncrotask_session');
  };

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    return tasks.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const handleSaveTask = (taskData: Omit<Task, 'id'> | Task) => {
    if (!isTL) return;
    if ('id' in taskData) {
      setTasks(prev => prev.map(t => t.id === taskData.id ? (taskData as Task) : t));
    } else {
      const newTask = { ...taskData, id: Math.random().toString(36).substr(2, 9) } as Task;
      setTasks(prev => [...prev, newTask]);
    }
  };

  const handleDeleteTask = (id: string) => {
    if (!isTL) return;
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard tasks={filteredTasks} />;
      case 'board': return (
        <Board 
          tasks={filteredTasks} 
          role={userRole}
          onAddTask={() => { setEditingTask(null); setIsModalOpen(true); }}
          onEditTask={(t) => { setEditingTask(t); setIsModalOpen(true); }}
          onDeleteTask={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
        />
      );
      case 'analytics': return <Dashboard tasks={filteredTasks} />;
      case 'ai': return <AIChat tasks={tasks} />;
      default: return null;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 animate-in fade-in duration-500">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <Sparkles className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">SyncroTask</h1>
          </div>
          
          <nav className="space-y-1">
            {NAVIGATION.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeTab === item.id 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={activeTab === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}>
                  {item.icon}
                </span>
                <span className="font-semibold text-sm">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5 scale-150">
              {isTL ? <ShieldCheck size={48} /> : <Users size={48} />}
            </div>
            <div className="relative z-10">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${isTL ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {isTL ? 'TL Access' : 'Employee Access'}
              </span>
              <p className="text-sm font-bold text-slate-800 truncate mt-2">{employeeId}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {isTL ? 'ADMIN-LEAD' : 'MEMBER'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search tasks, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 ml-6">
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
              {isTL && (
                <button 
                  onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95 whitespace-nowrap"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Add Task</span>
                </button>
              )}
            </div>
            
            <div className="h-8 w-px bg-slate-200 hidden sm:block" />
            
            <ProfileMenu 
              employeeId={employeeId} 
              role={userRole} 
              onLogout={handleLogout} 
            />
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 capitalize flex items-center gap-3">
                  {activeTab}
                  {!isTL && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md uppercase tracking-widest border border-emerald-100">
                      Standard Contributor
                    </span>
                  )}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Workspace: <span className="font-semibold text-slate-700">{employeeId}</span>. {isTL ? 'Manage team productivity and task allocation.' : 'Track and update your assigned office tasks.'}
                </p>
              </div>
            </div>
            
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center px-4 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        {NAVIGATION.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-2 rounded-xl transition-all ${activeTab === item.id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
          >
            {item.icon}
          </button>
        ))}
        {isTL && (
          <button 
            onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
            className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg"
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTask}
        editTask={editingTask}
      />
    </div>
  );
};

export default App;
