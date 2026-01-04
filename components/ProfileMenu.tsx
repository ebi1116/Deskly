
import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ShieldCheck, Users, ChevronDown } from 'lucide-react';
import { UserRole } from '../types';

interface ProfileMenuProps {
  employeeId: string;
  role: UserRole;
  onLogout: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ employeeId, role, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isTL = role === UserRole.TL;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pl-3 pr-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-all group"
      >
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-slate-800 leading-none">{employeeId}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{isTL ? 'Team Lead' : 'Employee'}</p>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isTL ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'} shadow-sm`}>
          {isTL ? <ShieldCheck size={16} /> : <Users size={16} />}
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-150 origin-top-right">
          <div className="px-4 py-3 border-b border-slate-50 mb-1">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Signed in as</p>
            <p className="text-sm font-bold text-slate-800 truncate">{employeeId}</p>
            <p className="text-[10px] text-indigo-600 font-bold uppercase mt-1 tracking-wider">
              {isTL ? 'Administrator Access' : 'Standard Access'}
            </p>
          </div>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
