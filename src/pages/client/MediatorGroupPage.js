import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
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
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  DialogContentText,
  Link,
} from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { LoadingButton } from '@mui/lab';
import { Link as RouterLink } from 'react-router-dom';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  TableHeadCustom,
  TablePaginationCustom,
  TableSkeleton,
} from '../../components/table';
// sections
import { UserTableToolbar } from '../../sections/@dashboard/admin/client/list';
import { GROUPS_PAGINATED_LIST } from '../../graphQL/queries';
import { ADD_GROUP, EDIT_GROUP, DELETE_MEDIATOR_GROUP } from '../../graphQL/mutations';
import Label from '../../components/label';
import { NoPhoneSelected } from './CallReportPage';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'group', label: 'Group', align: 'left' },
  { id: 'mediatorCount', label: 'Interpreter Counts', align: 'center' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '', label: 'Action', align: 'left' },
];

// ----------------------------------------------------------------------

export default function MediatorGroupPage() {
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
    defaultRowsPerPage: 50,
  });
  const { themeStretch, phone } = useSettingsContext();

  const [filterName, setFilterName] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [group_name, setGroupName] = useState('');
  const [groupStatus, setGroupStatus] = useState('active');

  const { loading, data, error, refetch } = useQuery(GROUPS_PAGINATED_LIST, {
    variables: {
      offset: page,
      limit: rowsPerPage,
      order,
      orderBy,
      name: filterName,
      type: 'client',
      phone_number: phone,
    },
    fetchPolicy: 'no-cache',
  });

  const [addGroup, { loading: loadingCreate }] = useMutation(ADD_GROUP, {
    onCompleted: () => {
      refetch();
      handleCloseAddDialog();
    },
  });

  const [editGroup, { loading: loadingEdit }] = useMutation(EDIT_GROUP, {
    onCompleted: () => {
      refetch();
      handleCloseEditDialog();
    },
  });

  const [deleteGroup, { loading: deleteLoading }] = useMutation(DELETE_MEDIATOR_GROUP, {
    onCompleted: () => {
      refetch();
      handleCloseDeleteDialog();
    },
  });

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
  };

  const handleOpenAddDialog = () => {
    setGroupName('');
    setGroupStatus('active');
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (group) => {
    setCurrentGroup(group);
    setGroupName(group.group_name);
    setGroupStatus(group.status);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentGroup(null);
  };

  const handleOpenDeleteDialog = (group) => {
    setCurrentGroup(group);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentGroup(null);
  };

  const handleSubmitAdd = () => {
    addGroup({
      variables: {
        groupInput: {
          group_name,
          status: groupStatus,
          phone_number: phone,
        },
      },
    });
  };

  const handleSubmitEdit = () => {
    editGroup({
      variables: {
        id: currentGroup.id,
        groupInput: {
          group_name,
          status: groupStatus,
          phone_number: phone,
        },
      },
    });
  };

  const handleSubmitDelete = () => {
    deleteGroup({
      variables: {
        id: currentGroup.id,
      },
    });
  };
  if (!phone) {
    return <NoPhoneSelected />;
  }
  if (error) {
    return `Error: ${error?.message}`;
  }

  return (
    <>
      <Helmet>
        <title> Interpreter Groups | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Interpreter Groups"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Interpreter Groups' }]}
          action={
            <Stack direction="row" spacing={2} alignItems="center">
              <UserTableToolbar
                filterName={filterName}
                onFilterName={handleFilterName}
                onResetFilter={handleResetFilter}
              />
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleOpenAddDialog}
              >
                New Group
              </Button>
            </Stack>
          }
        />

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={data?.groupsPaginatedList?.groups?.length || 0}
                  onSort={onSort}
                />

                <TableBody>
                  {!data && !error && loading && (
                    <>
                      <TableSkeleton />
                      <TableSkeleton />
                      <TableSkeleton />
                    </>
                  )}

                  {data &&
                    !error &&
                    !loading &&
                    data?.groupsPaginatedList?.groups?.map((row) => (
                      <TableRow hover key={row.id}>
                        <TableCell sx={{ px: 1 }}>
                          <Link
                            component={RouterLink}
                            to={PATH_DASHBOARD.interpreter.groupDetail(row?.id)}
                            sx={{
                              color: 'text.primary',
                              textDecoration: 'none',
                              '&:hover': { color: 'text.primary', textDecoration: 'underline' },
                              '&:active': { color: 'text.primary', textDecoration: 'underline' },
                            }}
                          >
                            <Typography variant="subtitle2" noWrap>
                              {`${row?.group_name} `}
                            </Typography>
                          </Link>
                        </TableCell>
                        <TableCell sx={{ px: 1 }} align="center">
                          <Typography variant="subtitle2" noWrap>
                            {`${row?.mediatorCount} `}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ px: 1 }} align="left">
                          <Label color={row?.status === 'active' ? 'success' : 'error'}>
                            {row?.status}
                          </Label>
                        </TableCell>
                        <TableCell sx={{ px: 1 }} align="left">
                          <Stack direction="row" spacing={1}>
                            <IconButton color="primary" onClick={() => handleOpenEditDialog(row)}>
                              <Iconify icon="eva:edit-fill" />
                            </IconButton>

                            <IconButton color="error" onClick={() => handleOpenDeleteDialog(row)}>
                              <Iconify icon="eva:trash-2-fill" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={data?.groupsPaginatedList?.filteredCount || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      {/* Add Group Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add New Group</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Group Name"
              value={group_name}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={groupStatus}
                label="Status"
                onChange={(e) => setGroupStatus(e.target.value)}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={loadingCreate} onClick={handleCloseAddDialog} color="inherit">
            Cancel
          </LoadingButton>
          <LoadingButton
            loading={loadingCreate}
            onClick={handleSubmitAdd}
            variant="contained"
            disabled={!group_name}
          >
            Add
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Group</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Group Name"
              value={group_name}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={groupStatus}
                label="Status"
                onChange={(e) => setGroupStatus(e.target.value)}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={loadingEdit} onClick={handleCloseEditDialog} color="inherit">
            Cancel
          </LoadingButton>
          <LoadingButton
            loading={loadingEdit}
            onClick={handleSubmitEdit}
            variant="contained"
            disabled={!group_name}
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the group {currentGroup?.group_name}? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={deleteLoading} onClick={handleCloseDeleteDialog} color="inherit">
            Cancel
          </LoadingButton>
          <LoadingButton
            loading={deleteLoading}
            onClick={handleSubmitDelete}
            color="error"
            variant="contained"
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
