import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Event } from './data';
import { IconCircleCheckFilled, IconCircleFilled } from '@tabler/icons-react';

dayjs.extend(isBetween);

interface MonthViewProps {
  currentDate: Dayjs;
  events: Event[];
  onEventClick: (event: Event) => void;
}

const categoryColors: Record<string, string> = {
  General: 'bg-blue-500',
  Sales: 'bg-purple-500',
  Job: 'bg-orange-500',
  Construction: 'bg-green-600',
  Maintenance: 'bg-red-600',
  ReferralPartner: 'bg-gray-700',
  Today: 'bg-yellow-200',
  Holiday: 'bg-red-500',
};

const MonthView = ({ currentDate, events, onEventClick }: MonthViewProps) => {
  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const startDate = startOfMonth.startOf('week');
  const endDate = endOfMonth.endOf('week');

  const weeks: Dayjs[][] = [];
  let currentWeek: Dayjs[] = [];
  let day = startDate;

  while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    day = day.add(1, 'day');
  }

  const getEventsForDate = (date: Dayjs) => {
    return events.filter(event => {
      const eventStart = dayjs(event.start_time);
      const eventEnd = dayjs(event.end_time);
      return date.isBetween(eventStart, eventEnd, 'day', '[]');
    });
  };

  return (
    <div className="bg-white">
      <div className="grid grid-cols-7 border-b border-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-3 text-center font-medium text-gray-600 text-sm">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = day.month() === currentDate.month();
            const isToday = day.isSame(dayjs(), 'day');

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`min-h-[120px] border-r border-b border-gray-200 p-2 ${
                  !isCurrentMonth ? 'bg-gray-50' : ''
                }`}
              >
                <div
                  className={`text-sm mb-1 ${
                    isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                  } ${isToday ? 'font-bold text-blue-600' : ''}`}
                >
                  {day.date()}
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event, idx) => {
                    const eventStart = dayjs(event.start_time);
                    const eventEnd = dayjs(event.end_time);
                    const isMultiDay = !eventStart.isSame(eventEnd, 'day');
                    const isFirstDay = day.isSame(eventStart, 'day');
                    const isLastDay = day.isSame(eventEnd, 'day');

                    return (
                      <div
                        key={event.id + idx}
                        className={`${categoryColors[event.category]} text-white text-xs px-2 py-1 rounded truncate flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity`}
                        title={event.title}
                        onClick={() => onEventClick(event)}
                      >
                        {event.type === 'Task' ? (
                          <IconCircleCheckFilled className="text-[10px]" />
                        ) : (
                          <IconCircleFilled className="text-[10px]" />
                        )}
                        <span className="truncate">{event.title}</span>
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 px-2">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MonthView;
