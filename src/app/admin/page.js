"use client";

import { useState } from 'react';

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

export default function AdminInterface() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const devices = [
    { name: "Grandma", mac: "00:1B:44:11:3A:B7", ip: "192.168.1.10" },
    { name: "Conor's Raspberry Pi", mac: "00:1B:44:11:3A:B8", ip: "192.168.1.11" },
  ];

  const toggleGuestSelection = (guest) => {
    setSelectedGuests((prev) =>
      prev.includes(guest) ? prev.filter((g) => g !== guest) : [...prev, guest]
    );
  };

  const handleSaveEvent = () => {
    setEvents([...events, { date: selectedDate, name: eventName, start: eventStartTime, end: eventEndTime }]);
    setModalOpen(false);
    setEventName('');
    setEventStartTime('');
    setEventEndTime('');
    setSelectedGuests([]);
  };

  const changeMonth = (increment) => {
    let newMonth = currentMonth + increment;
    if (newMonth > 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else if (newMonth < 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(newMonth);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <h2 className="text-3xl font-bold mb-6">Admin Calendar Interface</h2>
        <div className="flex gap-8">
          <div className="flex-grow bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <button className="px-2 py-1 bg-gray-300 rounded" onClick={() => changeMonth(-1)}>Prev</button>
              <h3 className="text-xl font-semibold">{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
              <button className="px-2 py-1 bg-gray-300 rounded" onClick={() => changeMonth(1)}>Next</button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="font-semibold text-center border-b pb-1">{day}</div>
              ))}
              {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }).map((_, index) => {
                const dayEvents = events.filter(e => e.date === index + 1);
                return (
                  <div
                    key={index}
                    className="h-24 border cursor-pointer hover:bg-gray-100 relative"
                    onClick={() => { setSelectedDate(index + 1); setModalOpen(true); }}
                  >
                    <span className="absolute top-1 right-1 text-xs text-gray-400">{index + 1}</span>
                    {dayEvents.map((e, idx) => (
                      <div key={idx} className="text-xs bg-blue-100 rounded px-1 mt-4">
                        {e.name} ({e.start} - {e.end})
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-72 bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Connected Devices</h3>
            <ul>
              {devices.map((device) => (
                <li key={device.mac} className="border-b py-2">
                  <p className="font-semibold">{device.name}</p>
                  <p className="text-sm text-gray-500">MAC: {device.mac}</p>
                  <p className="text-sm text-gray-500">IP: {device.ip}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create Event - {selectedDate}/{currentMonth + 1}/{currentYear}</h3>

            <input type="text" placeholder="Event Name" className="w-full border rounded p-2 mb-4" value={eventName} onChange={(e) => setEventName(e.target.value)} />
            <input type="time" className="w-full border rounded p-2 mb-2" value={eventStartTime} onChange={(e) => setEventStartTime(e.target.value)} />
            <input type="time" className="w-full border rounded p-2 mb-4" value={eventEndTime} onChange={(e) => setEventEndTime(e.target.value)} />

            <div className="mb-4">
              <p className="font-semibold mb-2">Invite Guests:</p>
              {devices.map((device) => (
                <label key={device.name} className="block">
                  <input type="checkbox" checked={selectedGuests.includes(device.name)} onChange={() => toggleGuestSelection(device.name)} className="mr-2" />
                  {device.name}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded" onClick={handleSaveEvent}>Save Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
