import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Skeleton,
} from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { LoadingButton } from '@mui/lab';
import { useParams } from 'react-router';
import { PATH_DASHBOARD } from '../../routes/paths';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  TableHeadCustom,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from '../../components/table';
import { GROUP_BY_ID, MEDIATOR_LIST_BASIC } from '../../graphQL/queries';
import { ADD_MEDIATOR_TO_GROUP } from '../../graphQL/mutations';
import Label from '../../components/label';
import { fDate } from '../../utils/formatTime';

export default function MediatorGroupDetailPage() {
  const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = useTable({});
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const [selectedMediators, setSelectedMediators] = useState([]);
  const { loading, data, error, refetch } = useQuery(GROUP_BY_ID, {
    variables: { groupByIdId: id },
    fetchPolicy: 'no-cache',
  });
  useEffect(() => {
    if (data?.groupByID) {
      setSelectedMediators(data.groupByID.mediators.map((mediator) => mediator.id));
    }
  }, [data]);
  console.log('selectedMediators:', selectedMediators);

  const [openAdd, setOpenAdd] = useState(false);
  const { data: allMediatorsData } = useQuery(MEDIATOR_LIST_BASIC);

  const [addMediatorToGroup, { loading: addLoading }] = useMutation(ADD_MEDIATOR_TO_GROUP);

  const group = data?.groupByID;

  const handleAddMediator = async () => {
    addMediatorToGroup({ variables: { groupId: id, mediator_ids: selectedMediators } });
    setOpenAdd(false);
    setSelectedMediators([]);
    refetch();
  };

  const paginatedInterpreters =
    allMediatorsData?.mediatorList?.slice(page * rowsPerPage, (page + 1) * rowsPerPage) || [];

  if (loading) {
    return <Skeleton width="100%" height={300} />;
  }
  if (error) {
    return `Error: ${error?.message}`;
  }
  return (
    <>
      <Helmet>
        <title> Interpreter Group Detail | Telephone Mediation App</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Interpreter Groups"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Interpreter Groups',
              href: PATH_DASHBOARD.interpreter.group,
            },
            { name: group?.group_name || 'Group Detail' },
          ]}
        />
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5">{group?.group_name}</Typography>
          <Stack direction="row" spacing={2} mt={2}>
            <Label color={group?.status === 'active' ? 'success' : 'error'}>{group?.status}</Label>
            <Typography variant="body2">Created At: {fDate(group?.created_at)}</Typography>
          </Stack>
        </Card>
        <Card>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
            <Typography variant="h6">Interpreters</Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => setOpenAdd(true)}
            >
              Add Interpreter
            </Button>
          </Stack>
          <TableContainer>
            <Table>
              <TableHeadCustom
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableSkeleton />
                ) : (
                  group?.mediators?.map((interpreter) => (
                    <TableRow key={interpreter.id}>
                      <TableCell>
                        {interpreter.first_name} {interpreter.last_name}
                      </TableCell>
                      <TableCell>{interpreter.email}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Interpreters to Group</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Select interpreters to add:
          </Typography>

          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHeadCustom
                headLabel={[
                  {
                    id: 'select',
                    label: (
                      <Checkbox
                        indeterminate={
                          selectedMediators.length > 0 &&
                          selectedMediators.length < paginatedInterpreters.length
                        }
                        checked={
                          paginatedInterpreters.length > 0 &&
                          selectedMediators.length === paginatedInterpreters.length
                        }
                        onChange={(e) => {
                          const newSelected = e.target.checked
                            ? [
                                ...new Set([
                                  ...selectedMediators,
                                  ...paginatedInterpreters.map((i) => i.id),
                                ]),
                              ]
                            : selectedMediators.filter(
                                // eslint-disable-next-line no-shadow
                                (id) => !paginatedInterpreters.some((i) => i.id === id)
                              );
                          setSelectedMediators(newSelected);
                        }}
                      />
                    ),
                  },
                  { id: 'name', label: 'Name' },
                  { id: 'language', label: 'Languages' },
                  { id: 'group', label: 'Groups' },
                  { id: 'email', label: 'Email' },
                ]}
              />
              <TableBody>
                {paginatedInterpreters.map((interpreter) => {
                  const isSelected = selectedMediators.includes(interpreter.id);
                  return (
                    <TableRow
                      key={interpreter.id}
                      hover
                      onClick={() => {
                        setSelectedMediators((prev) =>
                          isSelected
                            ? // eslint-disable-next-line no-shadow
                              prev.filter((id) => id !== interpreter.id)
                            : [...prev, interpreter.id]
                        );
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell>
                        {interpreter.first_name} {interpreter.last_name}
                      </TableCell>
                      <Typography>
                        {interpreter?.sourceLanguages
                          ?.map((item) => item?.sourceLanguage?.language_name)
                          ?.join(',')}
                        {interpreter?.targetLanguages?.length > 0 && <>&hArr;</>}
                        {interpreter?.targetLanguages
                          ?.map((item) => item?.targetLanguage?.language_name)
                          ?.join(',')}
                      </Typography>
                      <TableCell>
                        {' '}
                        {interpreter?.groups?.map((item) => item?.group?.group_name)?.join(', ') ||
                          'No Groups'}
                      </TableCell>
                      <TableCell>{interpreter.email}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePaginationCustom
            count={allMediatorsData?.mediatorList?.length || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <LoadingButton
            variant="contained"
            loading={addLoading}
            onClick={handleAddMediator}
            disabled={selectedMediators.length === 0}
          >
            Add Selected ({selectedMediators.length})
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
