"use client";

import {
  Clock,
  RefreshCw,
  Pencil,
  PlusCircle,
  XCircle,
  Activity,
} from "lucide-react";
import { Badge } from "@/app/components";
import moment from "jalali-moment";

interface SubscriptionHeaderProps {
  name: string;
  status: string;
  groupName: string;
  startDate: string;
  endDate: string;
  countdown: number;
}

export function SubscriptionReportHeader({
  name,
  status,
  groupName,
  startDate,
  endDate,
  countdown,
}: SubscriptionHeaderProps) {
  return (
    <div className="rounded-2xl border border-gray-800 p-6 bg-gray-900/50">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="text-primary-400" size={22} />
            {name}
          </h1>
          <div className="text-gray-400 mt-2 flex gap-5 flex-wrap">
            <span>
              وضعیت: <Badge variant="success">{status}</Badge>
            </span>
            <span>
              گروه: <Badge>{groupName}</Badge>
            </span>
            <span>
              تاریخ شروع:{" "}
              <Badge>{moment(startDate).format("jYYYY/jMM/jDD")}</Badge>
            </span>
            <span>
              تاریخ پایان:{" "}
              <Badge>{moment(endDate).format("jYYYY/jMM/jDD")}</Badge>
            </span>
          </div>

          <p className="text-gray-500 text-sm mt-3 flex items-center gap-2">
            <Clock size={14} />
            {countdown} روز تا تمدید بعدی
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button className="btn-primary btn-md flex items-center gap-2">
            <RefreshCw size={16} />
            تمدید
          </button>
          <button className="btn-secondary btn-md flex items-center gap-2">
            <Pencil size={16} />
            ویرایش
          </button>
          <button className="btn-outline btn-md flex items-center gap-2">
            <PlusCircle size={16} />
            بازه قیمتی
          </button>
          <button className="btn-danger btn-md flex items-center gap-2">
            <XCircle size={16} />
            لغو
          </button>
        </div>
      </div>
    </div>
  );
}
