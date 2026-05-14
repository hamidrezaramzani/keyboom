"use client";

import { useState } from "react";
import { Badge, EmptyState } from "@/app/components/ui";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle,
  CircleX,
  Clock,
  MessageSquare,
  Tickets,
} from "lucide-react";
import { Ticket, useCloseTicketMutation } from "@/app/services/ticket";
import { useConfirm } from "@/app/lib/store/context";
import { TicketDetailModal } from "../ticket-details-modal/ticket-details-modal.component";
import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";

interface TicketListProps {
  tickets: Ticket[];
  isLoading: boolean;
  onRefresh: () => void;
}

const statusConfig = {
  open: { label: "باز", variant: "info" as const, icon: AlertCircle },
  in_progress: {
    label: "در حال بررسی",
    variant: "warning" as const,
    icon: Clock,
  },
  answered: {
    label: "پاسخ داده شده",
    variant: "primary" as const,
    icon: MessageSquare,
  },
  closed: { label: "بسته شده", variant: "success" as const, icon: CheckCircle },
};

const priorityConfig = {
  high: { label: "بالا", className: "bg-red-500/10 text-red-400" },
  medium: { label: "متوسط", className: "bg-yellow-500/10 text-yellow-400" },
  low: { label: "کم", className: "bg-green-500/10 text-green-400" },
};

const categoryConfig = {
  subscription: "اشتراک",
  workspace: "فضای کاری",
  general: "عمومی",
};

export const TicketList = ({
  tickets,
  isLoading,
  onRefresh,
}: TicketListProps) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [closeTicket] = useCloseTicketMutation();
  const { confirm } = useConfirm();

  const handleClose = async (ticketId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const confirmed = await confirm({
      title: "بستن تیکت",
      description: "آیا از بستن این تیکت مطمئن هستید؟",
      confirmText: "بستن",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await closeTicket({ params: { ticketId } }).unwrap();
      toast.success("تیکت با موفقیت بسته شد");
      onRefresh();
    } catch {
      toast.error("خطا در بستن تیکت");
    }
  };

  const handleRowClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailOpen(true);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">در حال بارگذاری...</div>
    );
  }

  if (tickets.length === 0) {
    return (
      <EmptyState
        icon={Tickets}
        title="یافت نشد"
        description="هیچ تیکتی یافت نشد"
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800">
            <tr className="text-right">
              <th className="pb-3 text-gray-400 font-medium">عنوان</th>
              <th className="pb-3 text-gray-400 font-medium">دسته‌بندی</th>
              <th className="pb-3 text-gray-400 font-medium">وضعیت</th>
              <th className="pb-3 text-gray-400 font-medium">اولویت</th>
              <th className="pb-3 text-gray-400 font-medium">تاریخ</th>
              <th className="pb-3 text-gray-400 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => {
              const status =
                statusConfig[
                  ticket.status as
                    | "open"
                    | "in_progress"
                    | "answered"
                    | "closed"
                ];
              const priority = priorityConfig[ticket.priority];
              const StatusIcon = status.icon;
              const isClosed = ticket.status === "closed";

              return (
                <tr
                  key={ticket.id}
                  className="border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-colors"
                  onClick={() => handleRowClick(ticket)}
                >
                  <td className="py-3 text-white">{ticket.title}</td>
                  <td className="py-3 text-gray-300">
                    {categoryConfig[ticket.category]}
                  </td>
                  <td className="py-3">
                    <Badge
                      variant={status.variant}
                      className="flex items-center gap-1 w-fit"
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${priority.className}`}
                    >
                      {priority.label}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">
                    {formatDistanceToNow(new Date(ticket.createdAt), {
                      addSuffix: true,
                      locale: faIR,
                    })}
                  </td>
                  <td className="py-3" onClick={(e) => e.stopPropagation()}>
                    {!isClosed && (
                      <button
                        onClick={(e) => handleClose(ticket.id, e)}
                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                      >
                        <CircleX />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedTicket && (
        <TicketDetailModal
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedTicket(null);
            onRefresh();
          }}
          ticketId={selectedTicket.id}
        />
      )}
    </>
  );
};
