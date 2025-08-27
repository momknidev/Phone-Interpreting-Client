import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Table, TableBody, Container, TableContainer, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
// components
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
  BookingTableToolbar,
  BookingTableRow,
} from '../../sections/@dashboard/client/booking/list';
import { PHONE_MEDIATION_PAGINATED_LIST } from '../../graphQL/queries';
import PhonePopover from '../../layouts/dashboard/header/PhonePopover';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', label: 'ID', align: 'center' },
  { id: '#', label: 'Client', align: 'center' },
  { id: '#', label: 'Caller Number', align: 'center' },

  { id: 'language', label: 'Language', align: 'center' },
  { id: '#', label: 'Duration', align: 'center' },
  { id: '#', label: 'Interpreter', align: 'center' },
  { id: 'created_at', label: 'Date', align: 'center' },
  { id: 'used_credits', label: 'Credits', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
];

// ----------------------------------------------------------------------

export default function CallReportPage() {
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
    defaultOrderBy: 'created_at',
    defaultOrder: 'desc',
  });

  const { themeStretch, phone } = useSettingsContext();
  const navigate = useNavigate();

  const [requestID, setFilterName] = useState('');
  const { loading, data, error } = useQuery(PHONE_MEDIATION_PAGINATED_LIST, {
    variables: {
      offset: page,
      limit: rowsPerPage,
      order,
      orderBy,
      phone_number: phone || '',
    },
    fetchPolicy: 'no-cache',
  });

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.mediatorBookingsView(id));
  };
  if (!phone) {
    return (
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Call Reports"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.clientDashboard },
            { name: 'Call List' },
          ]}
        />
        <NoPhoneSelected />
      </Container>
    );
  }

  if (error) {
    return `Error: ${error?.message}`;
  }

  return (
    <>
      <Helmet>
        <title> Call Reports List | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Call Reports"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.clientDashboard,
            },
            { name: 'Call List' },
          ]}
        />

        <Card>
          <BookingTableToolbar requestID={requestID} onFilterName={handleFilterName} />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={data?.phoneMediationPaginatedList?.callReports?.length || 0}
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
                    data?.phoneMediationPaginatedList?.callReports?.map((row) => (
                      <BookingTableRow
                        key={row.id}
                        row={row}
                        onViewRow={() => handleViewRow(row.id)}
                      />
                    ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={data?.phoneMediationPaginatedList?.filteredCount || 0}
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

export function NoPhoneSelected() {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 4,
        minWidth: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 4,
      }}
    >
      <Typography textAlign="center" variant="h6" color="error">
        Please select a phone number to view call reports.
      </Typography>
      <PhonePopover />
    </Card>
  );
}
