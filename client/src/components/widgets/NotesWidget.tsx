import { StickyNote, Plus, X } from "lucide-react";
import { EditableText } from "@/components/EditableText";
import { usePersistedState } from "@/hooks/usePersistedState";

interface Note {
  id: string;
  content: string;
}

interface NotesWidgetProps {
  contextId?: string; // Pour séparer les notes par onglet (ex: "missions", "maison")
}

export function NotesWidget({ contextId = "default" }: NotesWidgetProps) {
  // Clé de stockage unique par contexte
  const storageKey = `rpg_notes_${contextId}`;

  const [notes, setNotes] = usePersistedState<Note[]>(storageKey, []);

  const addNote = () => {
    const newNote = {
      id: Date.now().toString(),
      content: "Nouvelle note..."
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id: string, newContent: string) => {
    setNotes(notes.map(note => note.id === id ? { ...note, content: newContent } : note));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="bg-[#FFFDE7] dark:bg-pink-950/20 rounded-2xl p-3 border border-yellow-400 dark:border-pink-800/30 shadow-sm relative overflow-hidden group flex flex-col">
      <div className="flex justify-between items-center mb-2 shrink-0">
        <h3 className="font-display font-bold text-sm text-yellow-600 dark:text-pink-400/80 flex items-center gap-1.5">
          <StickyNote className="w-3.5 h-3.5" />
          Notes
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            addNote();
          }}
          className="p-1 bg-yellow-400 dark:bg-pink-600 text-white rounded-full hover:bg-yellow-500 dark:hover:bg-pink-500 active:scale-95 transition-all shadow-sm"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-1.5 font-handwriting text-gray-700 dark:text-gray-300 overflow-y-auto pr-1 custom-scrollbar flex-1 min-h-[40px] max-h-[100px]">
        {notes.length === 0 && (
          <div className="text-center py-2 text-yellow-600/50 dark:text-pink-400/30 italic text-[10px]">
            Aucune note
          </div>
        )}

        {notes.map((note) => (
          <div key={note.id} className="flex gap-1.5 items-start group/note relative pl-1">
            <span className="text-yellow-500 dark:text-pink-500/50 mt-0.5 shrink-0 text-xs">•</span>
            <EditableText
              initialValue={note.content}
              onSave={(val) => updateNote(note.id, val)}
              multiline
              className="flex-1 bg-transparent border-none p-0 hover:bg-yellow-200/50 dark:hover:bg-pink-900/30 rounded px-1 min-w-0 break-words text-xs"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
              className="opacity-0 group-hover/note:opacity-100 p-0.5 text-yellow-600/50 dark:text-pink-400/40 hover:text-red-500 transition-opacity absolute right-0 top-0"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
