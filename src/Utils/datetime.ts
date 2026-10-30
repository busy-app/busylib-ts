// Date and time strings for text elements, in the device's local time.
//
// The device has no Intl, and its fonts are printable ASCII only: names are three-letter English and every part is built by hand.
//
//   formatTime(date)                   { time: '09:05', suffix: '' }
//   formatTime(date, { hour12: true }) { time: '9:05', suffix: 'AM' }
//   formatMonth(date)                  'Jul'
//   formatWeekday(date)                'Wed'
//   formatDayOfMonth(date)             '8'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const pad = (n: number) => String(n).padStart(2, '0');

export interface TimeFormatOptions {
  /** 12-hour clock with an AM/PM suffix; 24-hour by default. */
  hour12?: boolean;
  /** Seconds after the minutes. */
  seconds?: boolean;
}

export interface FormattedTime {
  /** Hours and minutes, and seconds when asked: `09:05` on a 24-hour clock, `9:05` on a 12-hour one. */
  time: string;
  /** `AM` or `PM` on a 12-hour clock, empty on a 24-hour one. */
  suffix: '' | 'AM' | 'PM';
}

/** The time of the date, with the AM/PM suffix apart, so it can be drawn in its own font or place. */
export function formatTime(date: Date, options?: TimeFormatOptions): FormattedTime {
  const hours = date.getHours();
  const rest = `:${pad(date.getMinutes())}${options?.seconds ? `:${pad(date.getSeconds())}` : ''}`;

  if (!options?.hour12) {
    return { time: pad(hours) + rest, suffix: '' };
  }
  return { time: `${hours % 12 || 12}${rest}`, suffix: hours < 12 ? 'AM' : 'PM' };
}

/** Three-letter month, e.g. `Jul`. */
export function formatMonth(date: Date): string {
  return MONTHS[date.getMonth()]!;
}

/** Three-letter weekday, e.g. `Wed`. */
export function formatWeekday(date: Date): string {
  return WEEKDAYS[date.getDay()]!;
}

/** Day of the month without a leading zero, e.g. `8`. */
export function formatDayOfMonth(date: Date): string {
  return String(date.getDate());
}
