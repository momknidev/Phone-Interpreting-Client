import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell, Link } from '@mui/material';
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
    mediator,
    caller_phone,
    caller_code,
    source_language,
    target_language,
    phone_mediation_no,
    status,
    mediation_date,
    mediation_duration,
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
      <TableCell align="center">
        <Link onClick={() => onViewRow()} color="primary" sx={{ cursor: 'pointer' }}>
          {phone_mediation_no}
        </Link>
      </TableCell>
      <TableCell align="center">
        {source_language}
        {'<=>'}
        {target_language}
      </TableCell>
      <TableCell align="center">{mediation_duration} Min</TableCell>

      <TableCell align="center">{mediator} </TableCell>

      <TableCell align="center">{fDateTime(created_at)}</TableCell>
      <TableCell align="center">{fDateTime(mediation_duration)}</TableCell>
      <TableCell align="center">{fCurrency(amount)}</TableCell>
      <TableCell align="center">
        <Label variant="soft" color={labelColor} sx={{ textTransform: 'capitalize' }}>
          {status}
        </Label>
      </TableCell>
    </TableRow>
  );
}
