import { useState, useEffect, lazy, Suspense, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useSyncedTasks, useSyncedNotes, useSyncedPreferences } from "@/hooks/useSyncedData";
import { useDataMigration } from "@/hooks/useDataMigration";
import { usePersistedState } from "@/hooks/usePersistedState";
import { useConfig } from "@/contexts/ConfigContext";
import { useIsMobile } from "@/hooks/useMobile";
import { GameTabs } from "@/components/GameTabs";
import { EditableText } from "@/components/EditableText";
import { AdminPanel } from "@/components/AdminPanel";
import { NotesWidget } from "@/components/widgets/NotesWidget";
import { StickyNote } from "@/components/widgets/StickyNote";
import { ExportDialog } from "@/components/ExportDialog";
import { Check, Settings, Plus, X, ListTodo, Moon, Sun, Download, LogIn, LogOut, Cloud, CloudOff, Loader2, StickyNote as StickyNoteIcon, FileText, Sparkles, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";

const Whiteboard = lazy(() => import("@/components/Whiteboard"));

interface Quest {
  id: number;
  title: string;
  completed: boolean;
}

interface Note {
  id: number;
  content: string;
}

interface CustomTab {
  id: number;
  tabId: string;
  label: string;
  color: string;
  icon: string;
  tabType: "widgets" | "whiteboard";
  sortOrder: number;
}

export default function Home() {
  const { config } = useConfig();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const { isMigrating } = useDataMigration();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(config.tabs[0]?.id || "missions");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const { data: customTabs = [] } = trpc.customTabs.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { darkMode, setDarkMode } = useSyncedPreferences();
  const { tasks, addTask, toggleTask, updateTaskTitle, deleteTask } = useSyncedTasks(activeTab);

  const [stickyNotes, setStickyNotes] = usePersistedState<{[key: string]: string}>(`sticky_notes_${activeTab}`, {});
  const [stickyNotesList, setStickyNotesList] = usePersistedState<string[]>(`sticky_ids_${activeTab}`, []);

  const allTabs = [
    ...config.tabs,
    ...customTabs.map((t: CustomTab) => ({
      id: t.tabId, label: t.label, color: t.color, tabType: t.tabType, icon: t.icon,
    }))
  ];

  const currentCustomTab = customTabs.find((t: CustomTab) => t.tabId === activeTab);
  const isWhiteboardTab = currentCustomTab?.tabType === "whiteboard";

  useEffect(() => {
    if (darkMode) { document.documentElement.classList.add('dark'); }
    else { document.documentElement.classList.remove('dark'); }
  }, [darkMode]);

  const handleLogin = () => { window.location.href = getLoginUrl(); };

  const addStickyNote = () => {
    const newId = `sticky-${Date.now()}`;
    setStickyNotesList(prev => [...prev, newId]);
    setShowAddMenu(false);
  };

  const removeStickyNote = (id: string) => {
    setStickyNotesList(prev => prev.filter(sid => sid !== id));
    setStickyNotes(prev => { const updated = { ...prev }; delete updated[id]; return updated; });
  };

  const handleStickyNoteChange = (id: string, content: string) => {
    setStickyNotes(prev => ({ ...prev, [id]: content }));
  };

  const completedTasks = tasks.filter(q => q.completed).length;
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks;

  const handleExport = (selectedTabs: string[], includeTasks: boolean, includeNotes: boolean) => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFontSize(22); doc.setTextColor(255, 105, 180);
    doc.text("Systema.agency - Rapport Journalier", 14, 20);
    doc.setFontSize(12); doc.setTextColor(100);
    doc.text(`Date : ${today}`, 14, 30);
    let yPos = 40;
    const tabsToExport = config.tabs.filter(tab => selectedTabs.includes(tab.id));
    tabsToExport.forEach((tab) => {
      const storedQuests = localStorage.getItem(`rpg_quests_${tab.id}`);
      const tabQuests: Quest[] = storedQuests ? JSON.parse(storedQuests) : [];
      const storedNotes = localStorage.getItem(`rpg_notes_${tab.id}`);
      const tabNotes: Note[] = storedNotes ? JSON.parse(storedNotes) : [];
      const hasTasks = includeTasks && tabQuests.length > 0;
      const hasNotes = includeNotes && tabNotes.length > 0;
      if (!hasTasks && !hasNotes) return;
      doc.setFontSize(16); doc.setTextColor(0);
      doc.text(tab.label, 14, yPos); yPos += 10;
      if (hasTasks) {
        const tasksData = tabQuests.map(q => [q.title, q.completed ? "Termin\u00e9" : "\u00c0 faire"]);
        autoTable(doc, {
          startY: yPos, head: [['T\u00e2che', 'Statut']], body: tasksData,
          theme: 'striped', headStyles: { fillColor: [255, 105, 180] },
          styles: { fontSize: 10 }, margin: { left: 14 }
        });
        // @ts-ignore
        yPos = doc.lastAutoTable.finalY + 10;
      }
      if (hasNotes) {
        doc.setFontSize(12); doc.setTextColor(100);
        doc.text("Notes :", 14, yPos); yPos += 7;
        tabNotes.forEach(note => {
          doc.setFontSize(10); doc.setTextColor(50);
          const splitText = doc.splitTextToSize(`\u2022 ${note.content}`, 180);
          doc.text(splitText, 14, yPos);
          yPos += (splitText.length * 5) + 2;
        });
        yPos += 10;
      }
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save(`Rapport_Systema_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const currentTabLabel = allTabs.find(t => t.id === activeTab)?.label || activeTab;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0] dark:bg-[#121212] transition-colors duration-300">

      {/* Header & Tabs Bar */}
      <header className="sticky top-0 z-30 bg-[#FFF9F0]/95 dark:bg-[#121212]/95 backdrop-blur-sm pt-2 pb-1 px-2 flex items-center gap-2 shadow-sm transition-colors duration-300">
        <div className="shrink-0">
          {isMigrating ? (
            <div className="flex items-center gap-1 text-blue-500 text-xs" title="Migration en cours...">
              <Loader2 className="w-3 h-3 animate-spin" />
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-1 text-green-500 text-xs" title="Synchronisé">
              <Cloud className="w-3 h-3" />
            </div>
          ) : (
            <div className="flex items-center gap-1 text-gray-400 text-xs" title="Mode hors-ligne">
              <CloudOff className="w-3 h-3" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <GameTabs tabs={allTabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button onClick={() => setIsExportOpen(true)} className="p-2 bg-white dark:bg-card rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:scale-105 transition-all" title="Exporter le rapport PDF">
            <Download className="w-4 h-4 text-blue-500" />
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-white dark:bg-card rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:scale-105 transition-all">
            {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          {isAuthenticated ? (
            <button onClick={logout} className="p-2 bg-white dark:bg-card rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:scale-105 transition-all" title="Déconnexion">
              <LogOut className="w-4 h-4 text-red-500" />
            </button>
          ) : (
            <button onClick={handleLogin} className="p-2 bg-pink-500 rounded-full shadow-sm hover:scale-105 transition-all" title="Connexion pour synchroniser">
              <LogIn className="w-4 h-4 text-white" />
            </button>
          )}
          <button onClick={() => setIsAdminOpen(true)} className="p-2 bg-white dark:bg-card rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:scale-105 transition-all">
            <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {isWhiteboardTab ? (
          <Suspense fallback={<div className="w-full h-[calc(100vh-60px)] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-pink-500" /></div>}>
            <div className="w-full h-[calc(100vh-60px)]"><Whiteboard tabId={activeTab} /></div>
          </Suspense>
        ) : (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">

            {/* Avatar + Summary Hero Section */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-pink-50 via-white to-amber-50 dark:from-pink-950/20 dark:via-gray-900 dark:to-amber-950/20 border-2 border-pink-200/50 dark:border-pink-800/30 shadow-lg">
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 sm:p-6">
                <div className="relative shrink-0">
                  <img src="/avatar-transparent.png" alt="Life Command Avatar" className={cn("h-32 sm:h-44 object-contain animate-breathe", darkMode && "brightness-125 contrast-110")} style={{ filter: darkMode ? 'brightness(1.3) saturate(1.1)' : 'none' }} />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">Life Command</div>
                </div>

                <div className="flex-1 w-full">
                  <h2 className="font-display font-bold text-lg sm:text-xl text-gray-800 dark:text-gray-100 mb-3 text-center sm:text-left">{currentTabLabel}</h2>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="bg-white/80 dark:bg-gray-800/60 rounded-xl p-3 text-center border border-pink-100 dark:border-pink-900/30 shadow-sm">
                      <Target className="w-5 h-5 text-pink-500 mx-auto mb-1" />
                      <div className="font-display font-bold text-xl sm:text-2xl text-gray-800 dark:text-gray-100">{totalTasks}</div>
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">T\u00e2ches</div>
                      </div>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-800/60 rounded-xl p-3 text-center border border-green-100 dark:border-green-900/30 shadow-sm">
                      <Sparkles className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <div className="font-display font-bold text-xl sm:text-2xl text-green-600 dark:text-green-400">{completedTasks}</div>
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">Terminées</div>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-800/60 rounded-xl p-3 text-center border border-amber-100 dark:border-amber-900/30 shadow-sm">
                      <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                      <div className="font-display font-bold text-xl sm:text-2xl text-amber-600 dark:text-amber-400">{pendingTasks}</div>
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">En cours</div>
                    </div>
                  </div>
                  {totalTasks > 0 && (
                    <div className="mt-3">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-pink-500 to-green-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${(completedTasks / totalTasks) * 100}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 text-right">{Math.round((completedTasks / totalTasks) * 100)}% complété</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.section>

            <div className={cn("grid gap-4 sm:gap-6", isMobile ? "grid-cols-1" : "grid-cols-2")}>

              {/* Tasks Widget */}
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="panel-game p-4 sm:p-5 flex flex-col min-h-[280px]">
                <div className="flex justify-between items-center mb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-pink-500 rounded-lg"><ListTodo className="w-4 h-4 text-white" /></div>
                    <h3 className="font-display font-bold text-base text-gray-800 dark:text-gray-100">T\u00e2ches</h3>
                    <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 px-2 py-0.5 rounded-full text-[10px] font-bold">{completedTasks}/{totalTasks}</span>
                  </div>
                  <button onClick={() => addTask("Nouvelle t\u00e2che")} className={cn("rounded-xl px-3 py-1.5 font-bold text-xs text-white", "bg-gradient-to-b from-pink-500 to-pink-600", "shadow-[0_3px_0_0] shadow-pink-700/50", "hover:translate-y-[1px] hover:shadow-[0_2px_0_0]", "active:translate-y-[3px] active:shadow-none", "transition-all duration-100 flex items-center gap-1")}>
                    <Plus className="w-3 h-3" /> Ajouter
                  </button>
                </div>

                <div className="space-y-2 overflow-y-auto custom-scrollbar pr-1 flex-1 min-h-0">
                  {tasks.length === 0 ? (
                    <EmptyState icon={<ListTodo className="w-8 h-8 text-pink-300 dark:text-pink-700" />} title="Aucune t\u00e2che pour l'instant" subtitle="Clique sur \u00ab Ajouter \u00bb pour cr\u00e9er ta premi\u00e8re t\u00e2che" accentColor="pink" />
                  ) : (
                    tasks.map((quest) => (
                      <motion.div key={quest.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-start gap-2 p-2.5 rounded-xl border bg-pink-50/50 dark:bg-pink-900/10 border-pink-100 dark:border-pink-800/30 group relative shrink-0 transition-colors hover:border-pink-300 dark:hover:border-pink-700">
                        <button onClick={() => toggleTask(quest.id)} className={cn("mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all", quest.completed ? "bg-green-400 border-green-500 text-white dark:bg-green-600 dark:border-green-700 scale-110" : "bg-white dark:bg-gray-800 border-pink-300 dark:border-pink-700 hover:border-pink-500")}>
                          {quest.completed && <Check className="w-3 h-3" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <EditableText initialValue={quest.title} onSave={(val) => updateTaskTitle(quest.id, val)} className={cn("text-sm font-medium leading-tight bg-transparent w-full break-words dark:text-gray-200",
                              quest.completed && "line-through text-gray-400 dark:text-gray-600"
                            )}
                          />
                        </div>
                        <button onClick={() => deleteTask(quest.id)} className="absolute -right-1.5 -top-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 shadow-sm">
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.section>

              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="min-h-[280px]">
                <NotesWidget contextId={activeTab} />
              </motion.section>
            </div>

            {stickyNotesList.length > 0 && (
              <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
                <h3 className="font-display font-bold text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                  <StickyNoteIcon className="w-4 h-4" /> Notes Volantes
                </h3>
                <div className={cn("grid gap-3", isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3")}>
                  {stickyNotesList.map((noteId) => (
                    <div key={noteId} className="relative group">
                      <StickyNote id={noteId} content={stickyNotes[noteId] || ''} onChange={handleStickyNoteChange} />
                      <button onClick={() => removeStickyNote(noteId)} className="absolute -right-1.5 -top-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            <div className="fixed bottom-6 right-6 z-40">
              <div className="relative">
                <AnimatePresence>
                  {showAddMenu && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }} className="absolute bottom-14 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 min-w-[180px]">
                      <button onClick={() => { addTask("Nouvelle t\u00e2che"); setShowAddMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left">
                        <ListTodo className="w-4 h-4 text-pink-500" />
                        <span className="text-sm font-medium dark:text-gray-200">Nouvelle t\u00e2che</span>
                      </button>
                      <button onClick={addStickyNote} className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left">
                        <StickyNoteIcon className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium dark:text-gray-200">Note volante</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button onClick={() => setShowAddMenu(!showAddMenu)} className={cn("w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all", "bg-gradient-to-b from-pink-500 to-pink-600 text-white", "shadow-[0_4px_0_0] shadow-pink-700/50", "hover:translate-y-[1px] hover:shadow-[0_3px_0_0]", "active:translate-y-[3px] active:shadow-none", showAddMenu && "rotate-45")}>
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="h-16" />
          </div>
        )}
      </main>

      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      <ExportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} onExport={handleExport} />
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accentColor: 'pink' | 'yellow' | 'blue';
}

function EmptyState({ icon, title, subtitle, accentColor }: EmptyStateProps) {
  const bgMap = {
    pink: 'bg-pink-50 dark:bg-pink-950/20',
    yellow: 'bg-yellow-50 dark:bg-yellow-950/20',
    blue: 'bg-blue-50 dark:bg-blue-950/20',
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={cn("flex flex-col items-center justify-center py-8 px-4 rounded-xl", bgMap[accentColor])}>
      <div className="mb-3 opacity-60">{icon}</div>
      <p className="font-display font-bold text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center max-w-[200px]">{subtitle}</p>
    </motion.div>
  );
}
