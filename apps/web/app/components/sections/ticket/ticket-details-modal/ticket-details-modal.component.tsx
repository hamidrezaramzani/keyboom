"use client";

import { useState, useRef, useEffect } from "react";
import { Modal, Input, Button, Badge } from "@/app/components/ui";
import {
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
} from "lucide-react";
import {
  useAddTicketMessageMutation,
  useGetTicketQuery,
} from "@/app/services/ticket";
import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";
import { toast } from "@/app/lib";

interface TicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
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

export const TicketDetailModal = ({
  isOpen,
  onClose,
  ticketId,
}: TicketDetailModalProps) => {
  const { data, isLoading, refetch } = useGetTicketQuery({
    params: { ticketId },
  });
  const [addMessage, { isLoading: isSending }] = useAddTicketMessageMutation();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ticket = data?.ticket;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const messages = data?.messages || [];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await addMessage({
        params: { ticketId },
        payload: { message: newMessage },
      }).unwrap();
      toast.success("پیام با موفقیت ارسال شد");
      setNewMessage("");
      refetch();
    } catch {
      toast.error("خطا در ارسال پیام");
    }
  };

  if (isLoading || !ticket) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="جزئیات تیکت" size="lg">
        <div className="text-center py-8 text-gray-500">در حال بارگذاری...</div>
      </Modal>
    );
  }

  const status =
    statusConfig[
      (ticket.status as "open", "in_progress", "answered", "closed")
    ];
  const StatusIcon = status.icon;
  const priority = priorityConfig[ticket.priority];
  const isClosed = ticket.status === "closed";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={ticket.title} size="lg">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 pb-4 border-b border-gray-800">
          <Badge variant={status.variant} className="flex items-center gap-1">
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </Badge>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${priority.className}`}
          >
            اولویت: {priority.label}
          </span>
          <span className="text-xs text-gray-500">
            دسته‌بندی: {categoryConfig[ticket.category]}
          </span>
          <span className="text-xs text-gray-500">
            ایجاد:{" "}
            {formatDistanceToNow(new Date(ticket.createdAt), {
              addSuffix: true,
              locale: faIR,
            })}
          </span>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.map((msg) => {
            const isAdmin = msg.senderIsAdmin;
            const isCurrentUser = !isAdmin;

            return (
              <div
                key={msg.id}
                className={`flex ${isCurrentUser ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isCurrentUser
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-gray-800 text-gray-200 rounded-bl-none"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span className="text-xs opacity-75">
                      {isCurrentUser ? "شما" : "پشتیبانی"}
                    </span>
                    <span className="text-xs opacity-50">
                      {formatDistanceToNow(new Date(msg.createdAt), {
                        addSuffix: true,
                        locale: faIR,
                      })}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {!isClosed && (
          <div className="flex gap-2 pt-4 border-t border-gray-800">
            <Input
              placeholder="پیام خود را بنویسید..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              loading={isSending}
              icon={<Send className="w-4 h-4" />}
            >
              ارسال
            </Button>
          </div>
        )}

        {isClosed && (
          <div className="text-center py-2 text-gray-500 text-sm">
            این تیکت بسته شده است
          </div>
        )}
      </div>
    </Modal>
  );
};
