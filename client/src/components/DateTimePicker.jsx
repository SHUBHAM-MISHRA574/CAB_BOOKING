import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DATE_FORMAT = 'EEE, d MMM yyyy · h:mm aa';

function formatDisplayDate(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
  const d = new Date(date);
  const day = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${day} · ${time}`;
}

const CustomInput = React.forwardRef(({ value, onClick, onChange, id, placeholder, disabled }, ref) => (
  <input
    ref={ref}
    id={id}
    type="text"
    value={value}
    onClick={onClick}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    readOnly
    autoComplete="off"
    className="w-full py-3 px-4 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-uber-green focus:border-transparent cursor-pointer"
  />
));

export default function DateTimePicker({ value, onChange, minDate, placeholder = 'Select date and time', id, disabled }) {
  return (
    <DatePicker
      id={id}
      selected={value || null}
      onChange={onChange}
      minDate={minDate}
      showTimeSelect
      timeIntervals={15}
      timeCaption="Time"
      dateFormat={DATE_FORMAT}
      placeholderText={placeholder}
      disabled={disabled}
      customInput={<CustomInput id={id} placeholder={placeholder} disabled={disabled} />}
      calendarClassName="date-time-picker-calendar"
      popperClassName="date-time-picker-popper"
      popperPlacement="bottom-start"
      fixedHeight
      calendarStartDay={0}
    />
  );
}
