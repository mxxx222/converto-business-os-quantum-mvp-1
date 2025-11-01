# Dashboard Plugin System Integration Guide

**Status:** Ready for Integration | **Compatibility:** Non-Breaking | **Migration Path:** Gradual

---

## 📋 Overview

This guide explains how to integrate the new modular dashboard plugin system (`/dashboard-core`) with the existing Converto Business OS frontend without removing or breaking any existing code.

The integration uses a **feature flag approach** allowing both systems to coexist during the transition period.

---

## 🔄 Integration Architecture

### Current State
- Existing dashboard in `/frontend/app/dashboard/`
- Monolithic component structure
- Tightly coupled features

### New State
- Plugin system in `/dashboard-core/`
- Modular, extensible architecture
- Gradual migration path

### Coexistence Strategy

```
/frontend
├── /app
│   ├── /dashboard          ← Existing (kept as-is)
│   │   ├── page.tsx
│   │   ├── layout.js
│   │   └── ...
│   └── /dashboard-plugin   ← New (feature-flagged)
│       └── page.tsx        ← Routes to plugin system
└── ...

/dashboard-core            ← New plugin framework
├── /src
│   ├── /core
│   ├── /components
│   ├── /plugins
│   └── App.tsx
└── ...
```

---

## 🚀 Step-by-Step Integration

### Phase 1: Setup (Week 1)

#### 1.1 Install Dashboard Core Dependencies

```bash
cd dashboard-core
npm install
```

#### 1.2 Create Feature Flag

Add to `/frontend/.env.local`:

```env
NEXT_PUBLIC_USE_PLUGIN_DASHBOARD=false
```

#### 1.3 Create Plugin Dashboard Route

Create `/frontend/app/dashboard-plugin/page.tsx`:

```typescript
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const PluginDashboard = dynamic(
  () => import('@/components/dashboard/PluginDashboardWrapper'),
  { ssr: false }
);

export default function DashboardPluginPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return <PluginDashboard />;
}
```

#### 1.4 Create Wrapper Component

Create `/frontend/components/dashboard/PluginDashboardWrapper.tsx`:

```typescript
'use client';

import React, { useEffect, useState } from 'react';

export default function PluginDashboardWrapper() {
  const [DashboardApp, setDashboardApp] = useState<any>(null);

  useEffect(() => {
    // Dynamically import the dashboard-core App
    import('../../dashboard-core/src/App').then((module) => {
      setDashboardApp(() => module.App);
    });
  }, []);

  if (!DashboardApp) {
    return <div className="flex items-center justify-center h-screen">Loading dashboard...</div>;
  }

  return <DashboardApp />;
}
```

### Phase 2: Feature Flag Implementation (Week 1-2)

#### 2.1 Create Dashboard Router Component

Create `/frontend/components/dashboard/DashboardRouter.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import LegacyDashboard from './LegacyDashboard';
import PluginDashboardWrapper from './PluginDashboardWrapper';

export default function DashboardRouter() {
  const [usePlugins, setUsePlugins] = useState(false);

  useEffect(() => {
    // Check feature flag
    const flag = process.env.NEXT_PUBLIC_USE_PLUGIN_DASHBOARD === 'true';
    setUsePlugins(flag);
  }, []);

  if (usePlugins) {
    return <PluginDashboardWrapper />;
  }

  return <LegacyDashboard />;
}
```

#### 2.2 Update Existing Dashboard Route

Modify `/frontend/app/dashboard/page.tsx`:

```typescript
'use client';

import DashboardRouter from '@/components/dashboard/DashboardRouter';

export default function DashboardPage() {
  return <DashboardRouter />;
}
```

### Phase 3: Plugin Migration (Week 2-3)

#### 3.1 Migrate Receipts Feature

Convert existing receipts component to plugin:

Create `/dashboard-core/src/plugins/receipts/ReceiptList.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { useDataStore } from '../../core/dataStore';

export const ReceiptList: React.FC = () => {
  const [receipts, setReceipts] = useState<any[]>([]);
  const store = useDataStore();

  useEffect(() => {
    // Fetch from API or use existing data
    const cachedReceipts = store.get('receipts');
    if (cachedReceipts) {
      setReceipts(cachedReceipts);
    }
  }, [store]);

  return (
    <div className="space-y-3">
      {receipts.map((receipt) => (
        <div key={receipt.id} className="p-3 bg-gray-50 rounded-lg">
          <p className="font-medium">{receipt.name}</p>
          <p className="text-sm text-gray-600">${receipt.amount}</p>
        </div>
      ))}
    </div>
  );
};
```

#### 3.2 Migrate Finance KPIs

Create `/dashboard-core/src/plugins/financeKPIs/index.ts`:

```typescript
import { DashboardPlugin } from '../../core/types';
import { KPIWidgets } from './KPIWidgets';

const FinanceKPIsPlugin: DashboardPlugin = {
  id: 'financeKPIs',
  name: 'Finance KPIs',
  version: '1.0.0',
  description: 'Financial metrics and analytics',

  widgets: [
    {
      id: 'revenue-kpi',
      title: 'Revenue',
      component: KPIWidgets,
      size: { w: 2, h: 2 },
      category: 'kpi',
    },
  ],

  async onLoad() {
    console.log('Finance KPIs plugin loaded');
  },
};

export default FinanceKPIsPlugin;
```

#### 3.3 Update Plugin Manifest

Update `/dashboard-core/src/manifest/plugins.json`:

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

### Phase 4: Testing & Rollout (Week 3-4)

#### 4.1 Enable Feature Flag for Testing

Update `/frontend/.env.local`:

```env
NEXT_PUBLIC_USE_PLUGIN_DASHBOARD=true
```

#### 4.2 Test Plugin System

```bash
# Test existing dashboard
NEXT_PUBLIC_USE_PLUGIN_DASHBOARD=false npm run dev

# Test plugin dashboard
NEXT_PUBLIC_USE_PLUGIN_DASHBOARD=true npm run dev
```

#### 4.3 Gradual Rollout

1. **Internal Testing** - Enable for development team
2. **Beta Users** - Enable for select users via user preference
3. **Full Rollout** - Enable for all users
4. **Legacy Cleanup** - Remove old dashboard code after stabilization

---

## 🔌 Plugin Development During Integration

### Creating a New Plugin

1. Create plugin directory:
```bash
mkdir -p dashboard-core/src/plugins/my-feature
```

2. Create plugin manifest:
```typescript
// dashboard-core/src/plugins/my-feature/index.ts
import { DashboardPlugin } from '../../core/types';
import { MyComponent } from './MyComponent';

const MyPlugin: DashboardPlugin = {
  id: 'my-feature',
  name: 'My Feature',
  version: '1.0.0',
  widgets: [
    {
      id: 'my-widget',
      title: 'My Widget',
      component: MyComponent,
      size: { w: 2, h: 2 },
    },
  ],
};

export default MyPlugin;
```

3. Register in manifest:
```json
{
  "id": "my-feature",
  "name": "My Feature",
  "entry": "../plugins/my-feature/index.ts"
}
```

### Accessing Existing Data

Use the data store to access existing application state:

```typescript
import { useDataStore } from '../../core/dataStore';
import { eventBus } from '../../core/eventBus';

export const MyComponent = () => {
  const store = useDataStore();

  // Get data
  const data = store.get('my-data-key');

  // Set data
  store.set('my-data-key', newData);

  // Listen to events
  useEffect(() => {
    const unsubscribe = eventBus.subscribe('data-updated', (payload) => {
      console.log('Data updated:', payload);
    });

    return unsubscribe;
  }, []);

  return <div>{/* Your component */}</div>;
};
```

---

## 🔗 API Integration

### Connecting to Existing Backend

Create `/dashboard-core/src/utils/apiClient.ts`:

```typescript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export async function fetchReceipts() {
  const response = await fetch(`${API_BASE}/api/receipts`);
  return response.json();
}

export async function uploadReceipt(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/api/receipts/upload`, {
    method: 'POST',
    body: formData,
  });

  return response.json();
}

export async function getFinanceKPIs() {
  const response = await fetch(`${API_BASE}/api/finance/kpis`);
  return response.json();
}
```

Use in plugins:

```typescript
import { fetchReceipts } from '../../utils/apiClient';

export const ReceiptList = () => {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    fetchReceipts().then(setReceipts);
  }, []);

  return (
    <div>
      {receipts.map((r) => (
        <div key={r.id}>{r.name}</div>
      ))}
    </div>
  );
};
```

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
// dashboard-core/src/core/__tests__/pluginRegistry.test.ts
import { registerPlugin, getPlugins } from '../pluginRegistry';

describe('Plugin Registry', () => {
  it('should register a plugin', () => {
    const plugin = {
      id: 'test',
      name: 'Test',
      version: '1.0.0',
    };

    registerPlugin(plugin);
    expect(getPlugins()).toContainEqual(plugin);
  });
});
```

### Integration Tests

```typescript
// Test plugin loading and activation
import { loadPlugins, activatePlugin } from '../pluginRegistry';

describe('Plugin Loading', () => {
  it('should load plugins from manifest', async () => {
    await loadPlugins('/manifest/plugins.json');
    await activatePlugin('receipts');
    // Assert plugin is active
  });
});
```

### E2E Tests

```typescript
// Test full dashboard flow
describe('Dashboard Plugin System', () => {
  it('should render dashboard with plugins', () => {
    cy.visit('/dashboard-plugin');
    cy.contains('Recent Receipts').should('be.visible');
    cy.contains('Upload Receipt').should('be.visible');
  });
});
```

---

## 📊 Migration Checklist

- [ ] Setup `/dashboard-core` directory structure
- [ ] Install dependencies in `dashboard-core`
- [ ] Create feature flag in `.env.local`
- [ ] Create plugin dashboard route
- [ ] Create wrapper component
- [ ] Implement feature flag router
- [ ] Migrate receipts plugin
- [ ] Migrate finance KPIs plugin
- [ ] Migrate AI insights plugin
- [ ] Migrate settings plugin
- [ ] Test with feature flag disabled
- [ ] Test with feature flag enabled
- [ ] Run unit tests
- [ ] Run integration tests
- [ ] Run E2E tests
- [ ] Internal team testing
- [ ] Beta user rollout
- [ ] Full production rollout
- [ ] Monitor performance metrics
- [ ] Gather user feedback
- [ ] Plan legacy code cleanup

---

## 🚨 Rollback Plan

If issues arise during rollout:

1. **Disable Feature Flag**
   ```env
   NEXT_PUBLIC_USE_PLUGIN_DASHBOARD=false
   ```

2. **Revert to Legacy Dashboard**
   - Users automatically routed to existing dashboard
   - No data loss
   - No downtime

3. **Investigate Issues**
   - Check browser console for errors
   - Review server logs
   - Check plugin manifest

4. **Fix and Redeploy**
   - Fix issues in plugin code
   - Rebuild dashboard-core
   - Re-enable feature flag

---

## 📈 Performance Monitoring

### Key Metrics

- **Initial Load Time** - Target: < 2s
- **Plugin Load Time** - Target: < 500ms
- **Widget Render Time** - Target: < 100ms
- **Memory Usage** - Target: < 50MB

### Monitoring Setup

```typescript
// dashboard-core/src/utils/performance.ts
export function measurePluginLoad(pluginId: string) {
  const start = performance.now();

  return () => {
    const duration = performance.now() - start;
    console.log(`Plugin ${pluginId} loaded in ${duration}ms`);

    // Send to analytics
    if (window.gtag) {
      window.gtag('event', 'plugin_load', {
        plugin_id: pluginId,
        duration: duration,
      });
    }
  };
}
```

---

## 🔐 Security Considerations

### Plugin Sandboxing

- Plugins run in React error boundaries
- Failed plugins don't crash dashboard
- Permissions system controls access

### Data Protection

- Use HTTPS for all API calls
- Validate plugin manifests
- Sanitize user inputs
- Implement CSRF protection

### Access Control

```typescript
import { permissionManager } from '../../core/permissionManager';

export const ReceiptList = () => {
  if (!permissionManager.canRead('receipts')) {
    return <div>Access Denied</div>;
  }

  return <div>{/* Receipt list */}</div>;
};
```

---

## 📚 Additional Resources

- [Dashboard MVP Build Plan](./DASHBOARD_MVP_BUILD_PLAN.md)
- [Dashboard Implementation Guide](./DASHBOARD_IMPLEMENTATION_GUIDE.md)
- [Plugin Architecture](./DASHBOARD_PLUGIN_ARCHITECTURE.md)

---

## 🆘 Troubleshooting

### Plugin Not Loading

1. Check manifest path
2. Verify plugin entry file exists
3. Check browser console for errors
4. Verify plugin ID matches manifest

### Widget Not Rendering

1. Check component export
2. Verify widget config
3. Check for TypeScript errors
4. Review error boundary logs

### Data Not Persisting

1. Check data store implementation
2. Verify API endpoints
3. Check browser storage
4. Review network requests

---

**Status:** Ready for Integration | **Last Updated:** 2025-11-01
