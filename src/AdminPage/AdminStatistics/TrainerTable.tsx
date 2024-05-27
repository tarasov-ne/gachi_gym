import { useMemo } from 'react';
import { useTable, useSortBy, Column } from 'react-table';
import { useQuery } from '@tanstack/react-query';
import apiAxiosInstance from '../../api/axios';

type TTrainerData = {
  id: number;
  name: string;
  surname: string;
  phone_number: string;
};

export default function TrainerTable() {
  const { data, isLoading } = useQuery<TTrainerData[]>({
    queryKey: ["trainers_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get("/getTrainers");
      return res.data;
    },
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  const columns: Column<TTrainerData>[] = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
        sortType: 'basic',
      },
      {
        Header: 'Surname',
        accessor: 'surname',
        sortType: 'basic',
      },
      {
        Header: 'Phone Number',
        accessor: 'phone_number',
        sortType: 'basic',
      },
    ],
    []
  );

  const tableInstance = useTable<TTrainerData>(
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
