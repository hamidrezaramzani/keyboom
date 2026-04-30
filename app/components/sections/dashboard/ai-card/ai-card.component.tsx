// app/components/sections/dashboard/AICard.tsx
"use client";

import { Sparkles } from "lucide-react";
import { Card } from "@/app/components/ui";

interface AICardProps {
  message: string;
  userName: string;
}

export const AICard = ({ message, userName }: AICardProps) => {
  const personalizedMessage = message.replace("{name}", userName);

  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-indigo-500/20 rounded-full shrink-0">
          <Sparkles className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-indigo-400 text-sm font-medium mb-1">
            🤖 گزارش هوشمند کی‌بوم
          </h3>
          <p className="text-white text-sm leading-relaxed">
            {personalizedMessage}
          </p>
        </div>
      </div>
    </Card>
  );
};
