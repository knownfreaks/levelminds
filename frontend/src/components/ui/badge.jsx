import { cn } from "@/lib/utils";
const Badge = ({ children, className }) => (
  <span
    className={cn(
      "inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800",
      className
    )}
  >
    {children}
  </span>
);

export default Badge;
