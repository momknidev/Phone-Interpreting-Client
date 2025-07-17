import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Card, Table, Button, TableBody, Container, TableContainer, Stack } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
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
import { DELETE_MEDIATOR } from '../../graphQL/mutations';

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

  const [filterName, setFilterName] = useState('');

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
              <MediatorTableToolbar
                filterName={filterName}
                onFilterName={handleFilterName}
                onResetFilter={handleResetFilter}
              />
              <Button
                component={RouterLink}
                to={PATH_DASHBOARD.mediator.new}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New Mediator
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
    </>
  );
}
