import { useState } from 'react';
import { Button, Select, Segmented } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { dummyEvents, Event } from '@/components/calendar/data';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import EventModal from '@/components/calendar/EventModal';
import WeekView from '@/components/calendar/WeekView';
import DayView from '@/components/calendar/DayView';
import MonthView from '@/components/calendar/MonthView';

type ViewType = 'month' | 'week' | 'day' | 'list';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [viewType, setViewType] = useState<ViewType>('month');
  const [events] = useState<Event[]>(dummyEvents);
  const [selectedUser, setSelectedUser] = useState('Kishan');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handlePrevious = () => {
    if (viewType === 'month') {
      setCurrentDate(currentDate.subtract(1, 'month'));
    } else if (viewType === 'week') {
      setCurrentDate(currentDate.subtract(1, 'week'));
    } else if (viewType === 'day') {
      setCurrentDate(currentDate.subtract(1, 'day'));
    }
  };

  const handleNext = () => {
    if (viewType === 'month') {
      setCurrentDate(currentDate.add(1, 'month'));
    } else if (viewType === 'week') {
      setCurrentDate(currentDate.add(1, 'week'));
    } else if (viewType === 'day') {
      setCurrentDate(currentDate.add(1, 'day'));
    }
  };

  const handleToday = () => {
    setCurrentDate(dayjs());
  };

  const getTitle = () => {
    if (viewType === 'month') {
      return currentDate.format('MMMM YYYY');
    } else if (viewType === 'week') {
      const startOfWeek = currentDate.startOf('week');
      const endOfWeek = currentDate.endOf('week');
      return `${startOfWeek.format('MMM D')} - ${endOfWeek.format('MMM D, YYYY')}`;
    } else if (viewType === 'day') {
      return currentDate.format('MMMM D, YYYY');
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">Calendar</h1>
            <div className="flex items-center gap-2">
              <Button icon={<IconChevronLeft />} onClick={handlePrevious} />
              <Button icon={<IconChevronRight />} onClick={handleNext} />
              <Button onClick={handleToday}>today</Button>
            </div>
            <div className="text-xl font-semibold text-gray-800">{getTitle()}</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                type={selectedUser === 'Default' ? 'primary' : 'default'}
                onClick={() => setSelectedUser('Default')}
              >
                Default
              </Button>
              <Button
                type={selectedUser === 'Job' ? 'primary' : 'default'}
                onClick={() => setSelectedUser('Job')}
              >
                Job
              </Button>
              <Button
                type={selectedUser === 'Supplier' ? 'default' : 'default'}
                onClick={() => setSelectedUser('Supplier')}
              >
                Supplier
              </Button>
            </div>

            <Select
              value={selectedUser}
              onChange={setSelectedUser}
              style={{ width: 200 }}
              suffixIcon={<span>▼</span>}
            >
              <Select.Option value="Kishan">Kishan</Select.Option>
              <Select.Option value="John">John</Select.Option>
              <Select.Option value="Sarah">Sarah</Select.Option>
            </Select>

            <Segmented
              value={viewType}
              onChange={value => setViewType(value as ViewType)}
              options={[
                { label: 'month', value: 'month' },
                { label: 'week', value: 'week' },
                { label: 'day', value: 'day' },
                { label: 'list', value: 'list' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {viewType === 'month' && (
          <MonthView currentDate={currentDate} events={events} onEventClick={handleEventClick} />
        )}
        {viewType === 'week' && (
          <WeekView currentDate={currentDate} events={events} onEventClick={handleEventClick} />
        )}
        {viewType === 'day' && (
          <DayView currentDate={currentDate} events={events} onEventClick={handleEventClick} />
        )}
        {viewType === 'list' && (
          <MonthView currentDate={currentDate} events={events} onEventClick={handleEventClick} />
        )}
      </div>

      <EventModal event={selectedEvent} isOpen={isModalOpen} onClose={handleCloseModal} />

      <div className="fixed bottom-6 left-6 flex items-center gap-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">General</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm text-gray-600">Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-gray-600">Job</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span className="text-sm text-gray-600">Construction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-sm text-gray-600">Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-700 rounded"></div>
            <span className="text-sm text-gray-600">ReferralPartner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 rounded"></div>
            <span className="text-sm text-gray-600">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Holiday</span>
          </div>
        </div>
        <div className="h-6 w-px bg-gray-300"></div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <span className="text-sm text-gray-600">Appointment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Task</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
