import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Card, Table, Button, TableBody, Container, TableContainer, Stack } from '@mui/material';
import { useQuery } from '@apollo/client';

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
import { UserTableToolbar, UserTableRow } from '../../sections/@dashboard/admin/client/list';
import { CLIENTS_PAGINATED_LIST } from '../../graphQL/queries';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phone', label: 'Phone', align: 'left' },
  { id: '', label: 'Action', align: 'left' },
];

// ----------------------------------------------------------------------

export default function ClientListPage() {
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
  } = useTable();
  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [filterName, setFilterName] = useState('');

  const { loading, data, error } = useQuery(CLIENTS_PAGINATED_LIST, {
    variables: {
      offset: page,
      limit: rowsPerPage,
      order,
      orderBy,
      name: filterName,
      type: 'client',
    },
    fetchPolicy: 'no-cache',
  });

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.clientUser.view(id));
  };
  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.clientUser.edit(id));
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
        <title> Client: List | Phone Mediation Application</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Client Users List"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'List' }]}
          action={
            <Stack direction="row" spacing={2} alignItems="center">
              <UserTableToolbar
                filterName={filterName}
                onFilterName={handleFilterName}
                onResetFilter={handleResetFilter}
              />
              <Button
                component={RouterLink}
                to={PATH_DASHBOARD.adminClients.new}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New Client
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
                  rowCount={data?.usersPaginatedList?.users?.length || 0}
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
                    data?.usersPaginatedList?.users?.map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={data?.usersPaginatedList?.filteredCount || 0}
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
