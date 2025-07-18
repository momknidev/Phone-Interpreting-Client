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
import { PAGINATED_USER_CODES } from '../../graphQL/queries';
import { CREATE_USER_CODE, UPDATE_USER_CODE, DELETE_USER_CODE } from '../../graphQL/mutations';
import Iconify from '../../components/iconify';
import { fDateTime } from '../../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'id', label: 'ID', align: 'center' },
  { id: 'user_name', label: 'User Name', align: 'center' },
  { id: 'user_code', label: 'User Code', align: 'center' },
  { id: 'updated_at', label: 'Update Date', align: 'center' },
  { id: '', label: 'Actions', align: 'center' },
];

// ----------------------------------------------------------------------

export default function UserCodeListPage() {
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
    defaultOrderBy: 'user_code',
    defaultOrder: 'asc',
    defaultRowsPerPage: 20,
    defaultDense: false,
  });

  const { themeStretch } = useSettingsContext();
  const [search, setSearch] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentUserCode, setCurrentUserCode] = useState({ user_code: '', user_name: '' });
  const [isEditing, setIsEditing] = useState(false);

  const [createUserCode, { loading: createLoading }] = useMutation(CREATE_USER_CODE);
  const [updateUserCode, { loading: editLoading }] = useMutation(UPDATE_USER_CODE);
  const [deleteUserCode, { loading: deleteLoading }] = useMutation(DELETE_USER_CODE);

  const { loading, data, error, refetch } = useQuery(PAGINATED_USER_CODES, {
    variables: {
      offset: page,
      limit: rowsPerPage,
      order,
      orderBy,
      search,
    },
    fetchPolicy: 'no-cache',
  });

  const handleSearch = (event) => {
    setPage(0);
    setSearch(event.target.value);
  };

  const handleOpenDialog = (userCode = null) => {
    if (userCode) {
      setCurrentUserCode(userCode);
      setIsEditing(true);
    } else {
      setCurrentUserCode({ user_code: '', user_name: '' });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUserCode({ user_code: '', user_name: '' });
    setIsEditing(false);
  };

  const handleOpenDeleteDialog = (userCode) => {
    setCurrentUserCode(userCode);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentUserCode({ user_code: '', user_name: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUserCode({ ...currentUserCode, [name]: value });
  };

  const handleSaveUserCode = async () => {
    try {
      if (isEditing) {
        await updateUserCode({
          variables: {
            id: currentUserCode.id,
            input: {
              user_code: Number(currentUserCode.user_code),
              user_name: currentUserCode.user_name,
            },
          },
        });
        enqueueSnackbar('User Code updated successfully', { variant: 'success' });
      } else {
        await createUserCode({
          variables: {
            input: {
              user_code: Number(currentUserCode.user_code),
              user_name: currentUserCode.user_name,
            },
          },
        });
        enqueueSnackbar('User Code created successfully', { variant: 'success' });
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

  const handleDeleteUserCode = async () => {
    try {
      await deleteUserCode({
        variables: {
          id: currentUserCode.id,
        },
      });
      enqueueSnackbar('User Code deleted successfully', { variant: 'success' });
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

  const userCodes = data?.userCodesPaginated?.userCodes || [];
  const isNotFound = !userCodes.length && !loading;

  return (
    <>
      <Helmet>
        <title> User Code List | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="User Code List"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.mediatorDashboard,
            },
            { name: 'User Codes' },
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
                New User Code
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
                  {loading && (
                    <>
                      <TableSkeleton />
                      <TableSkeleton />
                      <TableSkeleton />
                      <TableSkeleton />
                    </>
                  )}

                  {!loading &&
                    userCodes.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell align="center">{row.user_code}</TableCell>
                        <TableCell align="center">{row.user_name}</TableCell>

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
            count={data?.userCodesPaginated?.filteredCount || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      {/* Create/Edit User Code Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{isEditing ? 'Edit User Code' : 'New User Code'}</DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              pb: 3,
            }}
          >
            {isEditing
              ? 'Edit the details of the selected user code.'
              : 'Enter the details of the new user code.'}
          </Typography>
          <TextField
            autoFocus
            type="number"
            margin="dense"
            name="user_code"
            label="User Code Code"
            fullWidth
            variant="outlined"
            value={currentUserCode.user_code}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="user_name"
            label="User Code Name"
            fullWidth
            variant="outlined"
            value={currentUserCode.user_name}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={createLoading || editLoading} onClick={handleCloseDialog}>
            Cancel
          </LoadingButton>
          <LoadingButton
            loading={createLoading || editLoading}
            onClick={handleSaveUserCode}
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
            Are you sure you want to delete the user code {currentUserCode.user_name}? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <LoadingButton
            loading={deleteLoading}
            onClick={handleDeleteUserCode}
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
