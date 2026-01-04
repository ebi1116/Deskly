
import React from 'react';
import { Task, TaskPriority, UserRole } from '../types';
import { Calendar, Tag, MoreVertical, CheckCircle2, Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  role: UserRole;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, role, onEdit, onDelete, onToggleStatus }) => {
  const isTL = role === UserRole.TL;
  const priorityColors = {
    [TaskPriority.LOW]: 'bg-blue-50 text-blue-600',
    [TaskPriority.MEDIUM]: 'bg-amber-50 text-amber-600',
    [TaskPriority.HIGH]: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 group relative">
      <div className="flex justify-between items-start mb-2">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        {isTL && (
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(task)} className="p-1 hover:bg-slate-100 rounded text-slate-400">
              <MoreVertical size={14} />
            </button>
          </div>
        )}
      </div>
      
      <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">{task.title}</h3>
      <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
      
      <div className="flex flex-wrap gap-3 items-center text-[11px] text-slate-400 font-medium">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Tag size={12} />
          <span>{task.category}</span>
        </div>
        {task.subTasks && task.subTasks.length > 0 && (
          <div className="flex items-center gap-1 text-indigo-500">
            <CheckCircle2 size={12} />
            <span>{task.subTasks.length} steps</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
        <button 
          onClick={() => onToggleStatus(task.id)}
          className={`text-[10px] font-bold uppercase transition-colors ${task.status === 'DONE' ? 'text-emerald-500' : 'text-slate-400 hover:text-indigo-600'}`}
        >
          {task.status === 'DONE' ? 'Done' : 'Mark as Complete'}
        </button>
        {isTL && (
          <button onClick={() => onDelete(task.id)} className="text-[10px] text-rose-400 font-bold uppercase hover:text-rose-600">
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
