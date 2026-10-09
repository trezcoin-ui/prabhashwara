export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex justify-center"
      style={{
        background: "#0B0F17",
        minHeight: "100dvh" // Use dynamic viewport height for mobile
      }}
    >
      {/* Mobile-first: max-width container */}
      <div className="w-full min-h-screen max-w-[480px]">
        {children}
      </div>
    </div>
  );
}
