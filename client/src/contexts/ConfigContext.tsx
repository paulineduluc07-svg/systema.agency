import { createContext, useContext, ReactNode } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { AppConfig, DEFAULT_CONFIG } from '@/lib/types';

interface ConfigContextType {
  config: AppConfig;
  updateConfig: (newConfig: AppConfig) => void;
  resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = usePersistedState<AppConfig>('rpg_app_config', DEFAULT_CONFIG);

  const updateConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    // Apply theme CSS variables immediately
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
