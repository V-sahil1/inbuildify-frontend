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
  Holiday: 'bg-red-500'
};

const DayView = ({ currentDate, events, onEventClick }: DayViewProps) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventStart = dayjs(event.start_time);
      const eventEnd = dayjs(event.end_time);
      const slotStart = currentDate.hour(hour).minute(0);
      const slotEnd = currentDate.hour(hour).minute(59);

      return (
        eventStart.isSame(currentDate, 'day') &&
        (eventStart.hour() === hour ||
         (eventStart.isBefore(slotEnd) && eventEnd.isAfter(slotStart)))
      );
    });
  };

  return (
    <div className="bg-white overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      <div className="flex border-b border-gray-200">
        <div className="w-24 flex-shrink-0"></div>
        <div className="flex-1 p-4 text-center">
          <div className="text-sm text-gray-600">{currentDate.format('dddd')}</div>
          <div className={`text-3xl font-semibold ${
            currentDate.isSame(dayjs(), 'day') ? 'text-blue-600' : 'text-gray-800'
          }`}>
            {currentDate.format('MMMM D, YYYY')}
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-24 flex-shrink-0">
          {hours.map(hour => (
            <div key={hour} className="h-32 border-b border-gray-200 pr-3 pt-2 text-right text-sm text-gray-600">
              {hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`}
            </div>
          ))}
        </div>

        <div className="flex-1 border-l border-gray-200">
          {hours.map(hour => {
            const hourEvents = getEventsForHour(hour);
            return (
              <div key={hour} className="h-32 border-b border-gray-200 p-2">
                <div className="space-y-2">
                  {hourEvents.map((event, idx) => {
                    const eventStart = dayjs(event.start_time);
                    const eventEnd = dayjs(event.end_time);
                    const duration = eventEnd.diff(eventStart, 'minute');

                    return (
                      <div
                        key={event.id + idx}
                        className={`${categoryColors[event.category]} text-white p-3 rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition-opacity`}
                        onClick={() => onEventClick(event)}
                      >
                        <div className="flex items-start gap-2">
                          {event.type === 'Task' ? (
                            <IconCircleCheckFilled className="text-sm mt-1" />
                          ) : (
                            <IconCircleFilled className="text-sm mt-1" />
                          )}
                          <div className="flex-1">
                            <div className="font-semibold text-base mb-1">{event.title}</div>
                            <div className="text-sm opacity-90 mb-2">
                              {eventStart.format('h:mm A')} - {eventEnd.format('h:mm A')} ({duration} min)
                            </div>
                            {event.description && (
                              <div className="text-sm opacity-80">{event.description}</div>
                            )}
                            <div className="mt-2 text-xs opacity-75 flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-white bg-opacity-20 rounded">
                                {event.category}
                              </span>
                              <span className="px-2 py-0.5 bg-white bg-opacity-20 rounded">
                                {event.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayView;
