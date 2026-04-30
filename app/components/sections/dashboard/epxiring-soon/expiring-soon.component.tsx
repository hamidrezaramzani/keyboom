"use client";

import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, Button } from "@/app/components";

interface ExpiringSubscription {
  id: string;
  name: string;
  daysLeft: number;
}

interface ExpiringSoonProps {
  subscriptions: ExpiringSubscription[];
  onRenew?: (id: string) => void;
}

export const ExpiringSoon = ({ subscriptions, onRenew }: ExpiringSoonProps) => {
  if (subscriptions.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <p className="text-gray-400">هیچ اشتراک در شرف اتمام نیست</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full border-amber-500/30 bg-amber-500/5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        <h3 className="text-white font-semibold">نیاز به اقدام فوری</h3>
      </div>

      <div className="space-y-3">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="flex items-center justify-between p-3 bg-amber-500/10 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-white font-medium">{sub.name}</p>
                <p className="text-amber-400 text-xs">
                  {sub.daysLeft} روز دیگر تموم میشه
                </p>
              </div>
            </div>
            <Button size="sm" onClick={() => onRenew?.(sub.id)}>
              تمدید
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};
