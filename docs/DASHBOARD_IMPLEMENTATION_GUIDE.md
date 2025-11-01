# Dashboard Plugin Framework — Implementation Guide

## 1. Core File & Directory Structure

```
/dashboard-core
├── /src
│   ├── index.tsx                 # Entry point
│   ├── App.tsx                   # Root component
│   ├── /components
│   │   ├── OSLayout.tsx          # Main layout wrapper
│   │   ├── Sidebar.tsx           # Dynamic sidebar
│   │   ├── CommandPalette.tsx    # Command interface
│   │   └── Toast.tsx             # Notification system
│   ├── /core
│   │   ├── pluginRegistry.ts     # Plugin lifecycle management
│   │   ├── eventBus.ts           # Pub/sub event system
│   │   ├── dataStore.ts          # Global reactive store
│   │   ├── permissionManager.ts  # RBAC system
│   │   └── types.ts              # TypeScript interfaces
│   ├── /widgets
│   │   ├── WidgetContainer.tsx   # Widget wrapper
│   │   ├── WidgetLoader.tsx      # Dynamic loader
│   │   └── index.ts              # Widget exports
│   ├── /plugins
│   │   ├── receipts/             # Receipt Management plugin
│   │   │   ├── index.ts
│   │   │   ├── manifest.json
│   │   │   └── components/
│   │   ├── financeKPIs/          # Financial KPIs plugin
│   │   │   ├── index.ts
│   │   │   ├── manifest.json
│   │   │   └── components/
│   │   └── aiInsights/           # AI Insights plugin
│   │       ├── index.ts
│   │       ├── manifest.json
│   │       └── components/
│   └── /utils
│       └── apiClient.ts          # HTTP client wrapper
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 2. Core Modules Implementation

### pluginRegistry.ts

Handles dynamic plugin discovery, loading, and lifecycle management.

```typescript
import { DashboardPlugin } from "./types";

class PluginRegistry {
  private plugins: Map<string, DashboardPlugin> = new Map();
  private loadedPlugins: Set<string> = new Set();

  /**
   * Register a plugin with the registry
   */
  async registerPlugin(plugin: DashboardPlugin): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Plugin ${plugin.id} already registered`);
      return;
    }

    this.plugins.set(plugin.id, plugin);
    console.log(`Plugin registered: ${plugin.id} v${plugin.version}`);
  }

  /**
   * Load a plugin and call its onLoad hook
   */
  async loadPlugin(id: string): Promise<void> {
    const plugin = this.plugins.get(id);
    if (!plugin) {
      throw new Error(`Plugin ${id} not found`);
    }

    if (this.loadedPlugins.has(id)) {
      console.warn(`Plugin ${id} already loaded`);
      return;
    }

    try {
      await plugin.onLoad?.();
      this.loadedPlugins.add(id);
      console.log(`Plugin loaded: ${id}`);
    } catch (error) {
      console.error(`Failed to load plugin ${id}:`, error);
      throw error;
    }
  }

  /**
   * Unload a plugin and call its onUnload hook
   */
  async unloadPlugin(id: string): Promise<void> {
    const plugin = this.plugins.get(id);
    if (!plugin) {
      throw new Error(`Plugin ${id} not found`);
    }

    try {
      await plugin.onUnload?.();
      this.loadedPlugins.delete(id);
      console.log(`Plugin unloaded: ${id}`);
    } catch (error) {
      console.error(`Failed to unload plugin ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all registered plugins
   */
  getPlugins(): DashboardPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get a specific plugin
   */
  getPlugin(id: string): DashboardPlugin | undefined {
    return this.plugins.get(id);
  }

  /**
   * Get all loaded plugins
   */
  getLoadedPlugins(): DashboardPlugin[] {
    return Array.from(this.loadedPlugins).map(id => this.plugins.get(id)!);
  }

  /**
   * Check if a plugin is loaded
   */
  isLoaded(id: string): boolean {
    return this.loadedPlugins.has(id);
  }
}

export const pluginRegistry = new PluginRegistry();
```

### eventBus.ts

Central pub/sub system for widget-to-widget and plugin-to-core communication.

```typescript
type EventCallback = (payload?: any) => void;

class EventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  /**
   * Subscribe to an event
   */
  subscribe(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => this.unsubscribe(event, callback);
  }

  /**
   * Subscribe to an event once
   */
  once(event: string, callback: EventCallback): () => void {
    const wrapper = (payload?: any) => {
      callback(payload);
      this.unsubscribe(event, wrapper);
    };

    return this.subscribe(event, wrapper);
  }

  /**
   * Unsubscribe from an event
   */
  unsubscribe(event: string, callback: EventCallback): void {
    this.listeners.get(event)?.delete(callback);
  }

  /**
   * Emit an event
   */
  emit(event: string, payload?: any): void {
    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(payload);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  /**
   * Clear all listeners for an event
   */
  clear(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

export const eventBus = new EventBus();
```

### dataStore.ts

Global reactive store using Zustand for state management.

```typescript
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl?: number;
}

interface DataState {
  cache: Record<string, CacheEntry>;

  // Actions
  setData: (key: string, data: any, ttl?: number) => void;
  getData: (key: string) => any;
  removeData: (key: string) => void;
  clearCache: () => void;
  isExpired: (key: string) => boolean;
}

export const useDataStore = create<DataState>()(
  devtools(
    persist(
      (set, get) => ({
        cache: {},

        setData: (key: string, data: any, ttl?: number) => {
          set((state) => ({
            cache: {
              ...state.cache,
              [key]: {
                data,
                timestamp: Date.now(),
                ttl,
              },
            },
          }));
        },

        getData: (key: string) => {
          const entry = get().cache[key];
          if (!entry) return undefined;

          // Check if expired
          if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
            get().removeData(key);
            return undefined;
          }

          return entry.data;
        },

        removeData: (key: string) => {
          set((state) => {
            const newCache = { ...state.cache };
            delete newCache[key];
            return { cache: newCache };
          });
        },

        clearCache: () => {
          set({ cache: {} });
        },

        isExpired: (key: string) => {
          const entry = get().cache[key];
          if (!entry || !entry.ttl) return false;
          return Date.now() - entry.timestamp > entry.ttl;
        },
      }),
      {
        name: "dashboard-store",
      }
    )
  )
);
```

### permissionManager.ts

Fine-grained role-based access control (RBAC).

```typescript
interface UserPermissions {
  userId: string;
  roles: string[];
  permissions: Set<string>;
}

class PermissionManager {
  private userPermissions: Map<string, UserPermissions> = new Map();
  private rolePermissions: Map<string, Set<string>> = new Map();

  /**
   * Define permissions for a role
   */
  defineRole(role: string, permissions: string[]): void {
    this.rolePermissions.set(role, new Set(permissions));
  }

  /**
   * Assign roles to a user
   */
  assignRoles(userId: string, roles: string[]): void {
    const permissions = new Set<string>();

    roles.forEach((role) => {
      const rolePerms = this.rolePermissions.get(role);
      if (rolePerms) {
        rolePerms.forEach((perm) => permissions.add(perm));
      }
    });

    this.userPermissions.set(userId, {
      userId,
      roles,
      permissions,
    });
  }

  /**
   * Grant direct permission to a user
   */
  grantPermission(userId: string, permission: string): void {
    const userPerms = this.userPermissions.get(userId);
    if (userPerms) {
      userPerms.permissions.add(permission);
    }
  }

  /**
   * Check if user has permission
   */
  hasPermission(userId: string, permission: string): boolean {
    const userPerms = this.userPermissions.get(userId);
    return userPerms?.permissions.has(permission) ?? false;
  }

  /**
   * Check if user can access widget
   */
  canAccessWidget(userId: string, widgetId: string): boolean {
    const permission = `widget:${widgetId}`;
    return this.hasPermission(userId, permission);
  }

  /**
   * Check if user can access route
   */
  canAccessRoute(userId: string, routePath: string): boolean {
    const permission = `route:${routePath}`;
    return this.hasPermission(userId, permission);
  }

  /**
   * Get available plugins for user
   */
  getAvailablePlugins(userId: string, plugins: any[]): any[] {
    return plugins.filter((plugin) => {
      if (!plugin.permissions || plugin.permissions.length === 0) {
        return true;
      }
      return plugin.permissions.every((perm: string) =>
        this.hasPermission(userId, perm)
      );
    });
  }
}

export const permissionManager = new PermissionManager();
```

### types.ts

TypeScript interfaces for the plugin system.

```typescript
export interface DashboardPlugin {
  id: string;
  name: string;
  version: string;
  description?: string;

  // Lifecycle hooks
  onLoad?: () => Promise<void>;
  onUnload?: () => Promise<void>;

  // UI components
  routes?: RouteConfig[];
  menuItems?: MenuItem[];
  widgets?: WidgetConfig[];

  // Data sources
  api?: APIEndpoint[];
  channels?: RealtimeChannel[];

  // Access control
  permissions?: string[];
}

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title: string;
  icon?: React.ReactNode;
  permissions?: string[];
}

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  section?: string;
  order?: number;
  permissions?: string[];
}

export interface WidgetConfig {
  id: string;
  component: React.ComponentType;
  title: string;
  category: 'kpi' | 'chart' | 'table' | 'feed' | 'form';
  size: { w: number; h: number };
  dataSources?: string[];
  permissions?: string[];
  settings?: Record<string, any>;
}

export interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  cache?: { ttl: number };
  permissions?: string[];
}

export interface RealtimeChannel {
  id: string;
  name: string;
  events: string[];
  permissions?: string[];
}
```

## 3. Widget System

### WidgetLoader.tsx

Dynamic widget rendering with lazy loading and error boundaries.

```typescript
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
    <div className="p-2 rounded-2xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <ErrorBoundary
        fallback={
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-semibold">{config.title}</p>
            <p className="text-yellow-600 text-sm">Failed to load widget</p>
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="p-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <Component />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
```

### WidgetContainer.tsx

Container component for managing widget layout and state.

```typescript
import React from "react";
import { WidgetConfig } from "../core/types";
import { WidgetLoader } from "./WidgetLoader";

interface WidgetContainerProps {
  config: WidgetConfig;
  onRemove?: () => void;
  onSettings?: () => void;
}

export const WidgetContainer = ({
  config,
  onRemove,
  onSettings,
}: WidgetContainerProps) => {
  return (
    <div
      className="widget-container"
      style={{
        gridColumn: `span ${config.size.w}`,
        gridRow: `span ${config.size.h}`,
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {config.title}
          </h3>
          <div className="flex gap-2">
            {onSettings && (
              <button
                onClick={onSettings}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Widget settings"
              >
                ⚙️
              </button>
            )}
            {onRemove && (
              <button
                onClick={onRemove}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600"
                title="Remove widget"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <WidgetLoader config={config} />
        </div>
      </div>
    </div>
  );
};
```

## 4. Setup Flow

### Initialization Sequence

```typescript
// 1. Load Core Framework
import { pluginRegistry } from "./core/pluginRegistry";
import { eventBus } from "./core/eventBus";
import { useDataStore } from "./core/dataStore";
import { permissionManager } from "./core/permissionManager";

// 2. Fetch and Register Plugins
async function initializeDashboard() {
  try {
    // Fetch plugin manifests
    const response = await fetch("/plugins-manifest.json");
    const manifests = await response.json();

    // Register each plugin
    for (const manifest of manifests) {
      const pluginModule = await import(manifest.url);
      await pluginRegistry.registerPlugin(pluginModule.default);
    }

    // Load all plugins
    for (const plugin of pluginRegistry.getPlugins()) {
      await pluginRegistry.loadPlugin(plugin.id);
    }

    console.log("Dashboard initialized successfully");
  } catch (error) {
    console.error("Failed to initialize dashboard:", error);
  }
}

// 3. Render Layout
export function App() {
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    initializeDashboard().then(() => setInitialized(true));
  }, []);

  if (!initialized) {
    return <div>Loading dashboard...</div>;
  }

  return <OSLayout />;
}
```

## 5. Example Plugin — "Receipts Manager"

### receipts/manifest.json

```json
{
  "id": "converto.receipts",
  "name": "Receipt Management",
  "version": "1.0.0",
  "description": "Manage, upload, and analyze receipts",
  "permissions": ["read:receipts", "write:receipts"]
}
```

### receipts/index.ts

```typescript
import { DashboardPlugin } from "../../core/types";
import { ReceiptList } from "./components/ReceiptList";
import { ReceiptUploader } from "./components/ReceiptUploader";

export const ReceiptsPlugin: DashboardPlugin = {
  id: "converto.receipts",
  name: "Receipt Management",
  version: "1.0.0",
  description: "Manage, upload, and analyze receipts",

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
      permissions: ["read:receipts"],
    },
  ],

  widgets: [
    {
      id: "receipt-list-widget",
      component: ReceiptList,
      title: "Recent Receipts",
      category: "table",
      size: { w: 4, h: 3 },
      permissions: ["read:receipts"],
    },
    {
      id: "receipt-uploader-widget",
      component: ReceiptUploader,
      title: "Upload Receipt",
      category: "form",
      size: { w: 2, h: 2 },
      permissions: ["write:receipts"],
    },
  ],

  api: [
    {
      id: "get-receipts",
      method: "GET",
      path: "/api/receipts",
      cache: { ttl: 60000 },
      permissions: ["read:receipts"],
    },
    {
      id: "upload-receipt",
      method: "POST",
      path: "/api/receipts",
      permissions: ["write:receipts"],
    },
  ],

  channels: [
    {
      id: "receipts-updates",
      name: "receipts",
      events: ["INSERT", "UPDATE", "DELETE"],
      permissions: ["read:receipts"],
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
```

## 6. Integration Path

### Frontend Stack
- **Framework:** React 18+ with TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Build Tool:** Vite

### Backend Stack (Optional)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL or MongoDB
- **Purpose:** Plugin registry microservice

### Deployment
- **Frontend:** Netlify or Vercel
- **Backend:** Docker container on AWS/GCP/Azure
- **CDN:** Cloudflare for plugin distribution

## 7. Future Enhancements

- [ ] Plugin sandbox via iframe isolation
- [ ] Marketplace with plugin dependency resolution
- [ ] User dashboard JSON layouts saved in DB
- [ ] GraphQL federation layer for external APIs
- [ ] Plugin versioning and compatibility matrix
- [ ] Automated plugin updates
- [ ] Plugin performance monitoring
- [ ] Plugin monetization support
