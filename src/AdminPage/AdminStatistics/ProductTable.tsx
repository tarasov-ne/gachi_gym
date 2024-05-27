import { useMemo } from 'react';
import { useTable, useSortBy, Column } from 'react-table';
import { useQuery } from '@tanstack/react-query';
import apiAxiosInstance from '../../api/axios';

export default function ProductTable() {
  const { data, isLoading } = useQuery<TProduct[]>({
    queryKey: ["products_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance('/getProducts');
      return res.data;
    },
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  const columns: Column<TProduct>[] = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Price',
        accessor: 'price',
      },
      {
        Header: 'Count',
        accessor: 'count',
      },
    ],
    []
  );

  const tableInstance = useTable<TProduct>(
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
    <div>
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
    </div>
  );
}
