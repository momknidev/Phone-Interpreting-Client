import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { useMutation } from '@apollo/client';

import { PATH_DASHBOARD } from '../../routes/paths';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import Iconify from '../../components/iconify';

import SourceLanguages from '../../sections/@dashboard/client/languages/sourceLanguages';
import TargetLanguages from '../../sections/@dashboard/client/languages/targetLanguages';
import { SYNC_TARGET_LANGUAGES, SYNC_SOURCE_LANGUAGES } from '../../graphQL/mutations';

export default function LanguageListPage() {
  const { themeStretch, phone } = useSettingsContext();
  const [syncTargetLanguages] = useMutation(SYNC_TARGET_LANGUAGES);
  const [syncSourceLanguages] = useMutation(SYNC_SOURCE_LANGUAGES);

  const [refreshKey, setRefreshKey] = useState(0);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [syncType, setSyncType] = useState();

  const handleOpenDialog = (type) => {
    setSyncType(type);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSyncType(null);
  };

  const handleConfirmSync = async () => {
    if (syncType === 'target') {
      await syncTargetLanguages({ variables: { phoneNumber: phone } });
    } else if (syncType === 'source') {
      await syncSourceLanguages({ variables: { phoneNumber: phone } });
    }
    setRefreshKey((prev) => prev + 1);
    handleCloseDialog();
  };

  return (
    <>
      <Helmet>
        <title>Language Management | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Language Management"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.mediatorDashboard },
            { name: 'Languages' },
          ]}
        />

        <Grid container spacing={2}>
          <Grid item xs={12} md={5.5}>
            <SourceLanguages refreshKey={refreshKey} />
          </Grid>

          <Grid item xs={12} md={1}>
            <Stack alignItems="center" justifyContent="center" height="100%">
              <Tooltip title="Sync target languages with source language table">
                <IconButton onClick={() => handleOpenDialog('target')}>
                  <Iconify icon="mdi:arrow-right-bold" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Sync source languages with target language table">
                <IconButton onClick={() => handleOpenDialog('source')}>
                  <Iconify icon="mdi:arrow-left-bold" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>

          <Grid item xs={12} md={5.5}>
            <TargetLanguages refreshKey={refreshKey} />
          </Grid>
        </Grid>
      </Container>

      {/* MUI Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Sync</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to sync{' '}
            <strong>
              {syncType === 'target'
                ? 'target languages from source languages'
                : 'source languages from target languages'}
            </strong>
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmSync}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
