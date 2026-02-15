import { createContext, useContext, ReactNode, useEffect, useMemo } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { AppConfig, DEFAULT_CONFIG, DEFAULT_ZONES, ZoneConfig } from '@/lib/types';

interface ConfigContextType {
  config: AppConfig;
  updateConfig: (newConfig: AppConfig) => void;
  resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const REFERENCE_WIDTH = 1920;
const REFERENCE_HEIGHT = 1080;

/** Migrate a single zone's position from old "10%" format to pixel numbers */
function migrateZonePosition(zone: any): ZoneConfig {
  const pos = zone.position;
  if (pos && typeof pos.x === 'string') {
    // Convert percentage string → pixel number
    const xPercent = parseFloat(pos.x) / 100;
    const yPercent = parseFloat(pos.y) / 100;
    return {
      ...zone,
      position: {
        x: Math.round(xPercent * REFERENCE_WIDTH),
        y: Math.round(yPercent * REFERENCE_HEIGHT),
      },
    };
  }
  return zone as ZoneConfig;
}

/** Ensure config has all required fields (migrate old configs) */
function migrateConfig(raw: any): AppConfig {
  const zones = raw.zones && raw.zones.length > 0
    ? raw.zones.map(migrateZonePosition)
    : DEFAULT_ZONES;

  return {
    ...DEFAULT_CONFIG,
    ...raw,
    zones,
    viewMode: raw.viewMode || 'vision-board',
    tabs: raw.tabs || DEFAULT_CONFIG.tabs,
    modules: raw.modules || DEFAULT_CONFIG.modules,
    theme: { ...DEFAULT_CONFIG.theme, ...raw.theme },
  };
}

/** Check if config needs migration (has old string positions) */
function needsMigration(raw: any): boolean {
  if (!raw.zones || raw.zones.length === 0) return true;
  return raw.zones.some((z: any) => z.position && typeof z.position.x === 'string');
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [rawConfig, setConfig] = usePersistedState<AppConfig>('rpg_app_config', DEFAULT_CONFIG);

  // Always compute a safe, migrated config
  const config = useMemo(() => migrateConfig(rawConfig), [rawConfig]);

  // Persist migrated version if it changed
  useEffect(() => {
    if (needsMigration(rawConfig)) {
      setConfig(config);
    }
  }, []);

  const updateConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    document.documentElement.style.setProperty('--primary', newConfig.theme.primary);
    document.documentElement.style.setProperty('--secondary', newConfig.theme.secondary);
    document.documentElement.style.setProperty('--background', newConfig.theme.background);
    document.documentElement.style.setProperty('--card', newConfig.theme.card);
    document.documentElement.style.setProperty('--foreground', newConfig.theme.text);
  };

  const resetConfig = () => {
    updateConfig(DEFAULT_CONFIG);
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
