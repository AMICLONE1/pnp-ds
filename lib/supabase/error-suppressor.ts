/**
 * Global error suppressor for Supabase placeholder connection errors
 * This prevents console spam when Supabase is not configured
 */

// Store original console methods
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

// Check if Supabase is using placeholder credentials
function isPlaceholderSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  return supabaseUrl.includes('placeholder') || 
         supabaseKey.includes('placeholder') ||
         supabaseUrl === 'your-project-url' ||
         supabaseKey === 'your-anon-key' ||
         supabaseUrl === 'https://placeholder.supabase.co';
}

// List of error patterns to suppress
const SUPPRESSED_PATTERNS = [
  'supabase',
  'ENOTFOUND',
  'getaddrinfo',
  'placeholder.supabase.co',
  'fetch failed',
  'FetchError',
  'TypeError: fetch failed'
];

// Check if message should be suppressed
function shouldSuppress(args: any[]): boolean {
  if (!isPlaceholderSupabase()) {
    return false; // Don't suppress if Supabase is properly configured
  }

  const message = args.map(arg => {
    if (typeof arg === 'string') return arg;
    if (arg instanceof Error) return arg.message + ' ' + arg.stack;
    if (typeof arg === 'object') return JSON.stringify(arg);
    return String(arg);
  }).join(' ').toLowerCase();

  return SUPPRESSED_PATTERNS.some(pattern => 
    message.includes(pattern.toLowerCase())
  );
}

// Override console methods
console.error = (...args: any[]) => {
  if (!shouldSuppress(args)) {
    originalError.apply(console, args);
  }
};

console.warn = (...args: any[]) => {
  if (!shouldSuppress(args)) {
    originalWarn.apply(console, args);
  }
};

console.log = (...args: any[]) => {
  if (!shouldSuppress(args)) {
    originalLog.apply(console, args);
  }
};

// Export for manual restoration if needed
export function restoreConsole() {
  console.error = originalError;
  console.warn = originalWarn;
  console.log = originalLog;
}

export function suppressSupabaseErrors() {
  // Already done globally above
}
