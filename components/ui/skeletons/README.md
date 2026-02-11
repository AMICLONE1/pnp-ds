# Skeleton Loading Components

This directory contains skeleton loading components for different pages and sections of the application.

## Components

### 1. DashboardSkeleton
Used on the dashboard page while loading user data, stats, and charts.

**Usage:**
```tsx
import { DashboardSkeleton } from '@/components/ui/skeletons/DashboardSkeleton';

if (loading) {
  return <DashboardSkeleton />;
}
```

### 2. ProjectListSkeleton
Used on the reserve/projects page while loading available solar projects.

**Usage:**
```tsx
import { ProjectListSkeleton } from '@/components/ui/skeletons/ProjectListSkeleton';

if (loading) {
  return <ProjectListSkeleton />;
}
```

### 3. BillsSkeleton
Used on the bills page while loading electricity bills data.

**Usage:**
```tsx
import { BillsSkeleton } from '@/components/ui/skeletons/BillsSkeleton';

if (loading) {
  return <BillsSkeleton />;
}
```

### 4. SettingsSkeleton
Used on the settings page while loading user profile and preferences.

**Usage:**
```tsx
import { SettingsSkeleton } from '@/components/ui/skeletons/SettingsSkeleton';

if (loading) {
  return <SettingsSkeleton />;
}
```

## Base Skeleton Component

All skeleton components use the base `Skeleton` component from `@/components/ui/skeleton`:

```tsx
import { Skeleton } from "@/components/ui/skeleton";

<Skeleton className="h-4 w-32" />
```

## Global Page Loader

For route transitions and initial page load, use the `PageLoader` component:

```tsx
import { PageLoader } from '@/components/layout/PageLoader';

<PageLoader />
```

This is automatically handled by the `LoadingProvider` in the root layout.

## Creating New Skeleton Components

When creating a new skeleton component:

1. Match the layout structure of the actual page
2. Use appropriate sizes for text, images, and cards
3. Add the `animate-pulse` class for animation
4. Use consistent spacing and padding
5. Export from `index.ts` for easy imports

Example:
```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function MyPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
}
```
