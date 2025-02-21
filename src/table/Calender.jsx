import React, { useEffect, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Col, Container, Row } from 'react-bootstrap';
import axios from 'axios';
import baseUrl from '../constant/ConstantApi';

const localizer = momentLocalizer(moment);

// Initial events
const initialEvents = [
  { id: 1, title: 'Meeting', start: new Date(2023, 9, 15, 10, 0), end: new Date(2023, 9, 15, 11, 0), type: 'meeting' },
  { id: 2, title: 'Leave', start: new Date(2023, 9, 20), end: new Date(2023, 9, 20), type: 'leave' },
];

// Draggable event types
const draggableEvents = [
  { id: 'meeting', title: '📅 Meeting', type: 'meeting' },
  { id: 'leave', title: '🏖️ Leave', type: 'leave' },
  { id: 'presentation', title: '🎤 Presentation', type: 'presentation' },
  { id: 'work-from-home', title: '🏡 Work From Home', type: 'work-from-home' },
  { id: 'holiday', title: '🌴 Holiday', type: 'holiday' },
  { id: 'overtime', title: '⏳ Overtime', type: 'overtime' },
  { id: 'business-travel', title: '✈️ Business Travel', type: 'business-travel' },
];

const Calendar = () => {
  const [events, setEvents] = useState(initialEvents);
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedType, setEditedType] = useState('');
  const [editedStartTime, setEditedStartTime] = useState('');
  const [editedEndTime, setEditedEndTime] = useState('');
  const [eventDuration, setEventDuration] = useState(60); // Default to 60 minutes for the slider

  

  // Visibility slider states
  const [sectionHeight, setSectionHeight] = useState({
    title: 0, 
    type: 0, 
    time: 0, 
    duration: 0,
  });

  // Handle event drop on calendar
  const onDrop = async (slotInfo) => {
    if (draggedEvent) {
      const newEvent = {
        title: draggedEvent.title,
        start: slotInfo.start,
        end: slotInfo.end || slotInfo.start,
        type: draggedEvent.type,
      };
  
      try {
        const response = await axios.post(`${baseUrl}user/createCalendarEvent`, newEvent);
        const savedEvent = response.data;
  
        // Assuming your backend returns the saved event with an ID
        setEvents([...events, { ...savedEvent, id: savedEvent._id }]);
      } catch (error) {
        console.error('Failed to save event:', error);
      }
  
      setDraggedEvent(null);
    }
  };

  // Dragging logic
  const onDragStart = (event) => setDraggedEvent(event);
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const draggedType = draggableEvents.find((e) => e.id === result.draggableId);
    if (draggedType) setDraggedEvent(draggedType);
  };

  // Remove event on double-click
  const onEventDoubleClick = (event) => {
    setEvents(events.filter((e) => e.id !== event.id));
  };

  // Handle event click to show pop-up
  const onEventClick = (event) => {
    setSelectedEvent(event);
    setEditedTitle(event.title);
    setEditedType(event.type);
    setEditedStartTime(moment(event.start).format('YYYY-MM-DDTHH:mm'));
    setEditedEndTime(moment(event.end).format('YYYY-MM-DDTHH:mm'));
    setIsPopupOpen(true);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${baseUrl}user/eventsGet`);
        const eventsFromAPI = response.data.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          id: event._id, // MongoDB usually returns _id
        }));
        setEvents(eventsFromAPI);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, []);
  // Handle editing the event title
  const handleTitleChange = (e) => setEditedTitle(e.target.value);

  // Handle editing the event type
  const handleTypeChange = (e) => setEditedType(e.target.value);

  // Handle editing the event start time
  const handleStartTimeChange = (e) => setEditedStartTime(e.target.value);

  // Handle editing the event end time
  const handleEndTimeChange = (e) => setEditedEndTime(e.target.value);

  // Handle event duration slider change
  const handleSliderChange = (e) => setEventDuration(e.target.value);

  // Handle save changes
  const handleSaveChanges = async () => {
    const matchingDraggableEvent = draggableEvents.find(
      (item) => item.type === editedType
    );
  
    const updatedEvent = {
      title: matchingDraggableEvent ? matchingDraggableEvent.title : editedTitle, // Store emoji title in DB
      type: editedType,
      start: moment(editedStartTime).toDate(),
      end: moment(editedEndTime).toDate(),
    };
  
    try {
      const response = await axios.put(
        `${baseUrl}user/eventUpdate/${selectedEvent.id}`,
        updatedEvent
      );
  
      const updatedEventFromAPI = response.data;
  
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === selectedEvent.id
            ? {
                ...e,
                title: updatedEvent.title, // Use the updated emoji title
                type: updatedEvent.type,
                start: new Date(updatedEvent.start),
                end: new Date(updatedEvent.end),
              }
            : e
        )
      );
  
      setIsPopupOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };
  
  
  
  
  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`${baseUrl}user/eventDelete/${selectedEvent.id}`);
      setEvents(events.filter((e) => e.id !== selectedEvent.id));
      setIsPopupOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };
  
  // Handle section visibility sliders
  const handleSliderVisibilityChange = (section, value) => {
    setSectionHeight({
      ...sectionHeight,
      [section]: value,
    });
  };

  // Custom event styling
  const eventStyleGetter = (event) => {
    const colors = {
      meeting: '#007bff',
      leave: '#ff4444',
      presentation: '#00c851',
      'work-from-home': '#ffbb33',
      holiday: '#ff8800',
      overtime: '#9933cc',
      'business-travel': '#33b5e5',
    };
    return {
      style: {
        backgroundColor: colors[event.type] || '#3174ad',
        color: 'white',
        borderRadius: '5px',
        padding: '5px',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    };
  };

  return (
    <>
      <Container fluid className="my-5">
        <Row>
          <Col lg={3}></Col>
          <Col lg={8}>
            <div className="bgColor rounded-3 shadow">
              <h4 className="fw-bold py-3 ms-3 text_color">Calendar</h4>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f4f6f9',
              }}
            >
              <DragDropContext onDragEnd={onDragEnd}>
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: '#fff',
                    maxWidth: '850px',
                    width: '100%',
                    borderRadius: '10px',
                    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Draggable Events Sidebar */}
                  <Droppable droppableId="sidebar">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          width: '150px',
                          padding: '15px',
                          backgroundColor: '#f4f4f4',
                          borderRight: '1px solid #ddd',
                        }}
                      >
                        <h4
                          style={{
                            fontSize: '14px',
                            textAlign: 'center',
                            marginBottom: '10px',
                            color: '#333',
                          }}
                        >
                          📌 Drag Events
                        </h4>
                        {draggableEvents.map((event, index) => (
                          <Draggable key={event.id} draggableId={event.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onMouseDown={() => onDragStart(event)}
                                style={{
                                  padding: '8px 12px',
                                  marginBottom: '8px',
                                  backgroundColor: '#fff',
                                  border: '1px solid #ddd',
                                  borderRadius: '5px',
                                  textAlign: 'center',
                                  fontSize: '12px',
                                  cursor: 'grab',
                                  transition: '0.2s',
                                  fontWeight: 'bold',
                                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                                  ...provided.draggableProps.style,
                                }}
                              >
                                {event.title}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {/* Calendar */}
                  <Droppable droppableId="calendar">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          flex: 1,
                          padding: '15px',
                          maxWidth: '700px',
                        }}
                      >
                        <BigCalendar
                          localizer={localizer}
                          events={events}
                          startAccessor="start"
                          endAccessor="end"
                          eventPropGetter={eventStyleGetter}
                          views={['month']}
                          defaultView="month"
                          selectable
                          onSelectSlot={onDrop}
                          onDoubleClickEvent={onEventDoubleClick}
                          onSelectEvent={onEventClick}
                          style={{
                            height: '80vh',
                            fontSize: '13px',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)',
                            padding: '10px',
                          }}
                        />
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </DragDropContext>

              {/* Pop-up Menu */}
              {isPopupOpen && selectedEvent && (
                <div
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000,
                    width: '400px',
                    minHeight: '300px',
                  }}
                >
                  <h3>Edit Event</h3>

                  {/* Title Section */}
                  <div>
                    <label>Event Title:</label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={handleTitleChange}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        marginBottom: '10px',
                      }}
                    />
                   
                  </div>

                  {/* Event Type Section */}
                  <div>
                    <label>Event Type:</label>
                    <select
                      value={editedType}
                      onChange={handleTypeChange}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        marginBottom: '10px',
                      }}
                    >
                      <option value="meeting">Meeting</option>
                      <option value="leave">Leave</option>
                      <option value="presentation">Presentation</option>
                      <option value="work-from-home">Work from Home</option>
                      <option value="holiday">Holiday</option>
                      <option value="overtime">Overtime</option>
                      <option value="business-travel">Business Travel</option>
                    </select>
                    
                  </div>

                  {/* Time Section */}
                  <div>
                    <label>Start Time:</label>
                    <input
                      type="datetime-local"
                      value={editedStartTime}
                      onChange={handleStartTimeChange}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        marginBottom: '10px',
                      }}
                    />
                    <label>End Time:</label>
                    <input
                      type="datetime-local"
                      value={editedEndTime}
                      onChange={handleEndTimeChange}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                      }}
                    />
                  
                  </div>

                  {/* Duration Section */}
                  <div>
                    <label>Event Duration (minutes):</label>
                    <input
                      type="range"
                      min="30"
                      max="240"
                      value={eventDuration}
                      onChange={handleSliderChange}
                      style={{
                        width: '100%',
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>30</span>
                      <span>240</span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '20px',
                    }}
                  >
                    <button
                      onClick={handleSaveChanges}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        border: 'none',
                        borderRadius: '5px',
                        color: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleDeleteEvent}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        border: 'none',
                        borderRadius: '5px',
                        color: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      Delete Event
                    </button>
                  </div>
                </div>

                
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Calendar;
