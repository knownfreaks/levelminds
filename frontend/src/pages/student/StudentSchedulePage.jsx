import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { format } from 'date-fns';

const StudentSchedulePage = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await api.get('/students/schedule');
                const formattedEvents = response.data.map(interview => ({
                    id: interview.id,
                    title: interview.title,
                    start: `${interview.interview_date}T${interview.start_time}`,
                    end: `${interview.interview_date}T${interview.end_time}`,
                    extendedProps: {
                        schoolName: interview.JobApplication.Job.SchoolProfile.school_name,
                        location: interview.location,
                    }
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error("Failed to fetch schedule:", error);
            }
        };
        fetchSchedule();
    }, []);

    const handleEventClick = (clickInfo) => {
        setSelectedEvent({
            title: clickInfo.event.title,
            schoolName: clickInfo.event.extendedProps.schoolName,
            location: clickInfo.event.extendedProps.location,
            date: format(clickInfo.event.start, 'MMMM do, yyyy'),
            time: `${format(clickInfo.event.start, 'p')} - ${format(clickInfo.event.end, 'p')}`
        });
        setModalOpen(true);
    };

    return (
        <div>
             <h1 className="text-3xl font-bold mb-4">My Schedule</h1>
             <div className="bg-white p-4 rounded-lg shadow">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={events}
                    eventClick={handleEventClick}
                    height="auto"
                />
             </div>

             <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedEvent?.title}</DialogTitle>
                        <DialogDescription>With {selectedEvent?.schoolName}</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-2 text-sm">
                        <p><strong>Date:</strong> {selectedEvent?.date}</p>
                        <p><strong>Time:</strong> {selectedEvent?.time}</p>
                        <p><strong>Location:</strong> {selectedEvent?.location}</p>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StudentSchedulePage;