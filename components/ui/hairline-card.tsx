import { cn } from "@/lib/utils";

interface HairlineCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function HairlineCard({ children, className, ...props }: HairlineCardProps) {
  return (
    <div
      className={cn(
        "hairline rounded-[1.25rem] bg-surface p-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
