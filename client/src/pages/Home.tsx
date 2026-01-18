import { useState, useEffect, lazy, Suspense, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useSyncedTasks, useSyncedNotes, useSyncedPreferences } from "@/hooks/useSyncedData";
import { useDataMigration } from "@/hooks/useDataMigration";
import { usePersistedState } from "@/hooks/usePersistedState";
import { useConfig } from "@/contexts/ConfigContext";
import { GameTabs } from "@/components/GameTabs";
import { EditableText } from "@/components/EditableText";
import { AdminPanel } from "@/components/AdminPanel";
import { NotesWidget } from "@/components/widgets/NotesWidget";
import { StickyNote } from "@/components/widgets/StickyNote";
import { DraggableWidget } from "@/components/DraggableWidget";
import { ExportDialog } from "@/components/ExportDialog";
import { Check, Settings, Plus, X, ListTodo, Moon, Sun, Download, LogIn, LogOut, Cloud, CloudOff, Loader2, StickyNote as StickyNoteIcon, FileText, Move } from "lucide-react";
import { cn } from "@/lib/utils";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Rnd } from 'react-rnd';

// Lazy load the Whiteboard component
const Whiteboard = lazy(() => import("@/components/Whiteboard"));

// Types pour nos données
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

interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WidgetConfig {
  id: string;
  type: 'tasks' | 'notes' | 'sticky';
  position: WidgetPosition;
  data?: any;
}

export default function Home() {
  const { config } = useConfig();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const { isMigrating } = useDataMigration();
  const [activeTab, setActiveTab] = useState(config.tabs[0]?.id || "missions");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [focusedWidget, setFocusedWidget] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  
  // Avatar position state
  const [avatarPosition, setAvatarPosition] = usePersistedState<{x: number, y: number}>('avatar_position', { x: -1, y: -1 });
  const [isAvatarDragging, setIsAvatarDragging] = useState(false);
  
  // Fetch custom tabs from server
  const { data: customTabs = [] } = trpc.customTabs.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  
  // Synced preferences
  const { darkMode, setDarkMode } = useSyncedPreferences();
  
  // Synced tasks and notes
  const { tasks, addTask, toggleTask, updateTaskTitle, deleteTask } = useSyncedTasks(activeTab);
  
  // Widget positions per tab
  const [widgets, setWidgets] = usePersistedState<WidgetConfig[]>(`widgets_${activeTab}`, [
    { id: 'tasks', type: 'tasks', position: { x: 20, y: 80, width: 320, height: 250 } },
    { id: 'notes', type: 'notes', position: { x: 360, y: 80, width: 320, height: 250 } },
  ]);

  // Sticky notes data
  const [stickyNotes, setStickyNotes] = usePersistedState<{[key: string]: string}>(`sticky_notes_${activeTab}`, {});

  // Combine default tabs with custom tabs
  const allTabs = [
    ...config.tabs,
    ...customTabs.map((t: CustomTab) => ({
      id: t.tabId,
      label: t.label,
      color: t.color,
      tabType: t.tabType,
      icon: t.icon,
    }))
  ];

  // Check if current tab is a whiteboard
  const currentCustomTab = customTabs.find((t: CustomTab) => t.tabId === activeTab);
  const isWhiteboardTab = currentCustomTab?.tabType === "whiteboard";

  // Appliquer la classe dark au body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  const handleWidgetPositionChange = useCallback((id: string, position: {x: number, y: number}, size: {width: number, height: number}) => {
    setWidgets(prev => prev.map(w => 
      w.id === id ? { ...w, position: { ...position, ...size } } : w
    ));
  }, [setWidgets]);

  const handleRemoveWidget = useCallback((id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
    if (id.startsWith('sticky-')) {
      setStickyNotes(prev => {
        const newNotes = { ...prev };
        delete newNotes[id];
        return newNotes;
      });
    }
  }, [setWidgets, setStickyNotes]);

  const addWidget = (type: 'tasks' | 'notes' | 'sticky') => {
    const newId = type === 'sticky' ? `sticky-${Date.now()}` : `${type}-${Date.now()}`;
    const newWidget: WidgetConfig = {
      id: newId,
      type,
      position: { x: 100 + Math.random() * 100, y: 100 + Math.random() * 100, width: 280, height: 200 },
    };
    setWidgets(prev => [...prev, newWidget]);
    setShowAddMenu(false);
  };

  const handleStickyNoteChange = (id: string, content: string) => {
    setStickyNotes(prev => ({ ...prev, [id]: content }));
  };

  // PDF Export
  const handleExport = (selectedTabs: string[], includeTasks: boolean, includeNotes: boolean) => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    doc.setFontSize(22);
    doc.setTextColor(255, 105, 180);
    doc.text("Systema.agency - Rapport Journalier", 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
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

      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text(tab.label, 14, yPos);
      yPos += 10;

      if (hasTasks) {
        const tasksData = tabQuests.map(q => [
          q.title,
          q.completed ? "Terminé" : "À faire"
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [['Tâche', 'Statut']],
          body: tasksData,
          theme: 'striped',
          headStyles: { fillColor: [255, 105, 180] },
          styles: { fontSize: 10 },
          margin: { left: 14 }
        });
        
        // @ts-ignore
        yPos = doc.lastAutoTable.finalY + 10;
      }

      if (hasNotes) {
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text("Notes :", 14, yPos);
        yPos += 7;
        
        tabNotes.forEach(note => {
          doc.setFontSize(10);
          doc.setTextColor(50);
          const splitText = doc.splitTextToSize(`• ${note.content}`, 180);
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

  // Render widget content based on type
  const renderWidgetContent = (widget: WidgetConfig) => {
    switch (widget.type) {
      case 'tasks':
        return (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                {tasks.filter(q => q.completed).length}/{tasks.length}
              </span>
              <button 
                onClick={() => addTask("Nouvelle tâche")}
                className="p-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 rounded-full hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2 overflow-y-auto custom-scrollbar pr-1 flex-1 min-h-0">
              {tasks.length === 0 && (
                <div className="text-center py-4 text-gray-400 dark:text-gray-500 text-xs italic">
                  Aucune tâche active
                </div>
              )}
              {tasks.map((quest) => (
                <div key={quest.id} className="flex items-start gap-2 p-2 rounded-lg border bg-pink-50/50 dark:bg-pink-900/10 border-pink-100 dark:border-pink-800/30 group relative shrink-0 transition-colors">
                  <button 
                    onClick={() => toggleTask(quest.id)} 
                    className={cn("mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors", quest.completed ? "bg-green-400 border-green-500 text-white dark:bg-green-600 dark:border-green-700" : "bg-white dark:bg-gray-800 border-pink-300 dark:border-pink-700")}
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <EditableText 
                      initialValue={quest.title}
                      onSave={(val) => updateTaskTitle(quest.id, val)}
                      className={cn("text-xs font-medium leading-tight bg-transparent w-full break-words dark:text-gray-200", quest.completed && "line-through text-gray-400 dark:text-gray-600")}
                    />
                  </div>
                  <button 
                    onClick={() => deleteTask(quest.id)}
                    className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'notes':
        return <NotesWidget contextId={activeTab} />;
      case 'sticky':
        return (
          <StickyNote 
            id={widget.id} 
            content={stickyNotes[widget.id] || ''} 
            onChange={handleStickyNoteChange}
          />
        );
      default:
        return null;
    }
  };

  const getWidgetTitle = (type: string) => {
    switch (type) {
      case 'tasks': return 'Tâches';
      case 'notes': return 'Quick Notes';
      case 'sticky': return 'Note';
      default: return 'Widget';
    }
  };

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'tasks': return <ListTodo className="w-4 h-4" />;
      case 'notes': return <FileText className="w-4 h-4" />;
      case 'sticky': return <StickyNoteIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  const getWidgetColor = (type: string) => {
    switch (type) {
      case 'tasks': return 'bg-pink-500';
      case 'notes': return 'bg-amber-500';
      case 'sticky': return 'bg-yellow-400';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0] dark:bg-[#121212] pb-20 relative overflow-hidden transition-colors duration-300">
      {/* Background Avatar - Draggable */}
      {!isWhiteboardTab && (
        <Rnd
          position={avatarPosition.x === -1 ? { x: window.innerWidth / 2 - 150, y: window.innerHeight - 500 } : avatarPosition}
          size={{ width: 300, height: 500 }}
          onDragStart={() => setIsAvatarDragging(true)}
          onDragStop={(e, d) => {
            setIsAvatarDragging(false);
            setAvatarPosition({ x: d.x, y: d.y });
          }}
          enableResizing={false}
          bounds="parent"
          className={cn(
            "z-0 transition-opacity duration-300",
            isAvatarDragging && "opacity-70"
          )}
        >
          <div className="relative w-full h-full flex items-end justify-center">
            <img 
              src="/avatar-transparent.png" 
              alt="Background Avatar" 
              className={cn(
                "h-full object-contain animate-breathe cursor-move",
                darkMode && "brightness-125 contrast-110"
              )}
              style={{ 
                maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                filter: darkMode ? 'brightness(1.3) saturate(1.1)' : 'none'
              }}
            />
            {/* Drag indicator */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/20 dark:bg-white/20 rounded-full px-2 py-1 opacity-0 hover:opacity-100 transition-opacity">
              <Move className="w-4 h-4 text-white dark:text-gray-300" />
            </div>
          </div>
        </Rnd>
      )}

      {/* Unified Header & Tabs Bar */}
      <div className="sticky top-0 z-30 bg-[#FFF9F0]/95 dark:bg-[#121212]/95 backdrop-blur-sm pt-2 pb-1 px-2 flex items-center gap-2 shadow-sm transition-colors duration-300">
        {/* Sync Status Indicator */}
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

        {/* Center: Tabs (Scrollable) */}
        <div className="flex-1 overflow-hidden">
          <GameTabs tabs={allTabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setIsExportOpen(true)}
            className="p-2 bg-white dark:bg-card rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:scale-105 transition-all"
            title="Exporter le rapport PDF"
          >
            <Download className="w-4 h-4 text-blue-500" />
          </button>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-white dark:bg-card rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:scale-105 transition-all"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
          {isAuthenticated ? (
            <button 
              onClick={logout}
              className="p-2 bg-white dark:bg-card rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:scale-105 transition-all"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4 text-red-500" />
            </button>
          ) : (
            <button 
              onClick={handleLogin}
              className="p-2 bg-pink-500 rounded-full shadow-sm hover:scale-105 transition-all"
              title="Connexion pour synchroniser"
            >
              <LogIn className="w-4 h-4 text-white" />
            </button>
          )}
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="p-2 bg-white dark:bg-card rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:scale-105 transition-all"
          >
            <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 h-[calc(100vh-60px)]">
        {isWhiteboardTab ? (
          // Whiteboard Mode
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            </div>
          }>
            <div className="w-full h-full">
              <Whiteboard tabId={activeTab} />
            </div>
          </Suspense>
        ) : (
          // Free-form Widget Mode
          <div className="relative w-full h-full">
            {/* Add Widget Button */}
            <div className="absolute bottom-4 right-4 z-50">
              <div className="relative">
                <button
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  className="w-12 h-12 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                >
                  <Plus className="w-6 h-6" />
                </button>
                
                {showAddMenu && (
                  <div className="absolute bottom-14 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 min-w-[160px]">
                    <button
                      onClick={() => addWidget('tasks')}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                    >
                      <ListTodo className="w-4 h-4 text-pink-500" />
                      <span className="text-sm font-medium dark:text-gray-200">Tâches</span>
                    </button>
                    <button
                      onClick={() => addWidget('notes')}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                    >
                      <FileText className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium dark:text-gray-200">Quick Notes</span>
                    </button>
                    <button
                      onClick={() => addWidget('sticky')}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                    >
                      <StickyNoteIcon className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium dark:text-gray-200">Note Volante</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Draggable Widgets */}
            {widgets.map((widget, index) => (
              <DraggableWidget
                key={widget.id}
                id={widget.id}
                title={getWidgetTitle(widget.type)}
                icon={getWidgetIcon(widget.type)}
                headerColor={getWidgetColor(widget.type)}
                defaultPosition={{ x: widget.position.x, y: widget.position.y }}
                defaultSize={{ width: widget.position.width, height: widget.position.height }}
                onPositionChange={handleWidgetPositionChange}
                onRemove={handleRemoveWidget}
                onFocus={setFocusedWidget}
                zIndex={focusedWidget === widget.id ? 20 : 10 + index}
              >
                {renderWidgetContent(widget)}
              </DraggableWidget>
            ))}
          </div>
        )}
      </main>
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      <ExportDialog 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
        onExport={handleExport}
      />
    </div>
  );
}
