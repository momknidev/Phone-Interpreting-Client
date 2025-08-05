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
import * as XLSX from 'xlsx'; // Import xlsx library for exporting Excel files

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
} from '../../sections/@dashboard/client/interpreter/list';
import { MEDIATORS_PAGINATED_LIST } from '../../graphQL/queries';
import { DELETE_MEDIATOR, UPLOAD_MEDIATOR_FILE } from '../../graphQL/mutations';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'first_name', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phone', label: 'Phone No.', align: 'left' },
  { id: '', label: 'Groups', align: 'left' },
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
    defaultOrderBy: 'first_name',
    defaultOrder: 'asc',
  });
  const { themeStretch, phone } = useSettingsContext();

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
      phone_number: phone,
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
      console.error('Error deleting interpreter:', error);
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
        variables: { file: selectedFile, phone_number: phone },
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
    navigate(PATH_DASHBOARD.interpreter.view(id));
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.interpreter.edit(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
  };

  // Export data to Excel
  const exportToExcel = () => {
    if (!data) {
      enqueueSnackbar('No data to export', { variant: 'warning' });
      return;
    }

    const tableData = data?.mediatorsPaginatedList?.mediators?.map((row) => ({
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      phone: row.phone,
      iban: row.iban,
      sourceLanguages: row.sourceLanguages
        ?.map((item) => item?.sourceLanguage?.language_name)
        ?.join(','),
      targetLanguages: row.targetLanguages
        ?.map((item) => item?.targetLanguage?.language_name)
        ?.join(','),
      groups: row?.groups?.map((item) => item?.group?.group_name)?.join(','),
      monday_time_slots: row.monday_time_slots,
      tuesday_time_slots: row.tuesday_time_slots,
      wednesday_time_slots: row.wednesday_time_slots,
      thursday_time_slots: row.thursday_time_slots,
      friday_time_slots: row.friday_time_slots,
      saturday_time_slots: row.saturday_time_slots,
      sunday_time_slots: row.sunday_time_slots,
      availableForEmergencies: row.availableForEmergencies,
      availableOnHolidays: row.availableOnHolidays,
      priority: row.priority,
    }));

    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Interpreters');

    // Save the file
    XLSX.writeFile(wb, 'Mediators_List.xlsx');
  };

  if (error) {
    return `Error: ${error?.message}`;
  }

  return (
    <>
      <Helmet>
        <title> Interpreter: List | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Interpreters List"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.clientDashboard }, { name: 'List' }]}
          action={
            <Stack spacing={1} direction="row" flexShrink={0} justifyContent="flex-end">
              <Button
                component={RouterLink}
                to={PATH_DASHBOARD.interpreter.new}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New Interpreter
              </Button>

              <Button
                variant="contained"
                startIcon={<Iconify icon="file-icons:microsoft-excel" />}
                onClick={exportToExcel}
              >
                Export to Excel
              </Button>
              <IconButton color="primary" onClick={() => setOpenUploadDialog(true)}>
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
        <DialogTitle>Upload Interpreter File</DialogTitle>
        <DialogContent>
          <input
            accept=".csv, .xlsx"
            type="file"
            onChange={handleUploadFileChange}
            style={{ marginBottom: 16 }}
          />
          {loadingUpload && <CircularProgress />}
          <div style={{ marginTop: 16 }}>
            <a
              href="/assets/Mediators_Upload_Sample_Document.xlsx"
              download
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline', color: '#1976d2' }}
            >
              Download Sample File
            </a>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUploadFile}
            color="primary"
            disabled={loadingUpload}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
