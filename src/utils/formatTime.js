import { format, getTime, formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm, { locale: it }) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMMM yyyy  p';

  return date ? format(new Date(date), fm, { locale: it }) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: it,
      })
    : '';
}

export function fDayInItalian(date) {
  return date ? format(new Date(date), 'EEEE', { locale: it }) : '';
}

export function fDurationInHours(createdDate, interventionDate) {
  if (!createdDate || !interventionDate) return '';

  const startDate = new Date(createdDate);
  const endDate = new Date(interventionDate);

  const diffInMs = Math.abs(endDate - startDate);

  const hours = Math.floor(diffInMs / (1000 * 60 * 60));

  return `${hours}`;
}

export function fGetTimeFrom24HourFormat(dateTimeString) {
  if (!dateTimeString) return '';
  console.log({ dateTimeString });
  const date = new Date(dateTimeString);
  console.log({ date });
  return format(date, 'HH:mm', { locale: it });
}
