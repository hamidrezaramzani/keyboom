/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { DashboardLayout } from "@/app/components/layout";
import { Button, Input, Select } from "@/app/components/ui";
import { Filter, Plus, Search } from "lucide-react";
import { useGetTicketsQuery } from "../../services/ticket";
import { CreateTicketModal, TicketList } from "../../components";

interface TicketListFilters {
  status?: "open" | "in_progress" | "answered" | "closed";
  priority?: "low" | "medium" | "high";
  category?: "subscription" | "workspace" | "general";
  search?: string;
}

export default function TicketsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState<TicketListFilters>({
    status: undefined,
    priority: undefined,
    category: undefined,
    search: "",
  });

  const { data, isLoading, refetch } = useGetTicketsQuery({
    query: filters,
  });

  const tickets = data || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">تیکت‌های پشتیبانی</h1>
            <p className="text-gray-400 text-sm mt-1">
              سوالات و مشکلات خود را با ما در میان بگذارید
            </p>
          </div>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            تیکت جدید
          </Button>
        </div>

        <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">فیلترها</span>
              {(filters.status ||
                filters.priority ||
                filters.category ||
                filters.search) && (
                <button
                  onClick={() => {
                    setFilters({
                      status: undefined,
                      priority: undefined,
                      category: undefined,
                      search: undefined,
                    });
                  }}
                  className="mr-auto text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  پاک کردن همه
                </button>
              )}
            </div>
          </div>

          <div className="p-4">
            <div className="flex gap-3">
              <div className="relative md:col-span-2">
                <Input
                  label="جستجو"
                  placeholder="جستجو در تیکت‌ها..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
              <div className="w-full flex gap-8">
                <div className="flex items-center gap-2">
                  <Select
                    label="وضعیت"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value as any })
                    }
                    options={[
                      { value: "", label: "همه وضعیت‌ها" },
                      { value: "open", label: "🟢 باز" },
                      { value: "in_progress", label: "🟡 در حال بررسی" },
                      { value: "answered", label: "🔵 پاسخ داده شده" },
                      { value: "closed", label: "⚪ بسته شده" },
                    ]}
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    label="اولویت"
                    value={filters.priority}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        priority: e.target.value as any,
                      })
                    }
                    options={[
                      { value: "", label: "همه اولویت‌ها" },
                      { value: "high", label: "🔴 بالا" },
                      { value: "medium", label: "🟡 متوسط" },
                      { value: "low", label: "🟢 کم" },
                    ]}
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    label="دسته"
                    value={filters.category}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        category: e.target.value as any,
                      })
                    }
                    options={[
                      { value: "", label: "همه دسته‌ها" },
                      { value: "subscription", label: "📦 اشتراک" },
                      { value: "workspace", label: "🏢 فضای کاری" },
                      { value: "general", label: "📝 عمومی" },
                    ]}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <TicketList
          tickets={tickets}
          isLoading={isLoading}
          onRefresh={refetch}
        />
      </div>

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refetch}
      />
    </DashboardLayout>
  );
}
