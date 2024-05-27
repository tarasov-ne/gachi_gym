import { useMemo } from 'react';
import { useTable, useSortBy, Column, CellProps, Row } from 'react-table';
import { useQuery } from '@tanstack/react-query';
import apiAxiosInstance from '../../api/axios';
import moment from 'moment';


export default function PurchaseTable() {
  const { data, isLoading } = useQuery<TPurchase[]>({
    queryKey: ["purchases_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get("/getPurchases");
      return res.data;
    },
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  const columns: Column<TPurchase>[] = useMemo(
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
        Header: 'Product ID',
        accessor: 'product_id',
        sortType: 'basic',
      },
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ value }: CellProps<TPurchase, string>) => moment(value).format("DD.MM.YYYY"),
        sortType: (a: Row<TPurchase>, b: Row<TPurchase>) => {
          const dateA = new Date(a.original.date);
          const dateB = new Date(b.original.date);
          return dateA.getTime() - dateB.getTime();
        }
      },
      {
        Header: 'Time',
        accessor: 'time',
        Cell: ({ value }: CellProps<TPurchase, string>) => moment(value, "HH:mm:ss").format("HH:mm"),
        sortType: 'basic',
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
        sortType: 'basic',
      },
      {
        Header: 'Total Price',
        accessor: 'total_price',
        sortType: 'basic',
      },
    ],
    []
  );

  const tableInstance = useTable<TPurchase>(
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
