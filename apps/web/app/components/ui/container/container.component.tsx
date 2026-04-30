import { ContainerProps } from "./container.type";

export default function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <div className={`container mx-auto max-w-6xl px-4 ${className}`}>
      {children}
    </div>
  );
}
