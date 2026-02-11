/**
 * Next.js Instrumentation
 * This file is loaded before any other code in the application
 * Perfect for global error suppression
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side error suppression
    const originalError = console.error;
    const originalWarn = console.warn;

    // Check if Supabase is using placeholder credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    const isPlaceholder = supabaseUrl.includes('placeholder') || 
                          supabaseKey.includes('placeholder') ||
                          supabaseUrl === 'your-project-url' ||
                          supabaseKey === 'your-anon-key' ||
                          supabaseUrl === 'https://placeholder.supabase.co';

    if (isPlaceholder) {
      // Patterns to suppress
      const suppressPatterns = [
        'supabase',
        'ENOTFOUND',
        'getaddrinfo',
        'placeholder.supabase.co',
        'fetch failed',
        'FetchError',
        'TypeError: fetch failed',
        'Projects fetch error',
        'Error with ACTIVE status',
        'Error with status filter'
      ];

      // Override console.error
      console.error = (...args: any[]) => {
        const message = args.map(arg => {
          if (typeof arg === 'string') return arg;
          if (arg instanceof Error) return arg.message + ' ' + arg.stack;
          if (typeof arg === 'object') return JSON.stringify(arg);
          return String(arg);
        }).join(' ').toLowerCase();

        const shouldSuppress = suppressPatterns.some(pattern => 
          message.includes(pattern.toLowerCase())
        );

        if (!shouldSuppress) {
          originalError.apply(console, args);
        }
      };

      // Override console.warn
      console.warn = (...args: any[]) => {
        const message = args.map(arg => {
          if (typeof arg === 'string') return arg;
          if (typeof arg === 'object') return JSON.stringify(arg);
          return String(arg);
        }).join(' ').toLowerCase();

        const shouldSuppress = suppressPatterns.some(pattern => 
          message.includes(pattern.toLowerCase())
        );

        if (!shouldSuppress) {
          originalWarn.apply(console, args);
        }
      };
    }
  }
}
