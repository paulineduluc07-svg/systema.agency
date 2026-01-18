import { useState } from "react";
import { StickyNote, Plus, X } from "lucide-react";
import { EditableText } from "@/components/EditableText";
import { usePersistedState } from "@/hooks/usePersistedState";
import { cn } from "@/lib/utils";

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
    <div className="bg-[#FFFDE7] rounded-3xl p-5 border-2 border-yellow-400 shadow-[0_6px_0_0_#FBC02D] relative overflow-hidden group h-full flex flex-col">
      <div className="absolute top-0 right-0 w-12 h-12 bg-yellow-400/20 rounded-bl-3xl" />
      
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="font-display font-bold text-2xl text-yellow-600 flex items-center gap-2">
          <StickyNote className="w-6 h-6" />
          Quick Notes
        </h3>
        <button 
          onClick={addNote}
          className="p-1.5 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 active:scale-95 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-2 font-handwriting text-gray-700 overflow-y-auto pr-1 custom-scrollbar flex-1 min-h-[100px]">
        {notes.length === 0 && (
          <div className="text-center py-4 text-yellow-600/50 italic text-sm">
            Aucune note pour le moment
          </div>
        )}
        
        {notes.map((note) => (
          <div key={note.id} className="flex gap-2 items-start group/note relative pl-2">
            <span className="text-yellow-500 mt-1 shrink-0">•</span>
            <EditableText 
              initialValue={note.content}
              onSave={(val) => updateNote(note.id, val)}
              multiline 
              className="flex-1 bg-transparent border-none p-0 hover:bg-yellow-200/50 rounded px-1 min-w-0 break-words"
            />
            <button 
              onClick={() => deleteNote(note.id)}
              className="opacity-0 group-hover/note:opacity-100 p-1 text-yellow-600/50 hover:text-red-500 transition-opacity absolute right-0 top-0"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
