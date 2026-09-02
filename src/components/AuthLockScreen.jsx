import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, Compass, ArrowRight } from 'lucide-react';

const EXPECTED_PASSWORD = 'familleNobregaDuhamel';

export default function AuthLockScreen({ onAuthenticated }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === EXPECTED_PASSWORD) {
      setError('');
      try {
        localStorage.setItem('velococos_auth_token', 'authenticated_familleNobregaDuhamel');
      } catch (err) {
        console.error('LocalStorage error:', err);
      }
      onAuthenticated();
    } else {
      setError('Mot de passe incorrect');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 antialiased selection:bg-emerald-500 selection:text-slate-950">
      <div
        className={`w-full max-w-sm bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 text-center backdrop-blur-sm transition-transform ${
          shake ? 'animate-bounce' : ''
        }`}
      >
        {/* Logo & Emblème */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Compass className="w-8 h-8 text-emerald-400 animate-pulse" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Vélococos</h1>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mt-0.5">
              Expédition Familiale 2026
            </p>
          </div>
        </div>

        {/* Badge Accès Privé */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 flex items-center justify-center space-x-2 text-xs text-slate-300">
          <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Accès privé et sécurisé</span>
        </div>

        {/* Formulaire Mot de Passe */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Entrez le mot de passe..."
                className={`w-full bg-slate-950 border ${
                  error ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                } rounded-xl px-3.5 py-3 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors font-sans`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                title={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-rose-400 text-xs font-semibold mt-1.5 ml-1 flex items-center gap-1">
                <span>⚠️</span> {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 touch-target cursor-pointer"
          >
            <span>Déverrouiller l'accès</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>

        {/* Note locale 100% hors-ligne */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center space-x-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/80" />
          <span>Protection 100% Locale & Hors-Ligne</span>
        </div>
      </div>
    </div>
  );
}
