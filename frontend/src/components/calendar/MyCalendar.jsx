import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventDetailsModal from './EventDetailsModal';
import { format } from 'date-fns';

export default function MyFullCalendar() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      title: 'Walk-in Interview',
      start: '2025-07-09T09:00:00',
      end: '2025-07-09T10:30:00',
      attendee: 'James Bailey',
      location: 'Zoom Meeting',
      joinLink: 'https://zoom.us/j/123456789',
      meetingId: '123 456 789',
      password: 'abc123',
      details: 'Bring your updated resume and be ready for technical screening.',
    },
    {
      title: 'Onboarding Team',
      start: '2025-07-10T10:00:00',
      end: '2025-07-10T11:00:00',
      location: 'Company HQ',
      attendee: 'HR Team',
      details: 'Orientation and company overview.',
    },
    {
      title: 'HR Interview',
      start: '2025-07-11T13:00:00',
      end: '2025-07-11T14:30:00',
      location: 'Online Call',
      attendee: 'Sarah Lee',
      details: 'Behavioral and HR process discussion.',
    },
  ];

  const handleEventClick = (info) => {
    const event = info.event;

    // Extract and format date/time for modal
    const formattedEvent = {
      title: event.title,
      attendee: event.extendedProps.attendee,
      location: event.extendedProps.location,
      joinLink: event.extendedProps.joinLink,
      meetingId: event.extendedProps.meetingId,
      password: event.extendedProps.password,
      details: event.extendedProps.details,
      date: format(event.start, 'do MMMM yyyy'),
      time: `${format(event.start, 'hh:mm a')} - ${format(event.end, 'hh:mm a')}`,
    };

    setSelectedEvent(formattedEvent);
  };

  return (
    <div className="flex p-4 gap-4 h-screen overflow-hidden">
      {/* Calendar */}
      <div className="flex-grow">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          eventClick={handleEventClick}
          height="auto"
          weekNumbers={true}
        />
      </div>

      {/* Modal */}
      <EventDetailsModal
        open={!!selectedEvent}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
