import { useState } from 'react';
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
  onDateClick?: (date: Dayjs) => void;
  onEventDrop?: (eventId: string, newDate: Dayjs) => void;
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

const MonthView = ({
  currentDate,
  events,
  onEventClick,
  onDateClick,
  onEventDrop,
}: MonthViewProps) => {
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);
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
        {weeks.map((week, weekIndex) => {
          // Calculate slots for the week
          const weekStart = week[0];
          const weekEnd = week[6];

          const weekEvents = events.filter(event => {
            const eventStart = dayjs(event.start_time);
            const eventEnd = dayjs(event.end_time);
            return (
              (eventStart.isBefore(weekEnd, 'day') || eventStart.isSame(weekEnd, 'day')) &&
              (eventEnd.isAfter(weekStart, 'day') || eventEnd.isSame(weekStart, 'day'))
            );
          });

          weekEvents.sort((a, b) => {
            const startA = dayjs(a.start_time);
            const startB = dayjs(b.start_time);
            if (!startA.isSame(startB)) return startA.diff(startB);
            const durationA = dayjs(a.end_time).diff(startA);
            const durationB = dayjs(b.end_time).diff(startB);
            return durationB - durationA;
          });

          const eventSlots: Record<string, number> = {};
          const slots: (string | null)[][] = Array(7)
            .fill(null)
            .map(() => []);

          weekEvents.forEach(event => {
            const eventStart = dayjs(event.start_time);
            const eventEnd = dayjs(event.end_time);

            let startIndex = 0;
            let endIndex = 6;

            if (eventStart.isAfter(weekStart)) {
              startIndex = eventStart.diff(weekStart, 'day');
            }
            if (eventEnd.isBefore(weekEnd)) {
              endIndex = eventEnd.diff(weekStart, 'day');
            }

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

            // Assign slot
            eventSlots[event.id] = slotIndex;
            for (let i = startIndex; i <= endIndex; i++) {
              slots[i][slotIndex] = event.id;
            }
          });

          return week.map((day, dayIndex) => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = day.month() === currentDate.month();
            const isToday = day.isSame(dayjs(), 'day');

            const MAX_DISPLAY_ITEMS = 3;
            const maxSlotIndex = Math.max(...dayEvents.map(e => eventSlots[e.id] ?? 0), -1);

            // If we have events extending beyond the display limit (index >= 3),
            // we must reserve the last slot for the "+X more" label.
            // So we only render up to MAX_DISPLAY_ITEMS - 1 (indices 0, 1).
            const showMoreLabel = maxSlotIndex >= MAX_DISPLAY_ITEMS;
            const renderLimit = showMoreLabel ? MAX_DISPLAY_ITEMS - 1 : MAX_DISPLAY_ITEMS;

            const slotsToRender = Array.from({ length: renderLimit }, (_, i) => i);
            const hiddenEventsCount = dayEvents.filter(
              e => (eventSlots[e.id] ?? 0) >= renderLimit
            ).length;

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`min-h-[120px] border-r border-b border-gray-200 pb-2 cursor-pointer hover:bg-primary-10 ${
                  !isCurrentMonth ? 'bg-gray-100' : ''
                }`}
                onClick={() => onDateClick && day}
                onDragOver={e => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={e => {
                  e.preventDefault();
                  const eventId = e.dataTransfer.getData('text/plain');
                  if (onEventDrop && eventId) {
                    onEventDrop(eventId, day);
                  }
                }}
              >
                <div
                  className={`text-sm mb-1 p-2 ${
                    isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                  } ${isToday ? 'font-bold text-blue-600' : ''}`}
                >
                  {day.date()}
                </div>

                <div className="space-y-1">
                  {slotsToRender.map(slotIndex => {
                    const eventId = slots[dayIndex][slotIndex];
                    if (eventId) {
                      const event = events.find(e => e.id === eventId);
                      if (!event) return null;

                      const eventStart = dayjs(event.start_time);
                      const eventEnd = dayjs(event.end_time);
                      const isMultiDay = !eventStart.isSame(eventEnd, 'day');
                      const isFirstDay = day.isSame(eventStart, 'day');
                      const isLastDay = day.isSame(eventEnd, 'day');
                      const isStartOfWeek = day.day() === 0;
                      const showContent = !isMultiDay || isFirstDay || isStartOfWeek;

                      let borderRadiusClass = 'rounded mx-2';
                      if (isMultiDay) {
                        if (isFirstDay) {
                          borderRadiusClass = 'rounded-l rounded-r-none ml-2 -mr-px relative z-10';
                        } else if (isLastDay) {
                          borderRadiusClass = 'rounded-r rounded-l-none ml-0 mr-2';
                        } else {
                          borderRadiusClass = 'rounded-none ml-0 -mr-px relative z-10';
                        }
                      }

                      return (
                        <div
                          key={event.id + slotIndex}
                          className={`${categoryColors[event.category]} text-white text-xs px-2 py-1 ${borderRadiusClass} truncate flex items-center gap-1 cursor-pointer transition-opacity mb-1 ${
                            hoveredEventId === event.id ? 'opacity-80' : ''
                          }`}
                          title={event.title}
                          draggable
                          onDragStart={e => {
                            setDraggedEvent(event);
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', event.id);
                          }}
                          onDragEnd={() => {
                            setDraggedEvent(null);
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                          onMouseEnter={() => setHoveredEventId(event.id)}
                          onMouseLeave={() => setHoveredEventId(null)}
                        >
                          <div
                            className={`flex items-center gap-1 w-full ${showContent ? '' : 'invisible'}`}
                          >
                            {event.type === 'Task' ? (
                              <IconCircleCheckFilled className="text-[10px] flex-shrink-0" />
                            ) : (
                              <IconCircleFilled className="text-[10px] flex-shrink-0" />
                            )}
                            <span className="truncate">{event.title}</span>
                          </div>
                        </div>
                      );
                    } else {
                      // Render spacer if this slot is empty but there are events in this day (or just to keep alignment?)
                      // To strictly match alignment, we should render spacer if there's a higher slot filled?
                      // Or just always render 3 slots?
                      // If we always render 3 slots, empty days will look tall.
                      // Better: Render spacer if this slot is empty AND (there is an event in a higher slot on this day OR we want to force height).
                      // Actually, if we want "connected" look, we need to respect the slot index.
                      // If slot 0 is empty, but slot 1 has an event, we MUST render spacer for slot 0.
                      // Check if there are any events in higher slots for this day
                      const hasHigherEvents = slots[dayIndex].some(
                        (e, i) => i > slotIndex && e !== null
                      );
                      if (hasHigherEvents) {
                        return <div key={`spacer-${slotIndex}`} className="h-[24px] mb-1"></div>;
                      }
                      return null;
                    }
                  })}
                  {hiddenEventsCount > 0 && (
                    <div className="text-xs text-gray-500 px-2">+{hiddenEventsCount} more</div>
                  )}
                </div>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

export default MonthView;
