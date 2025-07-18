import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  Stack,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';

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
import {
  MediatorTableToolbar,
  MediatorTableRow,
} from '../../sections/@dashboard/client/mediator/list';
import { MEDIATORS_PAGINATED_LIST } from '../../graphQL/queries';
import { DELETE_MEDIATOR, UPLOAD_MEDIATOR_FILE } from '../../graphQL/mutations';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'firstName', label: 'Mediator', align: 'left' },
  { id: '', label: 'Email', align: 'left' },
  { id: '', label: 'Phone No.', align: 'left' },
  { id: '', label: 'Groups.', align: 'left' },
  { id: '', label: 'Languages', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function MediatorListPage() {
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
    defaultRowsPerPage: 20,
    defaultOrderBy: 'firstName',
    defaultOrder: 'asc',
  });
  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteMediator, { loading: loadingDelete }] = useMutation(DELETE_MEDIATOR);
  const [uploadMediatorFile, { loading: loadingUpload }] = useMutation(UPLOAD_MEDIATOR_FILE); // New mutation for file upload

  const [filterName, setFilterName] = useState('');
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // Store selected file

  const { loading, data, error, refetch } = useQuery(MEDIATORS_PAGINATED_LIST, {
    variables: {
      offset: page,
      limit: rowsPerPage,
      order,
      orderBy,
      name: filterName,
    },
    fetchPolicy: 'no-cache',
  });

  const handleDeleteRow = async (id) => {
    try {
      await deleteMediator({
        variables: { id },
      });
      refetch();
      // eslint-disable-next-line no-shadow
    } catch (error) {
      console.error('Error deleting mediator:', error);
      enqueueSnackbar(`Error: ${error?.message}`, { variant: 'error' });
    }
  };

  const handleUploadFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      enqueueSnackbar('Please select a file to upload.', { variant: 'error' });
      return;
    }

    try {
      // Call the uploadMediatorFile mutation to upload the file
      await uploadMediatorFile({
        variables: { file: selectedFile },
      });
      enqueueSnackbar('File uploaded successfully!', { variant: 'success' });
      refetch();
      setOpenUploadDialog(false); // Close the dialog after success
      // eslint-disable-next-line no-shadow
    } catch (error) {
      enqueueSnackbar(`Error: ${error.message}`, { variant: 'error' });
    }
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.mediator.view(id));
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.mediator.edit(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
  };

  if (error) {
    return `Error: ${error?.message}`;
  }

  return (
    <>
      <Helmet>
        <title> Mediator: List | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Mediators List"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.clientDashboard }, { name: 'List' }]}
          action={
            <Stack spacing={1} direction="row" flexShrink={0} justifyContent="flex-end">
              <Button
                component={RouterLink}
                to={PATH_DASHBOARD.mediator.new}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New Mediator
              </Button>
              <IconButton
                color="primary"
                onClick={() => setOpenUploadDialog(true)} // Open the dialog on click
              >
                <Iconify icon="eva:cloud-upload-fill" />
              </IconButton>
            </Stack>
          }
        />
        <MediatorTableToolbar
          filterName={filterName}
          onFilterName={handleFilterName}
          onResetFilter={handleResetFilter}
        />
        <Card sx={{ pt: 1 }}>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={data?.mediatorsPaginatedList?.mediators?.length || 0}
                  onSort={onSort}
                />
                <TableBody>
                  {!data && !error && loading && (
                    <>
                      <TableSkeleton />
                      <TableSkeleton />
                      <TableSkeleton />
                      <TableSkeleton />
                    </>
                  )}
                  {data &&
                    !error &&
                    !loading &&
                    data?.mediatorsPaginatedList?.mediators?.map((row) => (
                      <MediatorTableRow
                        key={row.id}
                        row={row}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        loadingDelete={loadingDelete}
                      />
                    ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={data?.mediatorsPaginatedList?.filteredCount || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      {/* Upload File Dialog */}
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)}>
        <DialogTitle>Upload Mediator File</DialogTitle>
        <DialogContent>
          <input
            accept=".csv, .xlsx"
            type="file"
            onChange={handleUploadFileChange}
            style={{ marginBottom: 16 }}
          />
          {loadingUpload && <CircularProgress />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUploadFile} color="primary" disabled={loadingUpload}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
