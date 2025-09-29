import { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SvgColor from '../../../../components/svg-color';
import { useAuthContext } from '../../../../auth/useAuthContext';
import { useSettingsContext } from '../../../../components/settings';
import { REQUEST_NUMBER } from '../../../../graphQL/mutations';

export default function PhonePopover() {
  const [submitRequest, { loading }] = useMutation(REQUEST_NUMBER);
  const { user } = useAuthContext();
  const { phone, onChangePhone } = useSettingsContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [description, setDescription] = useState('');

  const handlePhoneChange = (event, newPhoneValue) => {
    if (newPhoneValue !== null && newPhoneValue !== 'btn') {
      onChangePhone(newPhoneValue);
    }
  };

  const handleRequestSubmit = async () => {
    await submitRequest({
      variables: {
        description,
      },
    });
    setDialogOpen(false);
    setDescription('');
  };

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <ToggleButtonGroup
          value={phone}
          exclusive
          color="primary"
          onChange={handlePhoneChange}
          aria-label="Client Phones"
          sx={{
            backgroundColor: 'transparent',
            border: 'none',
            gap: 1,
            '& .MuiToggleButton-root': {
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              backgroundColor: 'white',
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                border: '2px solid green',
                boxShadow: (theme) =>
                  `0 2px 8px ${theme.palette.primary.main}40, 0 4px 12px ${theme.palette.primary.main}20`,
              },
              '&:hover': {
                backgroundColor: (theme) => theme.palette.action.hover,
              },
            },
          }}
        >
          {user?.client_phones?.map((item) => (
            <ToggleButton
              key={item.id}
              value={item}
              sx={{
                textTransform: 'none',
              }}
            >
              <Stack direction="column" alignItems="center" spacing={0.5}>
                <Stack spacing={1} direction="row" alignItems="center">
                  <SvgColor
                    src="/assets/icons/navbar/ic_phone.svg"
                    sx={{ width: 16, height: 16 }}
                  />
                  <Typography variant="body2" noWrap>
                    {item.label}
                  </Typography>
                </Stack>
                <Typography variant="caption" noWrap>
                  {item.phone}
                </Typography>
              </Stack>
            </ToggleButton>
          ))}

          <ToggleButton
            value="btn"
            sx={{ textTransform: 'none' }}
            onClick={() => setDialogOpen(true)}
          >
            <Stack direction="column" alignItems="center" spacing={0.5}>
              <Stack spacing={1} direction="row" alignItems="center">
                <SvgColor
                  src="/assets/icons/navbar/carbon--add-filled.svg"
                  sx={{ width: 16, height: 16 }}
                />
                <Typography variant="body2" noWrap>
                  Request A Number
                </Typography>
              </Stack>
            </Stack>
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Request Number Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Request a New Phone Number</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={loading} onClick={() => setDialogOpen(false)}>
            Cancel
          </LoadingButton>
          <LoadingButton
            variant="contained"
            onClick={handleRequestSubmit}
            loading={loading}
            disabled={!description}
          >
            Submit Request
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
