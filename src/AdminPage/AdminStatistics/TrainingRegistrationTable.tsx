import { useMemo } from 'react';
import { useTable, useSortBy, Column, CellProps } from 'react-table';
import { useQuery } from '@tanstack/react-query';
import apiAxiosInstance from '../../api/axios';
import moment from 'moment';

type TTrainingReg = {
  id: number;
  client: TClientData;
  trainer: TTrainerData;
  date: string;
  start: Date | null;
  end: Date | null;
}

export default function TrainingRegistrationTable() {
  const { data, isLoading } = useQuery<TTrainingReg[]>({
    queryKey: ["trainingRegistrations_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get("/getTrainingRegistrations");
      const newData = res.data.map((item: TTrainingReg) => ({
        ...item,
        start: item.start ? new Date(`1970-01-01T${item.start}`) : null,
        end: item.end ? new Date(`1970-01-01T${item.end}`) : null,
      }));
      return newData;
    },
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  const columns: Column<TTrainingReg>[] = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Client',
        accessor: (row: TTrainingReg) => row.client.id,
        sortType: 'basic',
      },
      {
        Header: 'Trainer',
        accessor: (row: TTrainingReg) => row.trainer.id,
        sortType: 'basic',
      },
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ value }: CellProps<TTrainingReg, string>) => moment(value).format("DD.MM.YYYY"),
        sortType: 'basic',
      },
      {
        Header: 'Start',
        accessor: 'start',
        Cell: ({ value }: CellProps<TTrainingReg, Date | null>) => value ? moment(value).format("HH:mm") : 'N/A',
        sortType: 'datetime',
      },
      {
        Header: 'End',
        accessor: 'end',
        Cell: ({ value }: CellProps<TTrainingReg, Date | null>) => value ? moment(value).format("HH:mm") : 'N/A',
        sortType: 'datetime',
      },      
    ],
    []
  );

  const tableInstance = useTable<TTrainingReg>(
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
