import { useMemo } from 'react';
import { useTable, useSortBy, Column, CellProps, Row } from 'react-table';
import { useQuery } from '@tanstack/react-query';
import apiAxiosInstance from '../../api/axios';
import moment from 'moment';

type TMemberShipReg = {
  id: number;
  client_id: number;
  membership_id: number;
  start_date: string;
  end_date: string;
};

export default function MemberShipRegistrationTable() {
  const { data, isLoading } = useQuery<TMemberShipReg[]>({
    queryKey: ["membershipRegistrations_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get("/getMembershipRegistrations");
      return res.data;
    },
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  const columns: Column<TMemberShipReg>[] = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Client ID',
        accessor: 'client_id',
      },
      {
        Header: 'Membership ID',
        accessor: 'membership_id',
      },
      {
        Header: 'Start Date',
        accessor: 'start_date',
        Cell: ({ value }: CellProps<TMemberShipReg, string>) => moment(value).format("DD.MM.YYYY"),
        sortType: (a: Row<TMemberShipReg>, b: Row<TMemberShipReg>) => {
          const dateA = new Date(a.original.start_date);
          const dateB = new Date(b.original.start_date);
          return dateA.getTime() - dateB.getTime();
        }
      },
      {
        Header: 'End Date',
        accessor: 'end_date',
        Cell: ({ value }: CellProps<TMemberShipReg, string>) => moment(value).format("DD.MM.YYYY"),
        sortType: (a: Row<TMemberShipReg>, b: Row<TMemberShipReg>) => {
          const dateA = new Date(a.original.end_date);
          const dateB = new Date(b.original.end_date);
          return dateA.getTime() - dateB.getTime();
        }
      },
    ],
    []
  );

  const tableInstance = useTable<TMemberShipReg>(
    { columns, data: data || [] },
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
