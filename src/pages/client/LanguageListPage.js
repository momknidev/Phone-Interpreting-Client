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
  Autocomplete,
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
import { LANGUAGES } from '../../graphQL/queries';
import { CREATE_LANGUAGE, UPDATE_LANGUAGE, DELETE_LANGUAGE } from '../../graphQL/mutations';
import Iconify from '../../components/iconify';
import { fDateTime } from '../../utils/formatTime';
import { languages as languagesOptions } from '../../_mock/languages';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'language_code', label: 'Language Code', align: 'center' },
  { id: 'language_name', label: 'Language Name', align: 'center' },
  { id: 'updated_at', label: 'Update Date', align: 'center' },
  { id: '', label: 'Actions', align: 'center' },
];

// ----------------------------------------------------------------------

export default function LanguageListPage() {
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
    defaultOrderBy: 'language_code',
    defaultOrder: 'asc',
    defaultRowsPerPage: 25,
    defaultDense: false,
  });

  const { themeStretch, phone } = useSettingsContext();
  const [search, setSearch] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState({ language_code: '', language_name: '' });
  const [isEditing, setIsEditing] = useState(false);

  const [createLanguage, { loading: createLoading }] = useMutation(CREATE_LANGUAGE);
  const [updateLanguage, { loading: editLoading }] = useMutation(UPDATE_LANGUAGE);
  const [deleteLanguage, { loading: deleteLoading }] = useMutation(DELETE_LANGUAGE);

  const { loading, data, error, refetch } = useQuery(LANGUAGES, {
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

  const handleOpenDialog = (language = null) => {
    if (language) {
      setCurrentLanguage(language);
      setIsEditing(true);
    } else {
      setCurrentLanguage({ language_code: '', language_name: '' });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentLanguage({ language_code: '', language_name: '' });
    setIsEditing(false);
  };

  const handleOpenDeleteDialog = (language) => {
    setCurrentLanguage(language);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentLanguage({ language_code: '', language_name: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLanguage({ ...currentLanguage, [name]: value });
  };

  const handleLanguageNameChange = (event, newValue) => {
    setCurrentLanguage({ ...currentLanguage, language_name: newValue || '' });
  };

  const handleSaveLanguage = async () => {
    try {
      if (isEditing) {
        await updateLanguage({
          variables: {
            id: currentLanguage.id,
            input: {
              phone_number: phone,
              language_code: Number(currentLanguage.language_code),
              language_name: currentLanguage.language_name,
            },
          },
        });
        enqueueSnackbar('Language updated successfully', { variant: 'success' });
      } else {
        await createLanguage({
          variables: {
            input: {
              phone_number: phone,

              language_code: Number(currentLanguage.language_code),
              language_name: currentLanguage.language_name,
            },
          },
        });
        enqueueSnackbar('Language created successfully', { variant: 'success' });
      }
      handleCloseDialog();
      refetch();
    } catch (err) {
      console.error('Error while saving the language:', err);
      enqueueSnackbar('Error while saving the language', {
        variant: 'error',
      });
    }
  };

  const handleDeleteLanguage = async () => {
    try {
      await deleteLanguage({
        variables: {
          id: currentLanguage.id,
        },
      });
      enqueueSnackbar('Language deleted successfully', { variant: 'success' });
      handleCloseDeleteDialog();
      refetch();
    } catch (err) {
      console.error('Error while deleting the language:', err);
      enqueueSnackbar('Error while deleting the language', {
        variant: 'error',
      });
    }
  };

  if (error) {
    return `Error: ${error?.message}`;
  }

  const languages = data?.languages?.languages || [];
  const isNotFound = !languages.length && !loading;

  return (
    <>
      <Helmet>
        <title> Language List | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Language List"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.mediatorDashboard,
            },
            { name: 'Languages' },
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
                New Language
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
                    languages.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell align="center">{row.language_code}</TableCell>
                        <TableCell align="center">{row.language_name}</TableCell>
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
                      {search ? 'No results found' : 'No languages available'}
                    </TableNoData>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={data?.languages?.filteredCount || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      {/* Create/Edit Language Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Language' : 'New Language'}</DialogTitle>

        <DialogContent>
          <Typography sx={{ pb: 3 }}>
            {isEditing
              ? 'Edit the details of the selected language.'
              : 'Enter the details of the new language.'}
          </Typography>
          <TextField
            autoFocus
            type="number"
            margin="dense"
            name="language_code"
            label="Language Code"
            fullWidth
            variant="outlined"
            value={currentLanguage.language_code}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <Autocomplete
            options={languagesOptions.map((option) => option.text)}
            value={currentLanguage.language_name}
            onChange={handleLanguageNameChange}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                label="Language Name"
                fullWidth
                variant="outlined"
              />
            )}
            sx={{ mb: 2 }}
            freeSolo
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={createLoading || editLoading} onClick={handleCloseDialog}>
            Cancel
          </LoadingButton>
          <LoadingButton
            loading={createLoading || editLoading}
            onClick={handleSaveLanguage}
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
            Are you sure you want to delete the language {currentLanguage.language_name}? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <LoadingButton
            loading={deleteLoading}
            onClick={handleDeleteLanguage}
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
