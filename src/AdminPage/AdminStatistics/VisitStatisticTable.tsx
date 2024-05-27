import { useMemo } from 'react';
import { useTable, useSortBy, Column, CellProps } from 'react-table';
import { useQuery } from '@tanstack/react-query';
import apiAxiosInstance from '../../api/axios';
import moment from 'moment';

type TVisitStatisticData = {
  id: number;
  client_id: number;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
};

export default function VisitStatisticTable() {
  const { data, isLoading } = useQuery<TVisitStatisticData[]>({
    queryKey: ["visitStatistics_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get("/getVisitStatistics");
      return res.data;
    },
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  const columns: Column<TVisitStatisticData>[] = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Client ID',
        accessor: 'client_id',
        sortType: 'basic',
      },
      {
        Header: 'Start Date',
        accessor: 'start_date',
        Cell: ({ value }: CellProps<TVisitStatisticData, string>) => moment(value).format("DD.MM.YYYY"),
        sortType: 'basic',
      },
      {
        Header: 'Start Time',
        accessor: 'start_time',
        Cell: ({ value }: CellProps<TVisitStatisticData, string>) => moment(value, "HH:mm:ss").format("HH:mm:ss"),
        sortType: 'basic',
      },
      {
        Header: 'End Date',
        accessor: 'end_date',
        Cell: ({ value }: CellProps<TVisitStatisticData, string>) => moment(value).format("DD.MM.YYYY"),
        sortType: 'basic',
      },
      {
        Header: 'End Time',
        accessor: 'end_time',
        Cell: ({ value }: CellProps<TVisitStatisticData, string>) => moment(value, "HH:mm:ss").format("HH:mm:ss"),
        sortType: 'basic',
      },
    ],
    []
  );

  const tableInstance = useTable<TVisitStatisticData>(
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
