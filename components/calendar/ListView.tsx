import { useMemo } from 'react';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Event } from './data';
import { IconCircleCheckFilled, IconCircleFilled, IconCalendarEvent } from '@tabler/icons-react';

interface ListViewProps {
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

const ListView = ({ currentDate, events, onEventClick }: ListViewProps) => {
    const groupedEvents = useMemo(() => {
        const monthStart = currentDate.startOf('month');
        const monthEnd = currentDate.endOf('month');
        const validEvents = events.filter(event => {
            const start = dayjs(event.start_time);
            const end = dayjs(event.end_time);

            return (
                (start.isBefore(monthEnd) || start.isSame(monthEnd)) &&
                (end.isAfter(monthStart) || end.isSame(monthStart))
            );
        });

        const groups: Record<string, Event[]> = {};

        validEvents.forEach(event => {
            let current = dayjs(event.start_time);
            const end = dayjs(event.end_time);

            if (current.isBefore(monthStart)) {
                current = monthStart;
            }

            while (
                (current.isBefore(end) || current.isSame(end, 'day')) &&
                (current.isBefore(monthEnd) || current.isSame(monthEnd, 'day'))
            ) {
                const dateKey = current.format('YYYY-MM-DD');
                if (!groups[dateKey]) {
                    groups[dateKey] = [];
                }
                if (!groups[dateKey].find(e => e.id === event.id)) {
                    groups[dateKey].push(event);
                }
                current = current.add(1, 'day');
            }
        });

        const sortedKeys = Object.keys(groups).sort();

        sortedKeys.forEach(key => {
            groups[key].sort((a, b) => dayjs(a.start_time).diff(dayjs(b.start_time)));
        });

        return sortedKeys.map(dateKey => ({
            date: dayjs(dateKey),
            events: groups[dateKey],
        }));
    }, [events, currentDate]);

    return (
        <div className="bg-white overflow-auto h-full" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {groupedEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-500">
                    <div className="bg-gray-50 p-6 rounded-full mb-4">
                        <IconCalendarEvent className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No events found</h3>
                    <p className="text-sm text-gray-500 max-w-xs text-center">
                        There are no events scheduled for this month.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {groupedEvents.map(group => (
                        <div
                            key={group.date.format('YYYY-MM-DD')}
                            className="flex flex-col sm:flex-row hover:bg-gray-50 transition-colors group/day"
                        >
                            {/* Date Column */}
                            <div className="sm:w-32 p-4 flex sm:flex-col items-start sm:items-center justify-start sm:justify-center border-b sm:border-b-0 sm:border-r border-gray-100 bg-white sm:bg-transparent sticky top-0 z-10 sm:static">
                                <div
                                    className={`text-2xl font-bold ${group.date.isSame(dayjs(), 'day') ? 'text-blue-600' : 'text-gray-800'}`}
                                >
                                    {group.date.format('DD')}
                                </div>
                                <div className="text-gray-500 uppercase text-xs font-bold tracking-wider ml-2 sm:ml-0 sm:mt-1">
                                    {group.date.format('ddd')}
                                </div>
                            </div>

                            {/* Events Column */}
                            <div className="flex-1 p-3 sm:p-4 space-y-3">
                                {group.events.map(event => {
                                    const eventStart = dayjs(event.start_time);
                                    const eventEnd = dayjs(event.end_time);
                                    const isAllDay = eventEnd.diff(eventStart, 'hour') >= 23;

                                    // Determine text color based on background
                                    const isToday = event.category === 'Today';
                                    const textColorClass = isToday ? 'text-gray-800' : 'text-white';
                                    const subTextColorClass = isToday ? 'text-gray-600' : 'text-white/80';
                                    const hoverClass = 'hover:opacity-95 transform hover:-translate-y-[1px]';

                                    return (
                                        <div
                                            key={`${group.date.format('YYYY-MM-DD')}-${event.id}`}
                                            className={`${categoryColors[event.category]} ${textColorClass} rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 ${hoverClass} relative overflow-hidden`}
                                            onClick={() => onEventClick(event)}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Time Column within Card */}
                                                <div
                                                    className={`flex flex-col items-center min-w-[80px] border-r ${isToday ? 'border-gray-300/50' : 'border-white/20'} pr-4`}
                                                >
                                                    {isAllDay ? (
                                                        <span className="text-sm font-semibold">All Day</span>
                                                    ) : (
                                                        <>
                                                            <span className="text-sm font-bold">
                                                                {eventStart.format('h:mm A')}
                                                            </span>
                                                            <span className={`text-xs ${subTextColorClass}`}>
                                                                {eventEnd.format('h:mm A')}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {event.type === 'Task' ? (
                                                            <IconCircleCheckFilled
                                                                className={`w-4 h-4 flex-shrink-0 ${isToday ? 'text-gray-700' : 'text-white'}`}
                                                            />
                                                        ) : (
                                                            <IconCircleFilled
                                                                className={`w-4 h-4 flex-shrink-0 ${isToday ? 'text-gray-700' : 'text-white'}`}
                                                            />
                                                        )}
                                                        <h4 className="font-bold text-base truncate leading-tight">
                                                            {event.title}
                                                        </h4>
                                                    </div>
                                                    <p
                                                        className={`text-sm ${subTextColorClass} line-clamp-2 leading-relaxed`}
                                                    >
                                                        {event.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListView;
