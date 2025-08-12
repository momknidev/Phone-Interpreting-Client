import { Helmet } from 'react-helmet-async';

import { useState } from 'react';
// @mui
import {
  Stack,
  Typography,
  Container,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { LoadingButton } from '@mui/lab';

// locales
// components
import { useAuthContext } from '../../auth/useAuthContext';
import { useSettingsContext } from '../../components/settings';
import SvgColor from '../../components/svg-color';
// components
// sections
import { AppWelcome } from '../../sections/@dashboard/client/dashboard';
// assets
import { NoPhoneSelected } from './CallReportPage';
import { REQUEST_NUMBER } from '../../graphQL/mutations';
// ----------------------------------------------------------------------

export default function DashboardPage() {
  const { user } = useAuthContext();

  const { themeStretch, phone } = useSettingsContext();
  if (!phone) {
    return <NoPhoneSelected />;
  }
  return (
    <>
      <Helmet>
        <title>Client Dashboard | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <AppWelcome
              title={`Welcome! \n ${user?.first_name || ' '} ${user?.last_name || ''}`}
              action={
                <Stack sx={{ py: 3 }}>
                  <PhonePopover />
                </Stack>
              }
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

export function PhonePopover() {
  const [submitRequest, { loading }] = useMutation(REQUEST_NUMBER);
  const { user } = useAuthContext();
  const { phone, onChangePhone } = useSettingsContext();
  console.log({ phone });
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
                // borderColor: (theme) => theme.palette.primary.main,
                // color: (theme) => theme.palette.primary.main,
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
              key={item.phone}
              value={item.phone}
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
