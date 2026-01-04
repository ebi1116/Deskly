
import React from 'react';
import { Task, TaskStatus, UserRole } from '../types';
import { STATUS_COLUMNS } from '../constants';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

interface BoardProps {
  tasks: Task[];
  role: UserRole;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const Board: React.FC<BoardProps> = ({ tasks, role, onAddTask, onEditTask, onDeleteTask, onToggleStatus }) => {
  const isTL = role === UserRole.TL;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[600px]">
      {STATUS_COLUMNS.map(col => {
        const columnTasks = tasks.filter(t => t.status === col.id);
        
        return (
          <div key={col.id} className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{col.title}</h2>
                <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
              {col.id === 'TODO' && isTL && (
                <button 
                  onClick={onAddTask}
                  className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-indigo-600 transition-all"
                >
                  <Plus size={18} />
                </button>
              )}
            </div>
            
            <div className={`flex-1 rounded-2xl p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar border-2 border-dashed border-slate-200 ${col.color.replace('100', '50/30')}`}>
              {columnTasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-60">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm mb-3 flex items-center justify-center">
                    {isTL ? <Plus size={24} /> : <div className="w-2 h-2 rounded-full bg-slate-200" />}
                  </div>
                  <p className="text-xs font-medium">{isTL ? 'No tasks yet' : 'No tasks assigned'}</p>
                </div>
              ) : (
                columnTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    role={role}
                    onEdit={onEditTask} 
                    onDelete={onDeleteTask}
                    onToggleStatus={onToggleStatus}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Board;
