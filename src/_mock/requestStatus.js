// _mock/requestStatus.js

// Request status constants
// export const REQUEST_STATUS = [
//   'New',
//   'waiting_for_allocation',
//   'allocated',
//   'completed',
//   'cancelled',
// ];

export const REQUEST_STATUS = [
  'Da prendere in carico', // To be taken care of
  'In attesa di Risposta dal mediatore', // Waiting for answer
  'Accettato dal mediatore', // Accepted
  'Rifiutato dal mediatore', // Refused
  'Preso in carico', // Sent to translator
  'Completato', // Completed
  'Cancellato', // Cancelled
  'Cancellato - Da rendicontare', // Cancelled to be paid
];

export const BOOKING_STATUS = [
  'Inviato', // Sent
  'Accettato', // Accepted
  'Rifiutato', // Refused
  'Cancellato – Da rendicontare', // Cancelled to be payed
  // add request for allocated status
  'Assegnato', // Allocated
  'Completato', // Completed,
  'Cancellato', // Cancelled
];
