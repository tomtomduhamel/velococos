import React from 'react';
import { X, ShieldAlert, Phone, AlertTriangle, Compass, HeartPulse, BellRing, Eye } from 'lucide-react';

export default function SecurityModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header modal */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Sécurité & Urgences</h3>
              <p className="text-[11px] text-slate-400">100% accessible hors-ligne</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body scrollable */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Numéros d'urgence cliquables */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              Numéros d'Urgence Immédiate
            </span>

            <div className="grid grid-cols-1 gap-2">
              <a
                href="tel:911"
                className="flex items-center justify-between p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 hover:bg-rose-900/50 transition-all text-white font-bold"
              >
                <div>
                  <div className="text-sm font-black text-rose-200">911 • Urgence Vitale</div>
                  <div className="text-[11px] text-slate-400 font-normal">Police, Ambulance, Pompiers</div>
                </div>
                <span className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-black">Appeler</span>
              </a>

              <a
                href="tel:18004632191"
                className="flex items-center justify-between p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 hover:bg-amber-900/50 transition-all text-white font-bold"
              >
                <div>
                  <div className="text-sm font-black text-amber-200">1 (800) 463-2191</div>
                  <div className="text-[11px] text-slate-400 font-normal">S.O.S. Braconnage & Faune (Ours)</div>
                </div>
                <span className="px-3 py-1 bg-amber-600 text-slate-950 rounded-lg text-xs font-black">Appeler</span>
              </a>

              <a
                href="tel:4183377525"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-700/80 transition-all text-white font-bold"
              >
                <div>
                  <div className="text-sm font-black text-slate-200">(418) 337-7525</div>
                  <div className="text-[11px] text-slate-400 font-normal">Bureau Vélopiste Jacques-Cartier</div>
                </div>
                <span className="px-3 py-1 bg-slate-700 text-slate-200 rounded-lg text-xs font-black">Appeler</span>
              </a>
            </div>
          </div>

          {/* Consignes Faune : Rencontre avec un Ours Noir */}
          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700 space-y-2.5">
            <div className="flex items-center space-x-2 text-amber-400 font-black text-sm">
              <Eye className="w-4 h-4" />
              <span>Face à un Ours Noir (Consignes Piste)</span>
            </div>
            <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
              <p>• <strong>Garder les enfants près du chariot</strong> : Gusto et Jojo doivent rester immédiatement groupés avec vous.</p>
              <p>• <strong>Ne JAMAIS courir</strong> : Courir déclenche l'instinct de poursuite de l'ours.</p>
              <p>• <strong>Parler d'une voix calme et forte</strong> pour vous faire identifier comme humain. Reculer lentement face à lui.</p>
              <p>• <strong>Bivouac au campement</strong> : Aucune nourriture, collation ou dentifrice dans la tente la nuit. Tout enfermer hermétiquement.</p>
            </div>
          </div>

          {/* Protocole Zone Blanche */}
          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-sky-400 font-black text-sm">
              <Compass className="w-4 h-4" />
              <span>En cas de pépin en Zone Blanche (Km 68 à 48)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Dans le secteur nord (Rivière-à-Pierre ➔ Lac Simon), restez sur la voie de roulement. La piste est patrouillée et fréquentée. Pour un secours matériel, les haltes du Km 68 et du Km 48.5 disposent de points de contact.
            </p>
          </div>

          {/* Règles de circulation */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="font-bold text-slate-200 block">Règles d'or Vélopiste :</span>
            <p>1. Circuler à droite, annoncer le dépassement à gauche (sonnette/voix).</p>
            <p>2. Descendre obligatoirement de vélo/dégager la voie aux intersections routières.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
