import { useMemo } from 'react';
import { useTable, useSortBy, Column, CellProps } from 'react-table';
import apiAxiosInstance from "../../api/axios";
import { useQuery } from "@tanstack/react-query";

type TClientData = {
  id: number;
  login: string;
  password: string;
  name: string;
  surname: string;
  phone_number: string;
  e_mail: string;
  membership_active: boolean;
};

export default function ClientTable() {
  const { data, isLoading } = useQuery<TClientData[]>({
    queryKey: ["clients_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get("/getClients");
      return res.data;
    },
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  const columns: Column<TClientData>[] = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Login',
        accessor: 'login',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Surname',
        accessor: 'surname',
      },
      {
        Header: 'E-mail',
        accessor: 'e_mail',
      },
      {
        Header: 'Phone-number',
        accessor: 'phone_number',
      },
      {
        Header: 'Membership active',
        accessor: 'membership_active',
        Cell: ({ value }: CellProps<TClientData, boolean>) => (value ? 'Active' : 'Inactive'),
      },
    ],
    []
  );

  const tableInstance = useTable<TClientData>(
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
