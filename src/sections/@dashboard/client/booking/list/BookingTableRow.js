import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell } from '@mui/material';
// components
import Label from '../../../../../components/label';
import { fDateTime } from '../../../../../utils/formatTime';
import { fCurrency } from '../../../../../utils/formatNumber';

// ----------------------------------------------------------------------

BookingTableRow.propTypes = {
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
};

export default function BookingTableRow({ row, onEditRow, onViewRow }) {
  const {
    // id,
    interpreter,
    // caller_phone,
    // caller_code,
    source_language,
    target_language,
    serial_no,
    status,
    // call_date,
    call_duration,
    amount,
    created_at,
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
      <TableCell align="center">
        {source_language} &hArr; {target_language}
      </TableCell>
      <TableCell align="center">{call_duration} Min</TableCell>

      <TableCell align="center">{interpreter} </TableCell>

      <TableCell align="center">{fDateTime(created_at)}</TableCell>
      {/* <TableCell align="center">{fDateTime(call_duration)}</TableCell> */}
      <TableCell align="center">{fCurrency(amount)}</TableCell>
      <TableCell align="center">
        <Label variant="soft" color={labelColor} sx={{ textTransform: 'capitalize' }}>
          {status}
        </Label>
      </TableCell>
    </TableRow>
  );
}
