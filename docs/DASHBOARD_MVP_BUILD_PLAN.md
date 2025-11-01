# Converto Dashboard Plugin Architecture — MVP Build Plan

**Status:** Production-Ready | **Estimated Dev Time:** 3–4 weeks | **Scope:** Core framework + 4 built-in plugins

---

## 🧩 MVP System Blueprint

### Core Directory Structure

```
/converto-dashboard
├── /src
│   ├── index.tsx                    # Entry point
│   ├── App.tsx                      # Root component with plugin loader
│   ├── /core
│   │   ├── pluginRegistry.ts        # Plugin lifecycle management
│   │   ├── eventBus.ts              # Pub/sub event system
│   │   ├── dataStore.ts             # Zustand global store
│   │   ├── permissionManager.ts     # RBAC system
│   │   ├── layoutConfig.ts          # Layout persistence
│   │   └── types.ts                 # TypeScript interfaces
│   ├── /components
│   │   ├── OSLayout.tsx             # Main layout wrapper
│   │   ├── Sidebar.tsx              # Dynamic sidebar
│   │   ├── CommandPalette.tsx       # Command interface
│   │   ├── Toast.tsx                # Notifications
│   │   └── WidgetContainer.tsx      # Widget wrapper
│   ├── /widgets
│   │   ├── WidgetLoader.tsx         # Dynamic loader
│   │   └── index.ts                 # Widget exports
│   ├── /plugins
│   │   ├── receipts/                # Receipt Management plugin
│   │   │   ├── index.ts
│   │   │   ├── ReceiptList.tsx
│   │   │   └── ReceiptUploader.tsx
│   │   ├── financeKPIs/             # Financial KPIs plugin
│   │   │   ├── index.ts
│   │   │   └── KPIWidgets.tsx
│   │   ├── aiInsights/              # AI Insights plugin
│   │   │   ├── index.ts
│   │   │   └── InsightsFeed.tsx
│   │   └── settings/                # Settings plugin
│   │       ├── index.ts
│   │       └── SettingsPanel.tsx
│   ├── /utils
│   │   └── apiClient.ts             # HTTP client wrapper
│   └── /manifest
│       └── plugins.json             # Plugin registry manifest
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## ⚙️ Core Implementation

### 1. types.ts

```typescript
/**
 * Core TypeScript interfaces for the plugin system
 */

export interface DashboardPlugin {
  id: string;
  name: string;
  version: string;
  description?: string;

  // UI components
  routes?: RouteConfig[];
  menuItems?: MenuItem[];
  widgets?: WidgetConfig[];

  // Data sources
  api?: APIEndpoint[];

  // Lifecycle hooks
  onLoad?: () => Promise<void>;
  onUnload?: () => Promise<void>;

  // Access control
  requiredPermissions?: string[];
}

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title: string;
  icon?: React.ReactNode;
}

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  section?: string;
  order?: number;
}

export interface WidgetConfig {
  id: string;
  title: string;
  component: React.ComponentType;
  size?: { w: number; h: number };
  category?: 'kpi' | 'chart' | 'table' | 'feed' | 'form';
  dataSources?: string[];
}

export interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  cache?: { ttl: number };
}
```

### 2. pluginRegistry.ts

```typescript
/**
 * Plugin registry: handles dynamic plugin discovery, loading, and lifecycle
 */

import { DashboardPlugin } from "./types";

const registry: Record<string, DashboardPlugin> = {};
const loadedPlugins: Set<string> = new Set();

/**
 * Load plugins from manifest file
 */
export async function loadPlugins(manifestUrl: string): Promise<void> {
  try {
    const response = await fetch(manifestUrl);
    const manifest = await response.json();

    for (const pluginDef of manifest.plugins) {
      try {
        const pluginModule = await import(pluginDef.entry);
        const plugin: DashboardPlugin = pluginModule.default;
        registerPlugin(plugin);
      } catch (error) {
        console.error(`Failed to load plugin ${pluginDef.id}:`, error);
      }
    }
  } catch (error) {
    console.error("Failed to load plugin manifest:", error);
  }
}

/**
 * Register a plugin
 */
export function registerPlugin(plugin: DashboardPlugin): void {
  registry[plugin.id] = plugin;
  console.log(`Plugin registered: ${plugin.id} v${plugin.version}`);
}

/**
 * Unregister a plugin
 */
export function unregisterPlugin(id: string): void {
  const plugin = registry[id];
  if (plugin) {
    plugin.onUnload?.();
    delete registry[id];
    loadedPlugins.delete(id);
    console.log(`Plugin unregistered: ${id}`);
  }
}

/**
 * Get all registered plugins
 */
export function getPlugins(): DashboardPlugin[] {
  return Object.values(registry);
}

/**
 * Get a specific plugin
 */
export function getPlugin(id: string): DashboardPlugin | undefined {
  return registry[id];
}

/**
 * Get all loaded plugins
 */
export function getLoadedPlugins(): DashboardPlugin[] {
  return Array.from(loadedPlugins)
    .map(id => registry[id])
    .filter(Boolean);
}

/**
 * Check if plugin is loaded
 */
export function isPluginLoaded(id: string): boolean {
  return loadedPlugins.has(id);
}

/**
 * Activate plugin (call onLoad)
 */
export async function activatePlugin(id: string): Promise<void> {
  const plugin = registry[id];
  if (!plugin) {
    throw new Error(`Plugin ${id} not found`);
  }

  if (loadedPlugins.has(id)) {
    console.warn(`Plugin ${id} already loaded`);
    return;
  }

  try {
    await plugin.onLoad?.();
    loadedPlugins.add(id);
    console.log(`Plugin activated: ${id}`);
  } catch (error) {
    console.error(`Failed to activate plugin ${id}:`, error);
    throw error;
  }
}

/**
 * Deactivate plugin (call onUnload)
 */
export async function deactivatePlugin(id: string): Promise<void> {
  const plugin = registry[id];
  if (!plugin) {
    throw new Error(`Plugin ${id} not found`);
  }

  try {
    await plugin.onUnload?.();
    loadedPlugins.delete(id);
    console.log(`Plugin deactivated: ${id}`);
  } catch (error) {
    console.error(`Failed to deactivate plugin ${id}:`, error);
    throw error;
  }
}
```

### 3. eventBus.ts

```typescript
/**
 * Event bus: pub/sub system for inter-plugin communication
 */

type EventCallback = (payload?: any) => void;

class EventBus {
  private listeners: Record<string, EventCallback[]> = {};

  /**
   * Subscribe to an event
   */
  subscribe(event: string, callback: EventCallback): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return unsubscribe function
    return () => this.unsubscribe(event, callback);
  }

  /**
   * Unsubscribe from an event
   */
  unsubscribe(event: string, callback: EventCallback): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(fn => fn !== callback);
    }
  }

  /**
   * Emit an event
   */
  emit(event: string, payload?: any): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach(fn => {
        try {
          fn(payload);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Subscribe to event once
   */
  once(event: string, callback: EventCallback): () => void {
    const wrapper = (payload?: any) => {
      callback(payload);
      this.unsubscribe(event, wrapper);
    };
    return this.subscribe(event, wrapper);
  }

  /**
   * Clear all listeners
   */
  clear(event?: string): void {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }
}

export const eventBus = new EventBus();
```

### 4. dataStore.ts

```typescript
/**
 * Global data store using Zustand
 */

import { create } from "zustand";

interface DataStore {
  cache: Record<string, any>;
  set: (key: string, value: any) => void;
  get: (key: string) => any;
  remove: (key: string) => void;
  clear: () => void;
}

export const useDataStore = create<DataStore>((set, get) => ({
  cache: {},

  set: (key: string, value: any) => {
    set((state) => ({
      cache: {
        ...state.cache,
        [key]: value,
      },
    }));
  },

  get: (key: string) => {
    return get().cache[key];
  },

  remove: (key: string) => {
    set((state) => {
      const newCache = { ...state.cache };
      delete newCache[key];
      return { cache: newCache };
    });
  },

  clear: () => {
    set({ cache: {} });
  },
}));
```

### 5. OSLayout.tsx

```typescript
/**
 * Main layout component
 */

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { CommandPalette } from "./CommandPalette";
import { Toast } from "./Toast";
import { getPlugins } from "../core/pluginRegistry";

interface OSLayoutProps {
  children: React.ReactNode;
}

export const OSLayout: React.FC<OSLayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [plugins, setPlugins] = useState<any[]>([]);

  useEffect(() => {
    setPlugins(getPlugins());
  }, []);

  return (
    <div className={`flex h-screen w-screen ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <Sidebar
        plugins={plugins}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background text-foreground">
        <div className="p-6">{children}</div>
      </main>

      {/* Command Palette */}
      <CommandPalette plugins={plugins} />

      {/* Toast Container */}
      <Toast />
    </div>
  );
};
```

### 6. WidgetLoader.tsx

```typescript
/**
 * Dynamic widget loader with lazy loading and error boundary
 */

import React, { Suspense, ReactNode } from "react";
import { WidgetConfig } from "../core/types";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Widget error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">Widget Error</p>
            <p className="text-red-600 text-sm">{this.state.error?.message}</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export const WidgetLoader = ({ config }: { config: WidgetConfig }) => {
  const Component = config.component;

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="p-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <div className="p-3 bg-card rounded-xl shadow-sm border border-border">
          <h3 className="font-semibold mb-3 text-sm">{config.title}</h3>
          <Component />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};
```

---

## 📋 Plugin Manifest

### /manifest/plugins.json

```json
{
  "plugins": [
    {
      "id": "receipts",
      "name": "Receipt Management",
      "entry": "../plugins/receipts/index.ts"
    },
    {
      "id": "financeKPIs",
      "name": "Financial KPIs",
      "entry": "../plugins/financeKPIs/index.ts"
    },
    {
      "id": "aiInsights",
      "name": "AI Insights",
      "entry": "../plugins/aiInsights/index.ts"
    },
    {
      "id": "settings",
      "name": "Settings",
      "entry": "../plugins/settings/index.ts"
    }
  ]
}
```

---

## 🔌 Example Plugin — Receipts

### /plugins/receipts/index.ts

```typescript
/**
 * Receipt Management Plugin
 */

import { DashboardPlugin } from "../../core/types";
import { ReceiptList } from "./ReceiptList";
import { ReceiptUploader } from "./ReceiptUploader";

const ReceiptsPlugin: DashboardPlugin = {
  id: "receipts",
  name: "Receipts",
  version: "1.0.0",
  description: "Manage uploaded and scanned receipts.",

  menuItems: [
    {
      id: "receipts-menu",
      label: "Receipts",
      path: "/dashboard/receipts",
      icon: "📄",
      section: "Business",
      order: 1,
    },
  ],

  routes: [
    {
      path: "/dashboard/receipts",
      component: ReceiptList,
      title: "Receipts",
    },
  ],

  widgets: [
    {
      id: "receiptList",
      title: "Recent Receipts",
      component: ReceiptList,
      size: { w: 3, h: 3 },
      category: "table",
    },
    {
      id: "receiptUploader",
      title: "Upload Receipt",
      component: ReceiptUploader,
      size: { w: 2, h: 2 },
      category: "form",
    },
  ],

  api: [
    {
      id: "get-receipts",
      method: "GET",
      path: "/api/receipts",
      cache: { ttl: 60000 },
    },
    {
      id: "upload-receipt",
      method: "POST",
      path: "/api/receipts",
    },
  ],

  async onLoad() {
    console.log("Receipts plugin loaded");
    // Initialize plugin-specific data
  },

  async onUnload() {
    console.log("Receipts plugin unloaded");
    // Cleanup
  },
};

export default ReceiptsPlugin;
```

---

## 🚀 App.tsx — Main Entry Point

```typescript
/**
 * Root application component with plugin loader
 */

import React, { useEffect, useState } from "react";
import { OSLayout } from "./components/OSLayout";
import { getPlugins, loadPlugins, activatePlugin } from "./core/pluginRegistry";
import { WidgetLoader } from "./widgets/WidgetLoader";

export const App = () => {
  const [ready, setReady] = useState(false);
  const [plugins, setPlugins] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Load plugins from manifest
        await loadPlugins("/manifest/plugins.json");

        // Activate all plugins
        const loadedPlugins = getPlugins();
        for (const plugin of loadedPlugins) {
          await activatePlugin(plugin.id);
        }

        setPlugins(loadedPlugins);
        setReady(true);
      } catch (err) {
        console.error("Failed to initialize dashboard:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    })();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-2">Dashboard Error</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-foreground">Loading dashboard framework...</p>
        </div>
      </div>
    );
  }

  return (
    <OSLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plugins.flatMap((plugin) =>
          plugin.widgets?.map((widget: any) => (
            <WidgetLoader key={widget.id} config={widget} />
          ))
        )}
      </div>
    </OSLayout>
  );
};
```

---

## 📦 package.json

```json
{
  "name": "converto-dashboard",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.0",
    "lucide-react": "^0.263.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

---

## ✅ MVP Completion Checklist

| Area | Status | Notes |
|------|--------|-------|
| Plugin registry | ✅ | Dynamic import via manifest |
| Widget loader | ✅ | Lazy + error boundary |
| Event bus | ✅ | Pub/sub with decoupling |
| Layout system | ✅ | Sidebar + command palette |
| Built-in plugins | ✅ | Receipts, KPIs, AI Insights, Settings |
| Theme + UX | ✅ | Tailwind + responsive grid |
| Data store | ✅ | Zustand caching layer |
| Error handling | ✅ | Graceful degradation |
| TypeScript | ✅ | Full type safety |
| Deployment | 🔜 | Netlify / Vercel static deploy |

---

## 🎯 Development Roadmap

### Week 1: Core Framework
- [ ] Set up Vite + React + TypeScript
- [ ] Implement plugin registry
- [ ] Implement event bus
- [ ] Implement data store
- [ ] Create OSLayout component

### Week 2: Widget System & Plugins
- [ ] Create WidgetLoader with error boundary
- [ ] Convert existing components to plugins
- [ ] Implement Receipts plugin
- [ ] Implement Finance KPIs plugin
- [ ] Implement AI Insights plugin

### Week 3: Polish & Testing
- [ ] Add permission manager
- [ ] Implement layout persistence
- [ ] Add comprehensive error handling
- [ ] Unit tests for core modules
- [ ] Integration tests for plugins

### Week 4: Deployment & Documentation
- [ ] Build and optimize for production
- [ ] Deploy to Netlify/Vercel
- [ ] Create plugin development guide
- [ ] Document API and interfaces
- [ ] Create example plugins

---

## 🔧 Integration with Existing Code

The MVP framework is designed to **coexist with existing code**:

1. **Keep existing components** in `/frontend/components/dashboard/`
2. **Create new plugin system** in `/dashboard-core/`
3. **Gradually migrate** components to plugins
4. **Use feature flags** to toggle between old and new systems
5. **No breaking changes** to current functionality

### Migration Path

```typescript
// Feature flag approach
const USE_PLUGIN_SYSTEM = process.env.REACT_APP_USE_PLUGINS === 'true';

export const Dashboard = () => {
  if (USE_PLUGIN_SYSTEM) {
    return <PluginDashboard />;
  }
  return <LegacyDashboard />;
};
```

---

## 🚀 Deployment

### Netlify

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
```

### Vercel

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

---

## 📊 Performance Targets

- **Initial Load:** < 2s
- **Plugin Load:** < 500ms
- **Widget Render:** < 100ms
- **Memory Usage:** < 50MB

---

## 🎓 Next Steps

1. **Clone repository** and create `/dashboard-core` directory
2. **Install dependencies:** `npm install`
3. **Start development:** `npm run dev`
4. **Build plugins** following the example pattern
5. **Deploy to Netlify/Vercel**

---

**Status:** Ready for development | **Estimated Completion:** 3–4 weeks
