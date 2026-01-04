
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Sparkles, Lock, Contact, AlertCircle, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole, employeeId: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(() => {
      // Credentials:
      // TL: TL1001 / tl@pass
      // EMP: EMP2001 / emp@pass
      if (employeeId === 'TL1001' && password === 'tl@pass') {
        onLogin(UserRole.TL, 'TL1001');
      } else if (employeeId === 'EMP2001' && password === 'emp@pass') {
        onLogin(UserRole.EMPLOYEE, 'EMP2001');
      } else {
        setError('Invalid Employee ID or password.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 mb-4">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800">SyncroTask AI</h1>
          <p className="text-slate-500 mt-2">Workspace Secure Access</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Employee ID</label>
              <div className="relative">
                <Contact className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  placeholder="e.g. TL1001 or EMP2001"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-medium border border-rose-100 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-3">Login Credentials</p>
            <div className="flex flex-col gap-2 text-[11px] items-center">
              <div className="text-slate-500"><span className="font-bold text-indigo-500">TL:</span> TL1001 / tl@pass</div>
              <div className="text-slate-500"><span className="font-bold text-emerald-500">Employee:</span> EMP2001 / emp@pass</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
