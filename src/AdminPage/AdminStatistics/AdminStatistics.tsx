import { useState } from 'react';
import ClientTable from './ClientTable';
import MembershipTable from './MembershipTable';
import ProductTable from './ProductTable';
import PurchaseTable from './PurchaseTable';
import TrainerTable from './TrainerTable';
import TrainingRegistrationTable from './TrainingRegistrationTable';
import MembershipRegistrationTable from './MembershipRegistrationTable';
import VisitStatisticTable from './VisitStatisticTable';
import './AdminStatistics.css';

const tableComponents = {
  ClientTable,
  MembershipTable,
  MembershipRegistrationTable,
  ProductTable,
  PurchaseTable,
  TrainerTable,
  TrainingRegistrationTable,
  VisitStatisticTable
} as const;

const tableNames = [
  "Client Table",
  "Membership Table",
  "Membership Registration Table",
  "Product Table",
  "Purchase Table",
  "Trainer Table",
  "Training Registration Table",
  "Visit Statistic Table"
] as const;

type TableName = typeof tableNames[number];

export default function AdminStatistics() {
  const [selectedTable, setSelectedTable] = useState<TableName>("Client Table");

  const TableComponent = tableComponents[
    selectedTable.replace(/ /g, '') as keyof typeof tableComponents
  ];

  return (
    <div className="adminStatisticsContainer">
      <h1>Admin Statistics</h1>
      <div className="tableSelection">
        <ul>
          {tableNames.map(name => (
            <li
              key={name}
              onClick={() => setSelectedTable(name)}
              className={name === selectedTable ? 'active' : ''}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
      <div className="tableContainer">
        <h2>{selectedTable}</h2>
        <TableComponent />
      </div>
    </div>
  );
}
