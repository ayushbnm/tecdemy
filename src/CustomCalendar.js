import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const CustomCalendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: null, end: null, description: '' });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleSelectSlot = ({ start }) => {
    setNewEvent({ ...newEvent, start, end: start });
    setShowModal(true);
  };

  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert('Please complete all fields.');
      return;
    }
    if (newEvent.end < newEvent.start) {
      alert('End time cannot be before start time.');
      return;
    }
    setEvents([...events, newEvent]);
    setShowModal(false);
    setNewEvent({ title: '', start: null, end: null, description: '' });
  };

  const moveEvent = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    setEvents(events.map(e => (e === event ? updatedEvent : e)));
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = () => {
    if (window.confirm(`Would you like to delete this event: ${selectedEvent.title}?`)) {
      setEvents(events.filter(e => e !== selectedEvent));
      handleCloseDetailsModal();
    }
  };

  const handleEditEvent = () => {
    // Handle edit logic here
  };

  const handleEmailEvent = () => {
    // Handle email logic here
  };

  return (
    <div style={{ height: '100vh' }}>
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleEventClick}
        onEventDrop={moveEvent}
        resizable
        onEventResize={moveEvent}
        defaultView="month"
        views={['month', 'week', 'day']}
      />

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create New Event</h3>
            <input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <DatePicker
              selected={newEvent.start}
              onChange={(date) => setNewEvent({ ...newEvent, start: date })}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="Start Date & Time"
            />
            <DatePicker
              selected={newEvent.end}
              onChange={(date) => setNewEvent({ ...newEvent, end: date })}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="End Date & Time"
            />
            <textarea
              placeholder="Event Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={handleSaveEvent}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedEvent && (
        <div className="details-modal">
          <div className="details-modal-content">
            <div className="modal-header">
              <h3>{selectedEvent.title}</h3>
              <button className="close-modal" onClick={handleCloseDetailsModal}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Start:</strong> {moment(selectedEvent.start).format('MMMM Do YYYY, h:mm a')}</p>
              <p><strong>End:</strong> {moment(selectedEvent.end).format('MMMM Do YYYY, h:mm a')}</p>
              {selectedEvent.description && <p><strong>Description:</strong> {selectedEvent.description}</p>}
            </div>
            <div className="modal-footer">
              <button className="edit-event" onClick={handleEditEvent}>✏️ Edit</button>
              <button className="delete-event" onClick={handleDeleteEvent}>🗑️ Delete</button>
              <button className="email-event" onClick={handleEmailEvent}>📧 Email</button>
              <button className="more-options">⋮</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;
