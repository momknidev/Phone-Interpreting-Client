import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  TableBody,
  Container,
  TableContainer,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  TableRow,
  TableCell,
  Typography,
  Stack,
  InputAdornment,
} from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  TableHeadCustom,
  TablePaginationCustom,
  TableSkeleton,
  TableNoData,
} from '../../components/table';
// GraphQL
import { PAGINATED_CLIENT_CODES } from '../../graphQL/queries';
import {
  CREATE_CLIENT_CODE,
  UPDATE_CLIENT_CODE,
  DELETE_CLIENT_CODE,
} from '../../graphQL/mutations';
import Iconify from '../../components/iconify';
import { fDateTime } from '../../utils/formatTime';
import Label from '../../components/label';
import { NoPhoneSelected } from './CallReportPage';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'client_code', label: 'Client Code', align: 'center' },
  { id: 'code_label', label: 'Code Label', align: 'center' },

  { id: 'status', label: 'Status', align: 'center' },
  { id: 'updated_at', label: 'Update Date', align: 'center' },
  { id: '', label: 'Actions', align: 'center' },
];

// ----------------------------------------------------------------------

export default function ClientCodeListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'client_code',
    defaultOrder: 'asc',
    defaultRowsPerPage: 25,
    defaultDense: false,
  });

  const { themeStretch, phone } = useSettingsContext();
  const [search, setSearch] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentClientCode, setCurrentClientCode] = useState({
    client_code: '',
    code_label: '',
    status: 'active',
  });
  const [isEditing, setIsEditing] = useState(false);

  const [createClientCode, { loading: createLoading }] = useMutation(CREATE_CLIENT_CODE);
  const [updateClientCode, { loading: editLoading }] = useMutation(UPDATE_CLIENT_CODE);
  const [deleteClientCode, { loading: deleteLoading }] = useMutation(DELETE_CLIENT_CODE);

  const { loading, data, error, refetch } = useQuery(PAGINATED_CLIENT_CODES, {
    variables: {
      offset: page,
      limit: rowsPerPage,
      order,
      orderBy,
      search,
      phone_number: phone || '',
    },
    fetchPolicy: 'no-cache',
  });

  const handleSearch = (event) => {
    setPage(0);
    setSearch(event.target.value);
  };

  const handleOpenDialog = (ClientCode = null) => {
    if (ClientCode) {
      setCurrentClientCode(ClientCode);
      setIsEditing(true);
    } else {
      setCurrentClientCode({ client_code: '', code_label: '', status: 'active' });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentClientCode({ client_code: '', code_label: '', status: 'active' });
    setIsEditing(false);
  };

  const handleOpenDeleteDialog = (ClientCode) => {
    setCurrentClientCode(ClientCode);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentClientCode({ client_code: '', code_label: '', status: 'active' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentClientCode((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClientCode = async () => {
    try {
      if (!currentClientCode.client_code || !currentClientCode.code_label) {
        enqueueSnackbar('Please input data in fields', { variant: 'error' });
        return;
      }
      if (isNaN(currentClientCode.client_code) || Number(currentClientCode.client_code) < 0) {
        enqueueSnackbar('Client code must be a non-negative number', { variant: 'error' });
        return;
      }
      if (isEditing) {
        await updateClientCode({
          variables: {
            id: currentClientCode.id,
            input: {
              client_code: Number(currentClientCode.client_code),
              code_label: currentClientCode.code_label,
              status: currentClientCode.status,
              phone_number: phone,
            },
          },
        });
        enqueueSnackbar('Client Code updated successfully', { variant: 'success' });
      } else {
        await createClientCode({
          variables: {
            input: {
              client_code: Number(currentClientCode.client_code),
              code_label: currentClientCode.code_label,
              status: currentClientCode.status,
              phone_number: phone,
            },
          },
        });
        enqueueSnackbar('Client Code created successfully', { variant: 'success' });
      }
      handleCloseDialog();
      refetch();
    } catch (err) {
      console.error('Error while saving the user code:', err);
      enqueueSnackbar('Error while saving the user code', {
        variant: 'error',
      });
    }
  };

  const handleDeleteClientCode = async () => {
    try {
      await deleteClientCode({
        variables: {
          id: currentClientCode.id,
        },
      });
      enqueueSnackbar('Client Code deleted successfully', { variant: 'success' });
      handleCloseDeleteDialog();
      refetch();
    } catch (err) {
      console.error('Error while deleting the user code:', err);
      enqueueSnackbar('Error while deleting the user code', {
        variant: 'error',
      });
    }
  };

  if (error) {
    return `Error: ${error?.message}`;
  }

  const ClientCodes = data?.clientCodesPaginated?.clientCodes || [];
  const isNotFound = !ClientCodes.length && !loading;
  if (!phone) {
    return <NoPhoneSelected />;
  }
  return (
    <>
      <Helmet>
        <title> Client Codes | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Client Codes"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.mediatorDashboard,
            },
            { name: 'Client Codes' },
          ]}
          action={
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                startIcon={<Iconify icon="ic:round-plus" />}
                onClick={() => handleOpenDialog()}
              >
                New Client Code
              </Button>
            </Stack>
          }
        />

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                />

                <TableBody>
                  {loading && Array.from({ length: 4 }).map((_, i) => <TableSkeleton key={i} />)}

                  {!loading &&
                    ClientCodes.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell align="center">{row.client_code}</TableCell>
                        <TableCell align="center">{row.code_label}</TableCell>
                        <TableCell align="center">
                          <Label color={row?.status === 'active' ? 'success' : 'error'}>
                            {row.status === 'active' ? 'Active' : 'Inactive'}
                          </Label>
                        </TableCell>
                        <TableCell align="center">
                          {fDateTime(new Date(Number(row.updated_at)))}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => handleOpenDialog(row)} sx={{ mr: 1 }}>
                            <Iconify icon="ri:pencil-fill" />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleOpenDeleteDialog(row)}>
                            <Iconify icon="eva:trash-2-outline" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}

                  {isNotFound && (
                    <TableNoData>
                      {search ? 'No results found' : 'No user code available'}
                    </TableNoData>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={data?.clientCodesPaginated?.filteredCount || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Client Code' : 'New Client Code'}</DialogTitle>

        <DialogContent>
          <Typography sx={{ pb: 3 }}>
            {isEditing
              ? 'Edit the details of the selected user code.'
              : 'Enter the details of the new user code.'}
          </Typography>

          <TextField
            autoFocus
            type="number"
            margin="dense"
            name="client_code"
            label="Client Code"
            fullWidth
            variant="outlined"
            value={currentClientCode.client_code}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            name="code_label"
            label="Label"
            fullWidth
            variant="outlined"
            value={currentClientCode.code_label}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            select
            margin="dense"
            name="status"
            label="Status"
            fullWidth
            variant="outlined"
            value={currentClientCode.status}
            onChange={handleInputChange}
            SelectProps={{ native: true }}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </TextField>
        </DialogContent>

        <DialogActions>
          <LoadingButton loading={createLoading || editLoading} onClick={handleCloseDialog}>
            Cancel
          </LoadingButton>
          <LoadingButton
            loading={createLoading || editLoading}
            onClick={handleSaveClientCode}
            variant="contained"
          >
            {isEditing ? 'Update' : 'Save'}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the user code {currentClientCode.code_label}? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <LoadingButton
            loading={deleteLoading}
            onClick={handleDeleteClientCode}
            variant="contained"
            color="error"
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
