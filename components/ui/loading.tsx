export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-b-2 border-gray-200 ${sizes[size]}`} />
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-200 mb-4"></div>
        <p className="text-black">Loading...</p>
      </div>
    </div>
  );
}

