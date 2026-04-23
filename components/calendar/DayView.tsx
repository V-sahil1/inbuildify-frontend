import { useMemo } from 'react';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Event } from './data';
import { IconCircleCheckFilled, IconCircleFilled } from '@tabler/icons-react';

interface DayViewProps {
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
  Today: 'bg-yellow-200 text-gray-800',
  Holiday: 'bg-red-500',
};

const DayView = ({ currentDate, events, onEventClick }: DayViewProps) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Separate events
  const singleDayEvents = events.filter(event => {
    const start = dayjs(event.start_time);
    const end = dayjs(event.end_time);
    const durationHours = end.diff(start, 'hour', true);
    return start.isSame(end, 'day') && durationHours < 23;
  });

  const allDayEvents = events.filter(event => {
    const start = dayjs(event.start_time);
    const end = dayjs(event.end_time);
    const durationHours = end.diff(start, 'hour', true);
    const isMultiOrFullDay = !start.isSame(end, 'day') || durationHours >= 23;

    // Check overlap with current date
    const overlaps = (start.isBefore(currentDate.endOf('day')) || start.isSame(currentDate, 'day')) &&
      (end.isAfter(currentDate.startOf('day')) || end.isSame(currentDate, 'day'));

    return isMultiOrFullDay && overlaps;
  });

  // Calculate layout for overlapping events
  const eventsWithLayout = useMemo(() => {
    // Filter for current day first
    const dayEvents = singleDayEvents.filter(event =>
      dayjs(event.start_time).isSame(currentDate, 'day')
    );

    const sorted = [...dayEvents].sort((a, b) => {
      const startA = dayjs(a.start_time);
      const startB = dayjs(b.start_time);
      if (!startA.isSame(startB)) return startA.diff(startB);
      return dayjs(b.end_time).diff(dayjs(a.end_time));
    });

    const groups: Event[][] = [];
    let currentGroup: Event[] = [];
    let groupEnd: dayjs.Dayjs | null = null;

    sorted.forEach(event => {
      const start = dayjs(event.start_time);
      const end = dayjs(event.end_time);

      if (!currentGroup.length) {
        currentGroup.push(event);
        groupEnd = end;
      } else {
        if (start.isBefore(groupEnd)) {
          currentGroup.push(event);
          if (end.isAfter(groupEnd)) groupEnd = end;
        } else {
          groups.push(currentGroup);
          currentGroup = [event];
          groupEnd = end;
        }
      }
    });
    if (currentGroup.length) groups.push(currentGroup);

    const result: (Event & { layout: React.CSSProperties })[] = [];

    groups.forEach(group => {
      const columns: dayjs.Dayjs[] = [];
      const eventSlots: { event: Event, colIndex: number }[] = [];

      group.forEach(event => {
        const start = dayjs(event.start_time);
        const end = dayjs(event.end_time);

        let placed = false;
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].isBefore(start) || columns[i].isSame(start)) {
            columns[i] = end;
            eventSlots.push({ event, colIndex: i });
            placed = true;
            break;
          }
        }
        if (!placed) {
          columns.push(end);
          eventSlots.push({ event, colIndex: columns.length - 1 });
        }
      });

      const totalCols = columns.length;

      eventSlots.forEach(({ event, colIndex }) => {
        const start = dayjs(event.start_time);
        const end = dayjs(event.end_time);
        const startHour = start.hour();
        const startMinute = start.minute();
        const durationMinutes = end.diff(start, 'minute');

        const top = (startHour * 60 + startMinute) * (128 / 60);
        const height = durationMinutes * (128 / 60);

        result.push({
          ...event,
          layout: {
            top: `${top}px`,
            height: `${Math.max(height, 40)}px`,
            left: `${(colIndex / totalCols) * 100}%`,
            width: `${(1 / totalCols) * 100}%`,
            position: 'absolute',
          }
        });
      });
    });

    return result;
  }, [singleDayEvents, currentDate]);

  return (
    <div className="bg-card-color overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      <div className="flex border-b border-border-color sticky top-0 z-20 bg-card-color">
        <div className="w-24 flex-shrink-0 border-r border-border-color bg-primary-10"></div>
        <div className="flex-1">
          <div className="p-4 text-center border-b border-border-color">
            <div className="text-sm text-font-color-100">{currentDate.format('dddd')}</div>
            <div
              className={`text-3xl font-semibold ${currentDate.isSame(dayjs(), 'day') ? 'text-color-primary' : 'text-font-color'
                }`}
            >
              {currentDate.format('MMMM D, YYYY')}
            </div>
          </div>

          {/* All Day Events Section */}
          {allDayEvents.length > 0 && (
            <div className="p-2 space-y-1 border-b border-border-color bg-primary-10">
              {allDayEvents.map(event => (
                <div
                  key={event.id}
                  className={`${categoryColors[event.category]} text-white text-xs px-2 py-1 rounded flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => onEventClick(event)}
                >
                  {event.type === 'Task' ? (
                    <IconCircleCheckFilled className="text-[10px] flex-shrink-0" />
                  ) : (
                    <IconCircleFilled className="text-[10px] flex-shrink-0" />
                  )}
                  <span className="font-medium truncate">{event.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex relative">
        <div className="w-24 flex-shrink-0">
          {hours.map(hour => (
            <div
              key={hour}
              className="h-32 border-b border-border-color pr-3 pt-2 text-right text-sm text-font-color-100"
            >
              {hour === 0
                ? '12:00 AM'
                : hour < 12
                  ? `${hour}:00 AM`
                  : hour === 12
                    ? '12:00 PM'
                    : `${hour - 12}:00 PM`}
            </div>
          ))}
        </div>

        <div className="flex-1 border-l border-border-color relative">
          {/* Background Grid */}
          <div className="absolute inset-0 pointer-events-none">
            {hours.map(h => (
              <div key={h} className="h-32 border-b border-border-color"></div>
            ))}
          </div>

          {/* Events Layer */}
          <div className="relative h-full w-full">
            {eventsWithLayout.map((event, idx) => {
              const start = dayjs(event.start_time);
              const end = dayjs(event.end_time);
              const durationMinutes = end.diff(start, 'minute');

              return (
                <div
                  key={event.id + idx}
                  className={`absolute ${categoryColors[event.category]} text-white p-3 rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition-opacity z-10 overflow-hidden`}
                  style={event.layout}
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex items-start gap-2 h-full">
                    {event.type === 'Task' ? (
                      <IconCircleCheckFilled className="text-sm mt-1 flex-shrink-0" />
                    ) : (
                      <IconCircleFilled className="text-sm mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base mb-1 truncate">{event.title}</div>
                      <div className="text-sm opacity-90 truncate">
                        {start.format('h:mm A')} - {end.format('h:mm A')} ({durationMinutes} min)
                      </div>
                      {parseInt(event.layout.height as string) > 80 && event.description && (
                        <div className="text-sm opacity-80 mt-1 line-clamp-2">{event.description}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
