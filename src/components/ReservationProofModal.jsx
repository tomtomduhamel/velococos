import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Flame,
  Droplets,
  Waves,
  ShieldCheck,
  CreditCard,
  Eye,
  Tent
} from 'lucide-react';

export default function ReservationProofModal({ isOpen, onClose, stages, initialStageDay = 1 }) {
  const [selectedDay, setSelectedDay] = useState(initialStageDay <= 2 ? initialStageDay : 1);
  const [activePdfUrl, setActivePdfUrl] = useState(null);

  if (!isOpen) return null;

  const currentStage = stages.find((s) => s.day === selectedDay) || stages[0];
  const booking = currentStage.booking;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Preuves de Réservation</h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Documents &amp; données accessibles 100% Hors-ligne</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Onglets Campings (J1 vs J2) */}
        <div className="grid grid-cols-2 p-2 bg-slate-950/60 border-b border-slate-800 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setSelectedDay(1);
              setActivePdfUrl(null);
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-between transition-all border ${
              selectedDay === 1
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <Tent className="w-3.5 h-3.5" />
              <span>J1 : Lac Simon (CVLS)</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
              selectedDay === 1 ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-950 text-emerald-400'
            }`}>
              Payé ✓
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedDay(2);
              setActivePdfUrl(null);
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-between transition-all border ${
              selectedDay === 2
                ? 'bg-sky-600 text-white border-sky-500 shadow-md'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <Tent className="w-3.5 h-3.5" />
              <span>J2 : Plage St-Raymond</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
              selectedDay === 2 ? 'bg-amber-800 text-amber-100' : 'bg-amber-950 text-amber-300'
            }`}>
              Reste 31,04 $
            </span>
          </button>
        </div>

        {/* Corps défilable de la modal */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Lecteur PDF intégré si ouvert */}
          {activePdfUrl ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-slate-800 px-3 py-2 rounded-xl">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Aperçu PDF Hors-ligne</span>
                </span>
                <div className="flex items-center space-x-2">
                  <a
                    href={activePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <span>Plein écran</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setActivePdfUrl(null)}
                    className="text-[11px] bg-slate-700 hover:bg-slate-600 text-white px-2 py-0.5 rounded font-semibold"
                  >
                    Fermer aperçu
                  </button>
                </div>
              </div>
              <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                <iframe
                  src={activePdfUrl}
                  title="Preuve de réservation PDF"
                  className="w-full h-full"
                />
              </div>
            </div>
          ) : null}

          {/* Bandeau Statut Financier & Référence */}
          <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
            booking.isFullyPaid
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/50 border-amber-500/40 text-amber-200'
          }`}>
            <div className="space-y-0.5">
              <div className="flex items-center space-x-1.5">
                {booking.isFullyPaid ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <CreditCard className="w-4 h-4 text-amber-400 flex-shrink-0" />
                )}
                <span className="font-black text-sm text-white">
                  {booking.isFullyPaid ? 'Facture 100% Acquittée' : 'Acompte Payé • Solde à Régler'}
                </span>
              </div>
              <div className="text-[11px] opacity-90">
                {booking.provider} • Réf : <strong className="font-mono text-white underline">{booking.reference}</strong>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-700/80 sm:pl-3">
              <div className="text-[11px] text-slate-400">Total : {booking.totalPrice}</div>
              <div className="font-mono font-black text-sm">
                {booking.isFullyPaid ? (
                  <span className="text-emerald-400">Restant : 0,00 $</span>
                ) : (
                  <span className="text-amber-300">À payer sur place : {booking.remainingBalance}</span>
                )}
              </div>
            </div>
          </div>

          {/* Alerte Eau Non Potable spécifique au Lac Simon */}
          {booking.waterAlert && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl space-y-1 text-red-200 animate-pulse">
              <div className="flex items-center space-x-1.5 font-bold text-xs text-red-300">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>CONSIGNE CRITIQUE : EAU DU RÉSEAU NON POTABLE</span>
              </div>
              <p className="text-[11px] text-red-200/90 leading-relaxed">
                {booking.waterAlert}
              </p>
            </div>
          )}

          {/* Fiche d'identification et Emplacement */}
          <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
              <span className="text-slate-400">Emplacement réservé :</span>
              <span className="bg-slate-900 px-2.5 py-1 rounded-lg font-mono font-black text-white border border-slate-700 text-xs">
                ⛺ {booking.pitch}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block">Titulaire de la réservation :</span>
                <span className="font-bold text-white">{booking.clientName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Dates de séjour :</span>
                <span className="font-bold text-white">{booking.dates}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Heure d'arrivée permise :</span>
                <span className="font-bold text-emerald-300">{booking.checkIn}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Heure limite de départ :</span>
                <span className="font-bold text-amber-300">{booking.checkOut}</span>
              </div>
            </div>

            {booking.occupants && (
              <div className="pt-1 border-t border-slate-700/60 text-[11px] text-slate-300">
                <span className="text-slate-400">Groupe : </span>
                <strong className="text-white">{booking.occupants}</strong>
              </div>
            )}
          </div>

          {/* Coordonnées & Accueil */}
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 space-y-2 text-xs">
            <div className="font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Accueil &amp; Coordonnées directes</span>
            </div>
            <p className="text-slate-300">{currentStage.address}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={`tel:${booking.phone.replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center space-x-1 font-bold text-sky-400 hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{booking.phone}</span>
              </a>
              {booking.email && (
                <a
                  href={`mailto:${booking.email}`}
                  className="inline-flex items-center space-x-1 font-bold text-sky-400 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{booking.email}</span>
                </a>
              )}
            </div>
            {booking.receptionInfo && (
              <p className="text-[11px] text-slate-400 pt-1 leading-relaxed border-t border-slate-700/60">
                ℹ️ {booking.receptionInfo}
              </p>
            )}
          </div>

          {/* Services inclus & Activités */}
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-emerald-400" />
              <span>Services &amp; Commodités sur place</span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-300">
              {booking.services.map((srv, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-emerald-400 font-bold leading-none mt-0.5">✓</span>
                  <span>{srv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Téléchargement / Consultation des PDFs Officiels */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-white text-xs flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Preuves PDF Originales (Pré-cachées Offline)</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                100% Hors-Ligne
              </span>
            </div>

            <div className="space-y-2">
              {booking.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white text-xs truncate">{doc.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{doc.description} ({doc.size})</div>
                  </div>

                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setActivePdfUrl(doc.url)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 transition"
                      title="Visualiser le PDF dans l'application"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Voir</span>
                    </button>

                    <a
                      href={doc.url}
                      download
                      className="px-2 py-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 transition shadow"
                      title="Télécharger le fichier PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Ouvrir</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400 font-mono">
            Expédition Vélococos 2026
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
