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
  Holiday: 'bg-red-500'
};

const WeekView = ({ currentDate, events, onEventClick }: WeekViewProps) => {
  const startOfWeek = currentDate.startOf('week');
  const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDateTime = (day: Dayjs, hour: number) => {
    return events.filter(event => {
      const eventStart = dayjs(event.start_time);
      const eventEnd = dayjs(event.end_time);
      const slotStart = day.hour(hour).minute(0);
      const slotEnd = day.hour(hour).minute(59);

      return (
        (eventStart.isSame(day, 'day') && eventStart.hour() === hour) ||
        (eventStart.isBefore(slotEnd) && eventEnd.isAfter(slotStart))
      );
    });
  };

  return (
    <div className="bg-white overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      <div className="flex">
        <div className="w-16 flex-shrink-0"></div>
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map(day => {
            const isToday = day.isSame(dayjs(), 'day');
            return (
              <div key={day.toString()} className="border-b border-r border-gray-200 p-2 text-center">
                <div className={`font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                  {day.format('ddd')}
                </div>
                <div className={`text-2xl ${isToday ? 'text-blue-600 font-bold' : 'text-gray-700'}`}>
                  {day.date()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex">
        <div className="w-16 flex-shrink-0">
          {hours.map(hour => (
            <div key={hour} className="h-24 border-b border-gray-200 pr-2 pt-1 text-right text-xs text-gray-500">
              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7">
          {weekDays.map(day => (
            <div key={day.toString()} className="border-r border-gray-200">
              {hours.map(hour => {
                const hourEvents = getEventsForDateTime(day, hour);
                return (
                  <div key={hour} className="h-24 border-b border-gray-200 p-1 relative">
                    {hourEvents.map((event, idx) => {
                      const eventStart = dayjs(event.start_time);
                      const eventEnd = dayjs(event.end_time);
                      const duration = eventEnd.diff(eventStart, 'hour', true);
                      const height = Math.min(duration * 96, 96);

                      return (
                        <div
                          key={event.id + idx}
                          className={`${categoryColors[event.category]} text-white text-xs px-2 py-1 rounded mb-1 flex items-start gap-1 cursor-pointer hover:opacity-80 transition-opacity`}
                          style={{ minHeight: `${height}px` }}
                          title={`${event.title}\n${eventStart.format('h:mm A')} - ${eventEnd.format('h:mm A')}`}
                          onClick={() => onEventClick(event)}
                        >
                          {event.type === 'Task' ? (
                            <IconCircleCheckFilled className="text-[10px] mt-0.5" />
                          ) : (
                            <IconCircleFilled className="text-[10px] mt-0.5" />
                          )}
                          <div className="flex-1 overflow-hidden">
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="text-[10px] opacity-90">
                              {eventStart.format('h:mm A')}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
