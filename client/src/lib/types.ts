export interface ThemeConfig {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
}

export interface TabConfig {
  id: string;
  label: string;
  color: string; // Tailwind color class or hex
}

export interface ModuleConfig {
  id: string;
  type: 'quests' | 'stats' | 'inventory' | 'skills' | 'map';
  title: string;
  tabId: string; // Which tab this module belongs to
  order: number;
}

export interface AppConfig {
  theme: ThemeConfig;
  tabs: TabConfig[];
  modules: ModuleConfig[];
}

export const DEFAULT_CONFIG: AppConfig = {
  theme: {
    primary: '#FF69B4', // Rose Bonbon
    secondary: '#FFD700', // Jaune Or
    background: '#FFF9F0', // Crème
    card: '#FFFFFF',
    text: '#4A4A4A',
  },
  tabs: [
    { id: 'missions', label: 'Pilotage', color: 'bg-pink-500' },
    { id: 'inventory', label: 'Ressources', color: 'bg-yellow-500' },
    { id: 'maison', label: 'Maison', color: 'bg-orange-500' },
    { id: 'map', label: 'Plan', color: 'bg-cyan-500' },
  ],
  modules: [
    { id: 'quest-log', type: 'quests', title: 'Tâches Prioritaires', tabId: 'missions', order: 0 },
    { id: 'stats-panel', type: 'stats', title: 'Indicateurs', tabId: 'missions', order: 1 },
    { id: 'inventory-grid', type: 'inventory', title: 'Outils & Ressources', tabId: 'inventory', order: 0 },
    { id: 'skills-list', type: 'skills', title: 'Performance & KPIs', tabId: 'skills', order: 0 },
    { id: 'world-map', type: 'map', title: 'Plan de Salle', tabId: 'map', order: 0 },
  ]
};
