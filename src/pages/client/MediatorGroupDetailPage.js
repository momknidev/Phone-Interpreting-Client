import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import {
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  Stack,
  TableRow,
  TableCell,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  DialogContentText,
  Autocomplete,
  TextField,
  Skeleton,
} from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { LoadingButton } from '@mui/lab';
import { useParams } from 'react-router';
import { PATH_DASHBOARD } from '../../routes/paths';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableSkeleton } from '../../components/table';
import { GROUP_BY_ID, MEDIATOR_LIST_BASIC } from '../../graphQL/queries';
import { ADD_MEDIATOR_TO_GROUP, REMOVE_MEDIATOR_FROM_GROUP } from '../../graphQL/mutations';
import Label from '../../components/label';
import { fDate } from '../../utils/formatTime';

export default function MediatorGroupDetailPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { loading, data, error, refetch } = useQuery(GROUP_BY_ID, {
    variables: { groupByIdId: id },
    fetchPolicy: 'no-cache',
  });

  // For Add Mediator Dialog
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedMediator, setSelectedMediator] = useState('');
  const { data: allMediatorsData } = useQuery(MEDIATOR_LIST_BASIC);

  // For Remove Mediator Dialog
  const [openRemove, setOpenRemove] = useState(false);
  const [mediatorToRemove, setMediatorToRemove] = useState(null);

  // Mutations
  const [addMediatorToGroup, { loading: addLoading }] = useMutation(ADD_MEDIATOR_TO_GROUP);
  const [removeMediatorFromGroup, { loading: removeLoading }] = useMutation(
    REMOVE_MEDIATOR_FROM_GROUP
  );

  if (error) {
    return `Error: ${error?.message}`;
  }

  const group = data?.groupByID;

  const handleAddMediator = async () => {
    await addMediatorToGroup({
      variables: { groupId: id, mediatorId: selectedMediator },
    });
    setOpenAdd(false);
    setSelectedMediator('');
    refetch();
  };

  const handleRemoveMediator = async () => {
    await removeMediatorFromGroup({
      variables: { groupId: id, mediatorId: mediatorToRemove.id },
    });
    setOpenRemove(false);
    setMediatorToRemove(null);
    refetch();
  };

  if (loading) {
    return <Skeleton width="100%" height={300} />;
  }
  return (
    <>
      <Helmet>
        <title> Mediator Group Detail | Phone Mediation Application</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Mediator Groups"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Mediator Groups',
              href: PATH_DASHBOARD.mediator.group,
            },
            { name: group?.groupName || 'Group Detail' },
          ]}
        />
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5">{group?.groupName}</Typography>
          <Stack direction="row" spacing={2} mt={2}>
            <Label color={group?.status === 'active' ? 'success' : 'error'}>{group?.status}</Label>
            <Typography variant="body2">Created At: {fDate(group?.createdAt)}</Typography>
          </Stack>
        </Card>
        <Card>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
            <Typography variant="h6">Mediators</Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => setOpenAdd(true)}
            >
              Add Mediator
            </Button>
          </Stack>
          <TableContainer>
            <Table>
              <TableHeadCustom
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'actions', label: 'Actions' },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableSkeleton />
                ) : (
                  group?.mediators?.map((mediator) => (
                    <TableRow key={mediator.id}>
                      <TableCell>
                        {mediator.firstName} {mediator.lastName}
                      </TableCell>
                      <TableCell>{mediator.email}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setMediatorToRemove(mediator);
                            setOpenRemove(true);
                          }}
                        >
                          <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>

      {/* Remove Mediator Dialog */}
      <Dialog open={openRemove} onClose={() => setOpenRemove(false)}>
        <DialogTitle>Remove Mediator</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove mediator{' '}
            <b>
              {mediatorToRemove?.firstName} {mediatorToRemove?.lastName}
            </b>{' '}
            from this group?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRemove(false)}>Cancel</Button>
          <LoadingButton
            variant="contained"
            color="error"
            loading={removeLoading}
            onClick={handleRemoveMediator}
          >
            Remove
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Add Mediator Dialog with Autocomplete */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add Mediator to Group</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, minWidth: 300 }}>
            {/* Replace Select with Autocomplete */}
            <InputLabel shrink>Select Mediator</InputLabel>
            <Stack sx={{ mt: 2 }}>
              <Autocomplete
                options={allMediatorsData?.mediatorList || []}
                getOptionLabel={(option) =>
                  `${option.firstName} ${option.lastName} (${option.email})`
                }
                value={
                  allMediatorsData?.mediatorList?.find((m) => m.id === selectedMediator) || null
                }
                onChange={(_, newValue) => {
                  setSelectedMediator(newValue ? newValue.id : '');
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Mediator" variant="outlined" />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Stack>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <LoadingButton
            variant="contained"
            loading={addLoading}
            onClick={handleAddMediator}
            disabled={!selectedMediator}
          >
            Add
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
