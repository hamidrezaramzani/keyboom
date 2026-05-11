"use client";
import Timeline, {
  TimelineHeaders,
  DateHeader,
  TodayMarker,
} from "react-calendar-timeline";
import "react-calendar-timeline/style.css";
import { DashboardLayout } from "@/app/components";
import dayjs from "dayjs";
import "./timeline.css";
import { useState } from "react";
import jalaliMoment from "jalali-moment";

const TimelinePage = () => {
  const groups = [
    { id: "price", title: "قیمت ماهانه (تومان)" },
    { id: "exception", title: "بازه های استثنا" },
    { id: "activity", title: "فعالیت ها" },
  ];

  const startDate = dayjs("2025-05-01").valueOf();
  const endDate = dayjs("2025-05-31").valueOf();

  const [visibleTimeStart, setVisibleTimeStart] = useState(startDate);
  const [visibleTimeEnd, setVisibleTimeEnd] = useState(endDate);

  const items = [
    {
      id: 1,
      group: "price",
      title: "قیمت اصلی - ۵۰ هزار تومان روزانه",
      start_time: startDate,
      end_time: endDate,
      itemProps: {
        style: {
          background: "#3b82f6",
          border: "none",
          color: "white",
          borderRadius: "4px",
        },
      },
    },
    {
      id: 2,
      group: "exception",
      title: "تخفیف ویژه: ۲۰ تومان",
      start_time: dayjs("2025-05-02").valueOf(),
      end_time: dayjs("2025-05-08").valueOf(),
      itemProps: {
        style: {
          background: "#10b981",
          border: "none",
          color: "white",
          borderRadius: "4px",
        },
      },
    },
    {
      id: 3,
      group: "exception",
      title: "تورم: ۸۰ هزار تومن",
      start_time: dayjs("2025-05-14").valueOf(),
      end_time: dayjs("2025-05-18").valueOf(),
      itemProps: {
        style: {
          background: "#10b981",
          border: "none",
          color: "white",
          borderRadius: "4px",
        },
      },
    },

    {
      id: 4,
      group: "activity",
      title: "ویرایش",
      start_time: dayjs("2025-05-12").valueOf(),
      end_time: dayjs("2025-05-13").valueOf(),
      itemProps: {
        style: {
          background: "#f7a428",
          border: "none",
          color: "white",
          borderRadius: "4px",
        },
      },
    },

    {
      id: 5,
      group: "activity",
      title: "تمدید",
      start_time: dayjs("2025-05-18").valueOf(),
      end_time: dayjs("2025-05-19").valueOf(),
      itemProps: {
        style: {
          background: "#3b82f6",
          border: "none",
          color: "white",
          borderRadius: "4px",
        },
      },
    },
  ];

  const handleTimeChange = (
    newVisibleTimeStart: number,
    newVisibleTimeEnd: number,
  ) => {
    if (newVisibleTimeStart < startDate) {
      setVisibleTimeStart(startDate);
      return;
    }
    if (newVisibleTimeEnd > endDate) {
      setVisibleTimeEnd(endDate);
      return;
    }
    setVisibleTimeStart(newVisibleTimeStart);
    setVisibleTimeEnd(newVisibleTimeEnd);
  };

  return (
    <DashboardLayout>
      <div className="mb-6 mt-4 w-full">
        <h1 className="text-2xl font-bold text-white">تایم لاین</h1>
        <p className="text-gray-400 text-sm mt-1">
          اینجا میتوانید فعالیت ها و بازه های مختلف اشتراک خود را مشاهده کنید.
        </p>
      </div>
      <div className="timeline-wrapper">
        <div
          className="timeline-container"
          style={{ width: "100%", direction: "ltr" }}
        >
          <Timeline
            groups={groups}
            items={items}
            visibleTimeStart={visibleTimeStart}
            visibleTimeEnd={visibleTimeEnd}
            onTimeChange={handleTimeChange}
            canMove={false}
            canResize={true}
            canChangeGroup={false}
            lineHeight={50}
            sidebarWidth={220}
            minZoom={1000 * 60 * 60 * 24 * 31}
            maxZoom={1000 * 60 * 60 * 24 * 31}
          >
            <TimelineHeaders>
              <DateHeader
                unit="month"
                labelFormat={([startTime]: [dayjs.Dayjs, dayjs.Dayjs]) => {
                  const jMonth = jalaliMoment(startTime.valueOf()).format(
                    "jMMMM",
                  );
                  return jMonth === "Ordibehesht" ? "اردیبهشت" : jMonth;
                }}
                style={{
                  height: 40,
                  background: "#1f2937",
                  color: "#fff",
                  borderBottom: "1px solid #374151",
                }}
              />
              <DateHeader
                unit="day"
                labelFormat="D"
                style={{
                  height: 30,
                  background: "#111827",
                  color: "#9ca3af",
                  borderBottom: "1px solid #374151",
                }}
              />
            </TimelineHeaders>

            <TodayMarker />
          </Timeline>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TimelinePage;
