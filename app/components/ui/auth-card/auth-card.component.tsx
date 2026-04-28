import { Card } from "../card";
import { AuthCardProps } from "./auth-card.type";

export const AuthCard = ({ children, title, subtitle }: AuthCardProps) => {
  return (
    <Card variant="default" className="w-1/2 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-gray-400 text-sm mt-2">{subtitle}</p>}
      </div>
      {children}
    </Card>
  );
};
