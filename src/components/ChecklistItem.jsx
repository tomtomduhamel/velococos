import React, { useState } from 'react';
import { Check, Trash2, StickyNote, Pencil, X, CheckCheck } from 'lucide-react';

const QUICK_NOTE_SUGGESTIONS = [
  'À acheter',
  'Dans la roulotte',
  'À sortir avant le départ',
  'Dans le chariot'
];

export default function ChecklistItem({
  item,
  onToggle,
  onDelete,
  onUpdateNote,
  onUpdateTitle,
  showCategory = false
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleText, setEditTitleText] = useState(item.title || '');

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(item.note || '');

  const isChecked = item.checked;

  const handleSaveTitle = () => {
    if (!editTitleText.trim()) return;
    if (onUpdateTitle) {
      onUpdateTitle(item.id, editTitleText.trim());
    }
    setIsEditingTitle(false);
  };

  const handleCancelTitle = () => {
    setEditTitleText(item.title || '');
    setIsEditingTitle(false);
  };

  const handleSaveNote = (textToSave) => {
    const finalNote = typeof textToSave === 'string' ? textToSave : noteText;
    if (onUpdateNote) {
      onUpdateNote(item.id, finalNote);
    }
    setIsEditingNote(false);
  };

  const handleClearNote = () => {
    setNoteText('');
    if (onUpdateNote) {
      onUpdateNote(item.id, '');
    }
    setIsEditingNote(false);
  };

  return (
    <div
      onClick={() => {
        if (!isEditingNote && !isEditingTitle) onToggle();
      }}
      className={`group flex flex-col p-3.5 my-1.5 rounded-xl border transition-all duration-150 cursor-pointer active:scale-[0.99] select-none touch-target ${
        isChecked
          ? 'bg-slate-900/60 border-emerald-500/30 text-slate-400'
          : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-100 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between w-full">
        {/* Checkbox et Titre */}
        <div className="flex items-center space-x-3 flex-1 min-w-0 pr-2">
          {/* Checkbox circle with high contrast */}
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
              isChecked
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'border-2 border-slate-500 group-hover:border-emerald-400 bg-slate-900/50'
            }`}
          >
            {isChecked && <Check className="w-5 h-5 stroke-[3]" />}
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            {/* Si édition du titre active */}
            {isEditingTitle ? (
              <div onClick={(e) => e.stopPropagation()} className="flex items-center space-x-1.5 w-full my-0.5">
                <input
                  type="text"
                  value={editTitleText}
                  onChange={(e) => setEditTitleText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') handleCancelTitle();
                  }}
                  className="flex-1 bg-slate-950 border border-emerald-500 rounded-lg px-2.5 py-1 text-sm text-white focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="p-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 rounded-lg text-xs font-bold"
                  title="Enregistrer"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCancelTitle}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-400 rounded-lg text-xs"
                  title="Annuler"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <span
                className={`text-sm sm:text-base font-medium leading-snug break-words ${
                  isChecked ? 'line-through text-slate-500' : 'text-slate-100'
                }`}
              >
                {item.title}
              </span>
            )}

            {/* Catégorie optionnelle */}
            {showCategory && item.category && (
              <span className="text-[11px] text-emerald-400/90 font-semibold tracking-wide uppercase mt-0.5">
                {item.category}
              </span>
            )}

            {/* Badge Note existante */}
            {item.note && !isEditingNote && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setNoteText(item.note);
                  setIsEditingNote(true);
                }}
                className="mt-1.5 inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium self-start active:scale-95 transition-all hover:bg-amber-500/25"
                title="Cliquer pour modifier la note"
              >
                <StickyNote className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span className="break-words font-sans">{item.note}</span>
                <Pencil className="w-2.5 h-2.5 opacity-60 ml-0.5 flex-shrink-0" />
              </div>
            )}
          </div>
        </div>

        {/* Boutons d'action (Éditer Titre, Note & Poubelle) */}
        <div className="flex items-center space-x-0.5 flex-shrink-0">
          {/* Bouton Modifier Titre */}
          {onUpdateTitle && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEditTitleText(item.title);
                setIsEditingTitle(!isEditingTitle);
              }}
              className={`p-2 rounded-xl transition-all flex-shrink-0 touch-target flex items-center justify-center active:scale-95 ${
                isEditingTitle
                  ? 'text-emerald-400 bg-emerald-500/15'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
              title="Modifier le nom de l'élément"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Bouton Note */}
          {onUpdateNote && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setNoteText(item.note || '');
                setIsEditingNote(!isEditingNote);
              }}
              className={`p-2 rounded-xl transition-all flex-shrink-0 touch-target flex items-center justify-center active:scale-95 ${
                item.note
                  ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/15'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
              title={item.note ? 'Modifier la note' : 'Ajouter une note'}
            >
              <StickyNote className="w-4 h-4" />
            </button>
          )}

          {/* Bouton Supprimer */}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="p-2 text-slate-500 hover:text-rose-400 active:text-rose-500 hover:bg-rose-500/10 active:scale-95 rounded-xl transition-all flex-shrink-0 touch-target flex items-center justify-center"
              title="Supprimer de la liste"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Éditeur de note en ligne */}
      {isEditingNote && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-3 pt-3 border-t border-slate-700/80 space-y-2 w-full animate-fadeIn"
        >
          <div className="flex items-center space-x-1.5">
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveNote();
                if (e.key === 'Escape') setIsEditingNote(false);
              }}
              placeholder="Ex: à acheter, dans la roulotte, prêt..."
              className="flex-1 bg-slate-950 border border-amber-500/50 focus:border-amber-400 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={() => handleSaveNote()}
              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 rounded-lg text-xs font-bold flex items-center space-x-1"
              title="Enregistrer la note"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>OK</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditingNote(false)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg active:scale-95"
              title="Annuler"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Suggestions rapides en 1 clic */}
          <div className="flex flex-wrap gap-1 pt-0.5">
            {QUICK_NOTE_SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => {
                  setNoteText(sug);
                  handleSaveNote(sug);
                }}
                className="text-[10px] bg-slate-950/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700/60 rounded-md px-2 py-0.5 transition-colors active:scale-95"
              >
                + {sug}
              </button>
            ))}
            {item.note && (
              <button
                type="button"
                onClick={handleClearNote}
                className="text-[10px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-md px-2 py-0.5 transition-colors active:scale-95 ml-auto"
              >
                Effacer la note
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
