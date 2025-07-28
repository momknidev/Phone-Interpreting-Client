import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

// @mui
import { Grid, Typography, Card, CardContent, Chip, Box, Button } from '@mui/material';
import { Stack } from '@mui/system';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';

import { fDateTime } from '../../../../../utils/formatTime';
import Label from '../../../../../components/label';
import Iconify from '../../../../../components/iconify';
import {
  UPDATE_BOOKING,
  UPDATE_REQUEST_AND_BOOKING_STATUS,
  UPDATE_REQUEST_STATUS,
} from '../../../../../graphQL/mutations';
import { getRequestStatusColor } from '../../../../../utils/getRequestStatusColor';
import { UploadBox } from '../../../../../components/upload';

// ----------------------------------------------------------------------

Booking.propTypes = {
  bookingData: PropTypes.object,
  refetch: PropTypes.func,
};

export default function Booking({ bookingData, refetch }) {
  const { enqueueSnackbar } = useSnackbar();
  const [updateRequestStatus, { loading: loadingComplete }] = useMutation(UPDATE_REQUEST_STATUS);
  const [updateBooking, { loading: loadingBookingUpdate }] = useMutation(UPDATE_BOOKING);
  const [updateStatus, { loading }] = useMutation(UPDATE_REQUEST_AND_BOOKING_STATUS);
  const [formFile, setFormFile] = useState(null);
  // const validStatuses = ['pending', 'accepted', 'refused', 'confirmed'];

  // Import Iconify component for icons
  const handleAcceptRequest = async (id) => {
    try {
      await updateStatus({
        variables: {
          requestID: bookingData?.requestId,
          requestStatus: 'Accettato dal mediatore',
          bookingID: id,
          bookingStatus: 'Accettato',
        },
      });
      refetch();
      enqueueSnackbar('Richiesta Accettata', {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(error?.message, {
        variant: 'error',
      });
    }
  };

  const handleDeclineRequest = async (id) => {
    try {
      await updateStatus({
        variables: {
          requestID: bookingData?.requestId,
          requestStatus: 'Rifiutato dal mediatore',
          bookingID: id,
          bookingStatus: 'Rifiutato',
        },
      });
      enqueueSnackbar('Richiesta Rifiutato', {
        variant: 'error',
      });
      refetch();
    } catch (error) {
      enqueueSnackbar(error?.message, {
        variant: 'error',
      });
    }
  };
  console.log('formFile', formFile);
  const handleCompleteRequest = async (id) => {
    if (!formFile) {
      enqueueSnackbar('Carica il modulo firmato', {
        variant: 'error',
      });
      return;
    }
    try {
      await updateBooking({
        variables: {
          id,
          input: {
            status: 'Completato',
            notes: 'Richiesta Completata',
            form: formFile,
          },
        },
      }).then(async () => {
        await updateRequestStatus({
          variables: {
            requestID: bookingData?.requestId,
            requestStatus: 'Completato',
          },
        });
        enqueueSnackbar('Richiesta Rifiutato', {
          variant: 'error',
        });
        refetch();
      });
    } catch (error) {
      enqueueSnackbar(error?.message, {
        variant: 'error',
      });
    }
  };
  const handleDropForm = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      setFormFile(newFile);
    }
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          {bookingData?.status === 'Inviato' && (
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ my: 2 }}>
                <LoadingButton
                  variant="contained"
                  color="success"
                  loading={loading}
                  startIcon={<Iconify icon="mdi:check-circle-outline" />}
                  onClick={() => handleAcceptRequest(bookingData?.id)}
                >
                  Accetta Richiesta
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  color="error"
                  loading={loading}
                  startIcon={<Iconify icon="mdi:cancel-outline" />}
                  onClick={() => handleDeclineRequest(bookingData?.id)}
                >
                  Rifiuta Richiesta
                </LoadingButton>
              </Stack>
            </Grid>
          )}
          <Grid item xs={12}>
            {bookingData?.status === 'Assegnato' && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 2,
                  flexDirection: 'column',
                  p: 2,
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                  Carica il documento firmato per completare la richiesta
                </Typography>
                <UploadBox
                  name="form"
                  onDrop={handleDropForm}
                  placeholder={
                    <Stack spacing={0.5} alignItems="center">
                      <Iconify icon="eva:cloud-upload-fill" width={40} />
                      {formFile ? (
                        <Typography variant="body2">{formFile?.name}</Typography>
                      ) : (
                        <Typography variant="body2">Carica Modulo</Typography>
                      )}
                    </Stack>
                  }
                  sx={{ flexGrow: 1, width: 300, height: '90%', mb: 3 }}
                />
                <Stack direction="row" spacing={2} justifyContent="center">
                  <LoadingButton
                    color="success"
                    variant="contained"
                    disabled={!formFile}
                    onClick={() => handleCompleteRequest(bookingData?.id)}
                    loading={loadingBookingUpdate}
                  >
                    Upload Document and Mark as Complete
                  </LoadingButton>
                </Stack>
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Stack direction="column" spacing={1}>
                <Typography variant="h5">Richiesta #{bookingData?.request?.requestId}</Typography>
                <Label color={getRequestStatusColor(bookingData?.status)} sx={{ ml: 1 }}>
                  {bookingData?.status}
                </Label>
              </Stack>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Data di Creazione: {fDateTime(Number(bookingData?.created_at))}
            </Typography>
          </Grid>

          {/* Patient Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Informazioni Paziente
            </Typography>
            <Typography variant="body2">
              Nome: {bookingData?.request?.applicantFirstName}{' '}
              {bookingData?.request?.applicantLastName}
            </Typography>
            <Typography variant="body2">Email: {bookingData?.request?.applicantEmail}</Typography>
            <Typography variant="body2">
              Telefono: {bookingData?.request?.applicantPhone}
            </Typography>
            {bookingData?.request?.applicantOtherEmail && (
              <Typography variant="body2">
                Email Alternativa: {bookingData?.request?.applicantOtherEmail}
              </Typography>
            )}
          </Grid>

          {/* Request Details */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Dettagli Richiesta
            </Typography>
            <Typography variant="body2">Cliente: {bookingData?.request?.customer}</Typography>
            <Typography variant="body2">
              Struttura/Indirizzo: {bookingData?.request?.structurePavilionAddress}
            </Typography>
            <Typography variant="body2">Piano: {bookingData?.request?.plan}</Typography>
          </Grid>

          {/* Intervention Details */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Dettagli Intervento
            </Typography>
            <Typography variant="body2">
              Data di Intervento:{' '}
              {fDateTime(new Date(bookingData?.request?.dateOfIntervention).getTime())}
            </Typography>
            <Typography variant="body2">
              Consegna Prevista: {fDateTime(Number(bookingData?.deliveryDate))}
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Lingue:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
              <Chip label={bookingData?.request?.targetLanguage} size="small" />
            </Stack>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Motivazione: {bookingData?.request?.motivation}
            </Typography>
          </Grid>

          {/* Service Details */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Informazioni Servizio
            </Typography>
            <Typography variant="body2">Durata: {bookingData?.minutes} minuti</Typography>
            <Typography variant="body2">Importo: €{bookingData?.amount}</Typography>
            <Typography variant="body2">Lingua: {bookingData?.language}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Informazioni Aggiuntive
            </Typography>
            <Typography variant="body2">
              Note Sul Paziente: {bookingData?.request?.patientIndication}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Note Richiesta: {bookingData?.request?.notes}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Note Prenotazione: {bookingData?.notes}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
