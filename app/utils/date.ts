import { format, parse } from 'date-fns';

export function convertTo12HourFormat(timeString: string): [number, number, string] {
  const [h, m] = timeString.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const hour = h % 12 || 12;

  return [hour, m, period];
}

/**
 *
 * @example 2:30 PM -> 14:30
 */
export function convertTo24HourFormat(timeString: string) {
  const date = parse(timeString, 'h:mm a', new Date());
  return format(date, 'HH:mm');
}
