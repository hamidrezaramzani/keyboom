"use client";

import Timeline, { TimelineHeaders, DateHeader } from "react-calendar-timeline";
import "react-calendar-timeline/style.css";
import "./timeline.css";
import { useState } from "react";
import jalaliMoment from "jalali-moment";
import dayjs from "dayjs";

interface TimelineGroup {
  id: string;
  title: string;
}

interface TimelineItem {
  id: number;
  group: string;
  title: string;
  start_time: number;
  end_time: number;
  itemProps: {
    style: {
      background: string;
      border: string;
      color: string;
      borderRadius: string;
    };
  };
}

interface TimelineViewProps {
  groups: TimelineGroup[];
  items: TimelineItem[];
}

export const TimelineView = ({
  groups,
  items,
}: TimelineViewProps) => {
  const allStartTimes = items.map((i) => i.start_time);
  const allEndTimes = items.map((i) => i.end_time);
  const minTime = Math.min(...allStartTimes);
  const maxTime = Math.max(...allEndTimes);

  const [visibleTimeStart, setVisibleTimeStart] = useState(minTime);
  const [visibleTimeEnd, setVisibleTimeEnd] = useState(maxTime);

  const handleTimeChange = (newStart: number, newEnd: number) => {
    if (newStart < minTime) {
      setVisibleTimeStart(minTime);
      return;
    }
    if (newEnd > maxTime) {
      setVisibleTimeEnd(maxTime);
      return;
    }
    setVisibleTimeStart(newStart);
    setVisibleTimeEnd(newEnd);
  };

  return (
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
          canResize={false}
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
        </Timeline>
      </div>
    </div>
  );
};
