export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "#0B0F17",
        minHeight: "100dvh" // Use dynamic viewport height for mobile
      }}
    >
      {/* Mobile-first: full width, scrollable */}
      <div className="w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
