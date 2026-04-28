import { CardProps } from "./card.type";
import { variants } from "./card.constant";

export const Card = ({
  children,
  variant = "default",
  className = "",
  ...props
}: CardProps) => {
  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
