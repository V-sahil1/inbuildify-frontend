import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { IconCircleCheckFilled, IconCircleFilled } from '@tabler/icons-react';
import { Event } from './data';

interface WeekViewProps {
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

const WeekView = ({ currentDate, events, onEventClick }: WeekViewProps) => {
  const startOfWeek = currentDate.startOf('week');
  const endOfWeek = currentDate.endOf('week');
  const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Separate events
  const singleDayEvents = events.filter(event => {
    const start = dayjs(event.start_time);
    const end = dayjs(event.end_time);
    const durationHours = end.diff(start, 'hour', true);
    // It is a single day event if it starts and ends on same day AND is not a full day event
    return start.isSame(end, 'day') && durationHours < 23;
  });

  const multiDayEvents = events.filter(event => {
    const start = dayjs(event.start_time);
    const end = dayjs(event.end_time);
    const durationHours = end.diff(start, 'hour', true);

    // Include if it overlaps with current week AND (is multi-day OR is full day)
    const isMultiOrFullDay = !start.isSame(end, 'day') || durationHours >= 23;
    const overlaps = (start.isBefore(endOfWeek) || start.isSame(endOfWeek, 'day')) &&
      (end.isAfter(startOfWeek) || end.isSame(startOfWeek, 'day'));
    return isMultiOrFullDay && overlaps;
  });

  // Calculate layout for multi-day events
  const sortedMultiDayEvents = [...multiDayEvents].sort((a, b) => {
    const startA = dayjs(a.start_time);
    const startB = dayjs(b.start_time);
    if (!startA.isSame(startB)) return startA.diff(startB);
    const durationA = dayjs(a.end_time).diff(startA);
    const durationB = dayjs(b.end_time).diff(startB);
    return durationB - durationA;
  });

  // Slotting for multi-day events
  const multiDaySlots: Record<string, number> = {};
  const slots: (string | null)[][] = Array(7).fill(null).map(() => []);

  sortedMultiDayEvents.forEach(event => {
    const start = dayjs(event.start_time);
    const end = dayjs(event.end_time);

    let startIndex = start.diff(startOfWeek, 'day');
    let endIndex = end.diff(startOfWeek, 'day');

    // Clamp to week boundaries
    if (startIndex < 0) startIndex = 0;
    if (endIndex > 6) endIndex = 6;

    // Find first available slot
    let slotIndex = 0;
    while (true) {
      let isAvailable = true;
      for (let i = startIndex; i <= endIndex; i++) {
        if (slots[i][slotIndex]) {
          isAvailable = false;
          break;
        }
      }
      if (isAvailable) break;
      slotIndex++;
    }

    multiDaySlots[event.id] = slotIndex;
    for (let i = startIndex; i <= endIndex; i++) {
      slots[i][slotIndex] = event.id;
    }
  });

  const maxMultiDaySlots = Math.max(...Object.values(multiDaySlots), -1) + 1;

  // Helper to get events for a specific day for absolute positioning
  const getEventsForDay = (day: Dayjs) => {
    return singleDayEvents.filter(event => {
      const eventStart = dayjs(event.start_time);
      return eventStart.isSame(day, 'day');
    });
  };

  return (
    <div className="bg-white overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      <div className="flex border-b border-gray-200 sticky top-0 z-20 bg-white">
        <div className="w-16 flex-shrink-0 border-r border-gray-200 bg-gray-50"></div>
        <div className="flex-1">
          {/* Header Days */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {weekDays.map(day => {
              const isToday = day.isSame(dayjs(), 'day');
              return (
                <div
                  key={day.toString()}
                  className="border-r border-gray-200 p-2 text-center last:border-r-0"
                >
                  <div className={`font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                    {day.format('ddd')}
                  </div>
                  <div
                    className={`text-2xl ${isToday ? 'text-blue-600 font-bold' : 'text-gray-700'}`}
                  >
                    {day.date()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Multi-day Events Section */}
          {sortedMultiDayEvents.length > 0 && (
            <div className="relative border-b border-gray-200" style={{ height: `${maxMultiDaySlots * 28 + 8}px` }}>
              {/* Grid lines for multi-day section */}
              <div className="absolute inset-0 grid grid-cols-7 h-full">
                {weekDays.map((day, i) => (
                  <div key={i} className="border-r border-gray-200 h-full last:border-r-0"></div>
                ))}
              </div>

              {/* Render Multi-day Events */}
              {sortedMultiDayEvents.map(event => {
                const start = dayjs(event.start_time);
                const end = dayjs(event.end_time);

                let startIndex = start.diff(startOfWeek, 'day');
                let endIndex = end.diff(startOfWeek, 'day');

                // Visual clamping
                const isStartClipped = startIndex < 0;
                const isEndClipped = endIndex > 6;

                if (startIndex < 0) startIndex = 0;
                if (endIndex > 6) endIndex = 6;

                const colSpan = endIndex - startIndex + 1;
                const slotIndex = multiDaySlots[event.id];

                return (
                  <div
                    key={event.id}
                    className={`absolute ${categoryColors[event.category]} text-white text-xs px-2 py-1 rounded truncate flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity`}
                    style={{
                      top: `${slotIndex * 28 + 4}px`,
                      left: `${(startIndex / 7) * 100}%`,
                      width: `calc(${(colSpan / 7) * 100}% - ${isStartClipped ? 0 : 4}px - ${isEndClipped ? 0 : 4}px)`,
                      height: '24px',
                      marginLeft: isStartClipped ? '0' : '4px',
                      marginRight: isEndClipped ? '0' : '4px',
                    }}
                    title={`${event.title} (${start.format('MMM D')} - ${end.format('MMM D')})`}
                    onClick={() => onEventClick(event)}
                  >
                    {event.type === 'Task' ? (
                      <IconCircleCheckFilled className="text-[10px] flex-shrink-0" />
                    ) : (
                      <IconCircleFilled className="text-[10px] flex-shrink-0" />
                    )}
                    <span className="truncate font-medium">{event.title}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex relative">
        <div className="w-16 flex-shrink-0">
          {hours.map(hour => (
            <div
              key={hour}
              className="h-24 border-b border-gray-200 pr-2 pt-1 text-right text-xs text-gray-500"
            >
              {hour === 0
                ? '12 AM'
                : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                    ? '12 PM'
                    : `${hour - 12} PM`}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 relative">
          {/* Background Grid */}
          <div className="absolute inset-0 grid grid-cols-7 pointer-events-none">
            {weekDays.map((day, i) => (
              <div key={i} className="border-r border-gray-200 h-full">
                {hours.map(h => (
                  <div key={h} className="h-24 border-b border-gray-200"></div>
                ))}
              </div>
            ))}
          </div>

          {/* Events Layer */}
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day);
            return (
              <div key={day.toString()} className="relative h-full">
                {dayEvents.map((event, idx) => {
                  const start = dayjs(event.start_time);
                  const end = dayjs(event.end_time);
                  const startHour = start.hour();
                  const startMinute = start.minute();
                  const durationMinutes = end.diff(start, 'minute');

                  // 1 hour = 96px (h-24)
                  // 1 minute = 96 / 60 = 1.6px
                  const top = (startHour * 60 + startMinute) * 1.6;
                  const height = durationMinutes * 1.6;

                  return (
                    <div
                      key={event.id}
                      className={`absolute left-1 right-1 ${categoryColors[event.category]} text-white text-xs px-2 py-1 rounded flex flex-col gap-0.5 cursor-pointer hover:opacity-80 transition-opacity z-10 overflow-hidden`}
                      style={{
                        top: `${top}px`,
                        height: `${Math.max(height, 20)}px`, // Min height for visibility
                      }}
                      title={`${event.title}\n${start.format('h:mm A')} - ${end.format('h:mm A')}`}
                      onClick={() => onEventClick(event)}
                    >
                      <div className="flex items-center gap-1">
                        {event.type === 'Task' ? (
                          <IconCircleCheckFilled className="text-[10px] flex-shrink-0" />
                        ) : (
                          <IconCircleFilled className="text-[10px] flex-shrink-0" />
                        )}
                        <span className="font-medium truncate">{event.title}</span>
                      </div>
                      {height > 30 && (
                        <div className="text-[10px] opacity-90 truncate">
                          {start.format('h:mm A')} - {end.format('h:mm A')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
