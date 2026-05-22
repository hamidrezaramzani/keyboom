"use client";
import { Card } from "@/app/components/ui";
import { useAlertDialog } from "@/app/components/ui/alert/alert.component";
import { getJalaliMonthFa } from "@/app/lib";
import { Dashboard } from "@/app/services/dashboard";
import moment from "jalali-moment";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

const getJalaliMonthDays = (year: number, month: number) => {
  const firstDayOfMonth = moment(
    `${year}/${month + 1}/01`,
    "jYYYY/jM/jDD",
  ).locale("fa");
  const startDayOfWeek = firstDayOfMonth.weekday();

  const daysInMonth = firstDayOfMonth.jDaysInMonth();
  const days = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = moment(`${year}/${month + 1}/${i}`, "jYYYY/jM/jDD");
    days.push({
      day: i,
      date: date,
      isToday: date.isSame(moment(), "day"),
    });
  }

  return days;
};

export function SubscriptionCalendar({
  items,
}: {
  items: Dashboard["subscriptionCalendar"];
}) {
  const [currentDate, setCurrentDate] = useState(() => moment());

  const { showAlert } = useAlertDialog();

  const year = currentDate.jYear();
  const month = currentDate.jMonth();

  const monthDays = useMemo(() => {
    return getJalaliMonthDays(year, month);
  }, [year, month]);

  const getActiveSubscriptionsForDay = (dayDate: moment.Moment) => {
    if (!dayDate) return [];

    return items?.filter((sub) => {
      const subStart = moment(sub.startDate, "jYYYY-jMM-jDD");
      const subEnd = moment(sub.endDate, "jYYYY-jMM-jDD");
      return (
        dayDate.isSameOrAfter(subStart, "day") &&
        dayDate.isSameOrBefore(subEnd, "day")
      );
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, "jMonth"));
  };

  const goToNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, "jMonth"));
  };

  const goToToday = () => {
    setCurrentDate(moment());
  };

  const weekDays = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CalendarIcon size={18} />
          تقویم اشتراک‌ها
        </h2>

        <div className="flex gap-2">
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors text-sm"
          >
            امروز
          </button>
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>

      <div className="text-center mb-4 text-gray-400 font-medium">
        {getJalaliMonthFa(currentDate.valueOf())} -{" "}
        {currentDate.format("jYYYY")}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-gray-500 text-sm py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((day, index) => {
          if (!day) {
            return (
              <div
                key={`empty-${index}`}
                className="h-24 bg-gray-800/20 rounded-lg"
              />
            );
          }

          const activeSubs = getActiveSubscriptionsForDay(day.date);

          return (
            <div
              key={day.day}
              className={`min-h-24 p-1 rounded-lg border ${
                day.isToday
                  ? "bg-indigo-500/20 border-indigo-500"
                  : "bg-gray-800/30 border-gray-700"
              } hover:bg-gray-700/50 transition-colors cursor-pointer`}
              onClick={() => {
                const subsList = activeSubs
                  .map((s) => `${s.name} (${s.price.toLocaleString()} تومان)`)
                  .join("\n");
                showAlert({
                  message: `📅 ${day.date.format("jDD jMMMM")}\n\nاشتراک‌های فعال:\n${subsList || "هیچ اشتراک فعالی نیست"}`,
                  title: "هیچ اشتراکی فعال نیست",
                });
              }}
            >
              <div className="text-right text-sm font-medium text-gray-300">
                {day.day}
              </div>
              <div className="mt-1 space-y-1">
                {activeSubs.slice(0, 2).map((sub) => {
                  return (
                    <div
                      key={sub.id}
                      className="text-xs px-1 rounded truncate"
                      style={{
                        backgroundColor: sub.color,
                        color: "#222",
                        fontWeight: "bold",
                      }}
                      title={sub.name}
                    >
                      {sub.name}
                    </div>
                  );
                })}
                {activeSubs.length > 2 && (
                  <div className="text-xs text-gray-400 text-center">
                    +{activeSubs.length - 2} بیشتر
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
