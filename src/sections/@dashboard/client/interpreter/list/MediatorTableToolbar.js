import PropTypes from 'prop-types';
// @mui
import { Stack, InputAdornment, TextField } from '@mui/material';
// components
import Iconify from '../../../../../components/iconify';

// ----------------------------------------------------------------------

MediatorTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function MediatorTableToolbar({ filterName, onFilterName }) {
  return (
    <Stack
      spacing={2}
      // alignItems="center"
      // justifyContent="end"
      // direction={{
      //   xs: 'column',
      //   sm: 'row',
      // }}
      // sx={{ px: 2.5, py: 3 }}
    >
      <TextField
        sx={{
          maxWidth: 300,
        }}
        fullWidth
        size="small"
        value={filterName}
        onChange={onFilterName}
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
