# Converto Dashboard Plugin Architecture

## Overview

The Converto dashboard uses a **modular plugin-based framework** that treats every dashboard feature as an installable and extensible module. This design enables the dashboard to start minimal, grow horizontally, and support bespoke integrations without code coupling.

## Core Foundation (Immutable)

### OSLayout
- Grid layout system with responsive breakpoints
- Theme management (dark/light mode)
- Global state management
- Command palette (Cmd+K)
- Keyboard shortcuts (Cmd+B for sidebar toggle)

### Navigation Core
- Dynamic plugin-driven menu system
- Hierarchical section support
- Collapsible sidebar with state persistence
- Breadcrumb navigation

### Widget Engine
- Dynamic loader for React components
- Component defined by plugin manifest
- Error boundary isolation
- Lazy loading with React.lazy()

### Data Manager
- Unified state store
- Adapters for REST, GraphQL, WebSocket
- Local caching layer
- Real-time subscription management

## Plugin Contract

### DashboardPlugin Interface

```typescript
interface DashboardPlugin {
  id: string;                          // Unique plugin identifier
  name: string;                        // Display name
  version: string;                     // Semantic versioning
  description?: string;                // Plugin description

  // Lifecycle hooks
  onLoad?: () => Promise<void>;        // Called when plugin loads
  onUnload?: () => Promise<void>;      // Called when plugin unloads

  // UI components
  routes?: RouteConfig[];              // Page routes
  menuItems?: MenuItem[];              // Navigation menu items
  widgets?: WidgetConfig[];            // Dashboard widgets

  // Data sources
  api?: APIEndpoint[];                 // REST/GraphQL endpoints
  channels?: RealtimeChannel[];        // WebSocket channels

  // Access control
  permissions?: string[];              // Required permissions
}
```

### Widget Configuration Schema

```typescript
interface WidgetConfig {
  id: string;                          // Unique widget ID
  component: React.ComponentType;      // React component
  title: string;                       // Display title
  category: 'kpi' | 'chart' | 'table' | 'feed' | 'form';
  size: { w: number; h: number };     // Grid size (width, height)
  dataSources?: string[];              // Required data sources
  permissions?: string[];              // Required permissions
  settings?: Record<string, any>;      // User-configurable settings
}
```

### Route Configuration

```typescript
interface RouteConfig {
  path: string;                        // Route path (e.g., '/dashboard/receipts')
  component: React.ComponentType;      // Page component
  title: string;                       // Page title
  icon?: React.ReactNode;              // Navigation icon
  permissions?: string[];              // Required permissions
}
```

### Menu Item Configuration

```typescript
interface MenuItem {
  id: string;                          // Unique menu item ID
  label: string;                       // Display label
  path: string;                        // Route path
  icon?: React.ReactNode;              // Menu icon
  section?: string;                    // Menu section (e.g., 'Business', 'Analytics')
  order?: number;                      // Sort order
  permissions?: string[];              // Required permissions
}
```

### API Endpoint Configuration

```typescript
interface APIEndpoint {
  id: string;                          // Endpoint identifier
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;                        // API path
  cache?: { ttl: number };             // Cache configuration
  permissions?: string[];              // Required permissions
}
```

### Realtime Channel Configuration

```typescript
interface RealtimeChannel {
  id: string;                          // Channel identifier
  name: string;                        // Channel name
  events: string[];                    // Subscribed events
  permissions?: string[];              // Required permissions
}
```

## Subsystems

### 1. Dynamic Registry

**Purpose:** Discovers and manages plugins

**Features:**
- Loads plugin manifests from JSON or npm modules
- Validates plugin contracts
- Manages plugin lifecycle (load, enable, disable, unload)
- Tracks plugin dependencies

**Implementation:**
```typescript
class PluginRegistry {
  async loadPlugin(manifest: DashboardPlugin): Promise<void>;
  async unloadPlugin(pluginId: string): Promise<void>;
  getPlugin(pluginId: string): DashboardPlugin | null;
  listPlugins(): DashboardPlugin[];
  getPluginsByCategory(category: string): DashboardPlugin[];
}
```

### 2. Sandboxed Loader

**Purpose:** Isolates plugin runtime and prevents conflicts

**Features:**
- Uses React.lazy() for code splitting
- ErrorBoundary wraps each plugin
- Prevents global scope pollution
- Handles loading/error states gracefully

**Implementation:**
```typescript
class PluginLoader {
  async loadComponent(pluginId: string, componentPath: string): Promise<React.ComponentType>;
  wrapWithErrorBoundary(Component: React.ComponentType): React.ComponentType;
  preloadPlugin(pluginId: string): Promise<void>;
}
```

### 3. State Sharing (Event Bus)

**Purpose:** Enables inter-plugin communication without tight coupling

**Features:**
- Publish/subscribe event system
- Typed events with payloads
- Event filtering and routing
- Memory-efficient unsubscription

**Implementation:**
```typescript
class EventBus {
  subscribe<T>(event: string, handler: (payload: T) => void): () => void;
  publish<T>(event: string, payload: T): void;
  once<T>(event: string, handler: (payload: T) => void): () => void;
}
```

### 4. Permission Layer

**Purpose:** Fine-grained role-based access control (RBAC)

**Features:**
- Per-module permissions
- Per-widget permissions
- Per-route permissions
- Dynamic permission evaluation

**Implementation:**
```typescript
class PermissionManager {
  hasPermission(userId: string, permission: string): boolean;
  canAccessWidget(userId: string, widgetId: string): boolean;
  canAccessRoute(userId: string, routePath: string): boolean;
  getAvailablePlugins(userId: string): DashboardPlugin[];
}
```

### 5. Customization Engine

**Purpose:** Persists user dashboard layouts and preferences

**Features:**
- Drag-and-drop widget positioning
- User-specific dashboard layouts
- Widget settings persistence
- Layout versioning and rollback

**Implementation:**
```typescript
interface DashboardLayout {
  userId: string;
  version: number;
  widgets: Array<{
    id: string;
    pluginId: string;
    position: { x: number; y: number };
    size: { w: number; h: number };
    settings: Record<string, any>;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

class LayoutManager {
  async saveLayout(layout: DashboardLayout): Promise<void>;
  async loadLayout(userId: string): Promise<DashboardLayout>;
  async resetLayout(userId: string): Promise<void>;
}
```

## Core Plugins (Built-in)

### 1. Receipt Management Plugin
- **ID:** `converto.receipts`
- **Routes:** `/dashboard/receipts`, `/dashboard/receipts/new`
- **Widgets:** ReceiptList, ReceiptUploader
- **Data:** Receipt CRUD operations, OCR processing

### 2. Financial KPIs Plugin
- **ID:** `converto.kpis`
- **Widgets:** CashFlowKPI, MonthlySpendingKPI, ReceiptCountKPI
- **Data:** Financial aggregations, trend calculations

### 3. AI Insights Plugin
- **ID:** `converto.insights`
- **Routes:** `/dashboard/insights`
- **Widgets:** FinanceAgentFeed, InsightCard
- **Data:** AI-generated recommendations, anomaly detection

### 4. Settings Plugin
- **ID:** `converto.settings`
- **Routes:** `/dashboard/settings`
- **Widgets:** ProfileSettings, PreferencesForm, SecuritySettings
- **Data:** User preferences, account management

## Optional Enterprise Plugins

### Analytics & Reporting
- **ID:** `converto.analytics`
- Custom report builder
- Advanced filtering and aggregation
- Export to PDF/Excel

### Compliance & Legal
- **ID:** `converto.compliance`
- Legal document management
- Compliance checklist
- Audit trail viewer

### Multi-company Support
- **ID:** `converto.multicompany`
- Company switching
- Consolidated reporting
- Cross-company analytics

### Integration Hub
- **ID:** `converto.integrations`
- Banking API connections
- Accounting software sync
- Payment processor integration

## Phased Implementation

### Phase 1: Core Framework (Weeks 1-2)
- [ ] Build OSLayout with plugin support
- [ ] Implement PluginRegistry
- [ ] Create EventBus system
- [ ] Build PermissionManager
- [ ] Create base widget components
- [ ] Implement error boundaries

### Phase 2: Plugin Conversion (Weeks 3-4)
- [ ] Convert Receipt Management to plugin
- [ ] Convert KPIs to plugin
- [ ] Convert AI Insights to plugin
- [ ] Convert Settings to plugin
- [ ] Test plugin loading/unloading
- [ ] Document plugin development guide

### Phase 3: Marketplace (Weeks 5-6)
- [ ] Create plugin manifest schema
- [ ] Build plugin discovery API
- [ ] Implement plugin installation UI
- [ ] Create plugin marketplace backend
- [ ] Add plugin versioning support
- [ ] Implement dependency resolution

### Phase 4: Advanced UX (Weeks 7-8)
- [ ] Implement drag-drop layout editor
- [ ] Add widget settings UI
- [ ] Build layout templates
- [ ] Implement live plugin reload
- [ ] Add plugin marketplace UI
- [ ] Create plugin development tools

## Plugin Development Guide

### Creating a New Plugin

1. **Create plugin manifest:**
```json
{
  "id": "mycompany.myplugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "My custom dashboard plugin",
  "permissions": ["read:receipts", "write:reports"]
}
```

2. **Implement plugin interface:**
```typescript
import { DashboardPlugin } from '@converto/dashboard-core';

export const MyPlugin: DashboardPlugin = {
  id: 'mycompany.myplugin',
  name: 'My Plugin',
  version: '1.0.0',

  async onLoad() {
    console.log('Plugin loaded');
  },

  menuItems: [
    {
      id: 'myplugin-menu',
      label: 'My Plugin',
      path: '/dashboard/myplugin',
      section: 'Business'
    }
  ],

  routes: [
    {
      path: '/dashboard/myplugin',
      component: MyPluginPage,
      title: 'My Plugin'
    }
  ],

  widgets: [
    {
      id: 'myplugin-widget',
      component: MyWidget,
      title: 'My Widget',
      category: 'kpi',
      size: { w: 2, h: 1 }
    }
  ]
};
```

3. **Register plugin:**
```typescript
import { pluginRegistry } from '@converto/dashboard-core';
import { MyPlugin } from './plugin';

pluginRegistry.loadPlugin(MyPlugin);
```

## Benefits

✅ **Modularity:** Each feature is independent and can be developed separately
✅ **Scalability:** Add new features without modifying core code
✅ **Customization:** Users can enable/disable features as needed
✅ **Maintainability:** Clear contracts and isolation reduce bugs
✅ **Extensibility:** Third-party developers can create plugins
✅ **Performance:** Lazy loading and code splitting improve load times
✅ **Testability:** Plugins can be tested in isolation

## Security Considerations

- **Sandboxing:** Plugins run in isolated React components
- **Permissions:** Fine-grained RBAC prevents unauthorized access
- **Validation:** Plugin manifests are validated before loading
- **Error Handling:** Errors in plugins don't crash the dashboard
- **Code Review:** All plugins must pass security review before marketplace listing

## Future Enhancements

- Plugin marketplace with ratings and reviews
- Automated plugin updates
- Plugin dependency management
- Plugin performance monitoring
- Plugin analytics and usage tracking
- Plugin monetization support
- Plugin versioning and compatibility matrix
