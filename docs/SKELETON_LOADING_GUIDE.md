# Skeleton Loading System - User Guide

## What You'll See

### 1. Initial Page Load (First Visit)
When you first visit the website or refresh any page, you'll see:
- **PowerNetPro animated logo** with rotating sun icon
- **Gold glow effect** pulsing around the logo
- **"Loading..." text** below the logo
- **Duration**: ~1 second
- **Purpose**: Branded loading experience while app initializes

### 2. Page Navigation (Route Changes)
When clicking links to navigate between pages:
- **Same branded loader** appears briefly
- **Duration**: ~500ms
- **Purpose**: Smooth transition between pages, prevents blank screens

### 3. Page-Specific Content Loading

#### Dashboard Page (`/dashboard`)
While loading your dashboard data, you'll see:
- **Header skeleton**: Title and description placeholders
- **4 stat cards**: Animated gray boxes for capacity, savings, CO2, and credits
- **2 chart sections**: Large rectangular placeholders for graphs
- **Activity list**: 5 rows with circular avatars and text lines
- **Everything pulses** with a subtle animation

#### Projects Page (`/reserve`)
While loading available solar projects:
- **Page header**: Title and subtitle placeholders
- **Filter buttons**: 3 button-shaped skeletons
- **6 project cards** in a grid:
  - Image placeholder at top
  - Title and location lines
  - Description text (2 lines)
  - Stats section (2 columns)
  - Action button at bottom
- **Responsive**: Adjusts to mobile, tablet, and desktop

#### Bills Page (`/bills`)
While loading your electricity bills:
- **Page header**: Title and description
- **3 summary cards**: Total bills, pending, paid amounts
- **Bills list**: 5 bill entries with:
  - Bill number and date
  - Amount and status
  - 4 detail columns (usage, credits, etc.)
- **Clean layout** matching actual bills structure

#### Settings Page (`/settings`)
While loading your profile and settings:
- **Page header**: Title and description
- **3 settings sections**:
  - Profile Information
  - Notification Preferences
  - Security Settings
- **Each section has**:
  - Section title
  - 3 form fields
  - Save and Cancel buttons
- **Centered layout** for better focus

## Why Skeleton Loading?

### Better Than Spinners
❌ **Old Way**: Blank screen or spinning circle
✅ **New Way**: Structured placeholder matching actual content

### Benefits
1. **Feels Faster**: Immediate visual feedback
2. **No Surprises**: You know what's coming
3. **Professional**: Modern, polished experience
4. **No Layout Shift**: Content appears in same position as skeleton
5. **Reduced Anxiety**: Clear indication that something is happening

## Technical Details

### Loading States
- **Global Loading**: Managed by `LoadingProvider`
- **Page Loading**: Each page manages its own data loading
- **Automatic**: No manual intervention needed

### Performance
- **Lightweight**: Minimal impact on performance
- **Optimized**: Uses CSS animations (GPU accelerated)
- **Fast**: Skeletons render instantly

### Accessibility
- **Screen Readers**: Announces "Loading..." state
- **Keyboard Navigation**: Maintains focus management
- **Reduced Motion**: Respects user preferences

## For Developers

### Adding Skeleton to New Page

1. **Import the skeleton**:
```tsx
import { DashboardSkeleton } from '@/components/ui/skeletons';
```

2. **Add loading state**:
```tsx
const [loading, setLoading] = useState(true);
```

3. **Show skeleton while loading**:
```tsx
if (loading) {
  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Header />
      <main className="flex-1 pt-20">
        <DashboardSkeleton />
      </main>
    </div>
  );
}
```

4. **Set loading to false** when data is ready:
```tsx
useEffect(() => {
  fetchData().then(() => setLoading(false));
}, []);
```

### Creating Custom Skeleton

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function MyCustomSkeleton() {
  return (
    <div className="space-y-4">
      {/* Title */}
      <Skeleton className="h-8 w-64" />
      
      {/* Paragraph */}
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      
      {/* Grid of cards */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
}
```

## Customization Options

### Change Loading Duration
Edit `components/providers/LoadingProvider.tsx`:
```tsx
// Line 23: Initial load duration
setTimeout(() => setIsLoading(false), 1000); // Change 1000 to desired ms

// Line 31: Route transition duration
setTimeout(() => setIsNavigating(false), 500); // Change 500 to desired ms
```

### Change Skeleton Color
Edit `components/ui/skeleton.tsx`:
```tsx
// Change bg-gray-200 to any color
className="animate-pulse rounded-md bg-gray-200"
```

### Disable Route Transition Loader
Edit `components/providers/LoadingProvider.tsx`:
```tsx
// Comment out or remove this line:
{(isLoading || isNavigating) && <PageLoader />}

// Replace with:
{isLoading && <PageLoader />}
```

## Browser Support
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations
- Skeletons are static (don't show real-time progress)
- Loading duration is fixed (not based on actual data size)
- Some very fast loads might show skeleton briefly

## Future Enhancements
- [ ] Progressive loading (show partial data)
- [ ] Shimmer effect instead of pulse
- [ ] Smart duration based on connection speed
- [ ] Skeleton for individual components
- [ ] Loading progress indicator

## Support
For issues or questions about skeleton loading:
1. Check `SKELETON_LOADING_IMPLEMENTATION.md` for technical details
2. Review `components/ui/skeletons/README.md` for component docs
3. Check browser console for any errors
4. Verify all skeleton files are present

## Summary
The skeleton loading system provides a professional, modern loading experience across the entire website. Users see structured placeholders instead of blank screens, making the app feel faster and more responsive. All major pages (Dashboard, Projects, Bills, Settings) have custom skeletons that match their actual layouts perfectly.
