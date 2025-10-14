import { Modal, Tag } from 'antd';
import { IconCircleCheckFilled, IconCircleFilled, IconClock, IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { Event } from './data';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const categoryColors: Record<string, string> = {
  General: 'blue',
  Sales: 'purple',
  Job: 'orange',
  Construction: 'green',
  Maintenance: 'red',
  ReferralPartner: 'default',
  Today: 'gold',
  Holiday: 'magenta'
};

const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
  if (!event) return null;

  const startTime = dayjs(event.start_time);
  const endTime = dayjs(event.end_time);
  const duration = endTime.diff(startTime, 'minute');
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          {event.type === 'Task' ? (
            <IconCircleCheckFilled className="text-lg text-gray-600" />
          ) : (
            <IconCircleFilled className="text-lg text-gray-600" />
          )}
          <span className="text-lg font-semibold">Event Details</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      centered
      footer={null}
      width={600}
    >
      <div className="space-y-4 py-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
          <div className="flex items-center gap-2">
            <Tag color={categoryColors[event.category]}>{event.category}</Tag>
            <Tag>{event.type}</Tag>
          </div>
        </div>

        {event.description && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Description</h4>
            <p className="text-gray-700">{event.description}</p>
          </div>
        )}

        <div className="space-y-3 border-t pt-4">
          <div className="flex items-start gap-3">
            <IconCalendar className="text-lg text-gray-500 mt-1" />
            <div>
              <div className="text-sm font-medium text-gray-600">Start Date & Time</div>
              <div className="text-base text-gray-800">
                {startTime.format('dddd, MMMM D, YYYY')}
              </div>
              <div className="text-base text-gray-800 font-semibold">
                {startTime.format('h:mm A')}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IconCalendar className="text-lg text-gray-500 mt-1" />
            <div>
              <div className="text-sm font-medium text-gray-600">End Date & Time</div>
              <div className="text-base text-gray-800">
                {endTime.format('dddd, MMMM D, YYYY')}
              </div>
              <div className="text-base text-gray-800 font-semibold">
                {endTime.format('h:mm A')}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IconClock className="text-lg text-gray-500 mt-1" />
            <div>
              <div className="text-sm font-medium text-gray-600">Duration</div>
              <div className="text-base text-gray-800">
                {hours > 0 && `${hours} hour${hours > 1 ? 's' : ''} `}
                {minutes > 0 && `${minutes} minute${minutes > 1 ? 's' : ''}`}
                {hours === 0 && minutes === 0 && 'Less than a minute'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EventModal;
