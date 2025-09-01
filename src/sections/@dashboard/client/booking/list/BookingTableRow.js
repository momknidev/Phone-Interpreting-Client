import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell } from '@mui/material';
// components
import Label from '../../../../../components/label';
import { fDateTime } from '../../../../../utils/formatTime';
// import { fCurrency } from '../../../../../utils/formatNumber';

// ----------------------------------------------------------------------

BookingTableRow.propTypes = {
  row: PropTypes.object,
  // onEditRow: PropTypes.func,
  // onViewRow: PropTypes.func,
};

export default function BookingTableRow({ row }) {
  const {
    // id,
    interpreter,
    caller_phone,
    client_code,
    source_language,
    target_language,
    serial_no,
    status,
    call_duration,
    // amount,
    created_at,
    used_credits,
  } = row;

  const statusColorMap = {
    Completed: 'success',
    Pending: 'warning',
    Cancelled: 'error',
  };
  const labelColor = statusColorMap[status] || 'default';

  return (
    <TableRow hover>
      <TableCell align="center">{serial_no}</TableCell>
      <TableCell align="center">{client_code}</TableCell>
      <TableCell align="center">{caller_phone}</TableCell>

      <TableCell align="center">
        {source_language ? <span>{`${source_language} ↔ ${target_language ?? ''}`}</span> : ''}
      </TableCell>
      <TableCell align="center">
        {call_duration > 0 ? `${Math.ceil(call_duration / 60)} Min` : '-'}
      </TableCell>

      <TableCell align="center">{interpreter} </TableCell>

      <TableCell align="center">{fDateTime(created_at)}</TableCell>
      <TableCell align="center">{used_credits}</TableCell>
      <TableCell align="center">
        <Label variant="soft" color={labelColor} sx={{ textTransform: 'capitalize' }}>
          {status}
        </Label>
      </TableCell>
    </TableRow>
  );
}
