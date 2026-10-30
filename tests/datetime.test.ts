import { describe, expect, test } from 'vitest';
import { formatDayOfMonth, formatMonth, formatTime, formatWeekday } from 'Utils/index';

// Local time, as the functions read it: Wednesday, 8 July 2026.
const at = (hours: number, minutes = 5, seconds = 3) => new Date(2026, 6, 8, hours, minutes, seconds);

describe('formatTime', () => {
  test('24-hour clock pads the hours and has no suffix', () => {
    expect(formatTime(at(9))).toEqual({ time: '09:05', suffix: '' });
    expect(formatTime(at(0))).toEqual({ time: '00:05', suffix: '' });
    expect(formatTime(at(23, 59))).toEqual({ time: '23:59', suffix: '' });
  });

  test.each([
    [0, '12:05', 'AM'],
    [9, '9:05', 'AM'],
    [12, '12:05', 'PM'],
    [23, '11:05', 'PM']
  ])('12-hour clock at %i:05 is %s %s', (hours, time, suffix) => {
    expect(formatTime(at(hours), { hour12: true })).toEqual({ time, suffix });
  });

  test('seconds follow the minutes', () => {
    expect(formatTime(at(9), { seconds: true })).toEqual({ time: '09:05:03', suffix: '' });
    expect(formatTime(at(21), { hour12: true, seconds: true })).toEqual({ time: '9:05:03', suffix: 'PM' });
  });
});

describe('date parts', () => {
  test('month, weekday and day of the month', () => {
    expect(formatMonth(at(9))).toBe('Jul');
    expect(formatWeekday(at(9))).toBe('Wed');
    expect(formatDayOfMonth(at(9))).toBe('8');
  });

  test('every month and weekday has a name', () => {
    expect(Array.from({ length: 12 }, (_, month) => formatMonth(new Date(2026, month, 1)))).toEqual([
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]);
    // 5 July 2026 is a Sunday.
    expect(Array.from({ length: 7 }, (_, day) => formatWeekday(new Date(2026, 6, 5 + day)))).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  });
});
