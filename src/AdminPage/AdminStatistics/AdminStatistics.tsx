import ClientTable from './ClientTable';
import MemberShipRegistrationTable from './MemberShipRegistrationTable';
import MembershipTable from './MembershipTable';
import ProductTable from './ProductTable';
import PurchaseTable from './PurchaseTable';
import TrainerTable from './TrainerTable';
import TrainingRegistrationTable from './TrainingRegistrationTable';
import VisitStatisticTable from './VisitStatisticTable';
import './AdminStatistics.css';

export default function AdminStatistics() {
  return (
    <div className="adminStatisticsContainer">
      <h1>Admin Statistics</h1>
      <div className="tableContainer">
        <h2>Client Table</h2>
        <ClientTable />
      </div>
      <div className="tableContainer">
        <h2>Membership Registration Table</h2>
        <MemberShipRegistrationTable />
      </div>
      <div className="tableContainer">
        <h2>Membership Table</h2>
        <MembershipTable />
      </div>
      <div className="tableContainer">
        <h2>Product Table</h2>
        <ProductTable />
      </div>
      <div className="tableContainer">
        <h2>Purchase Table</h2>
        <PurchaseTable />
      </div>
      <div className="tableContainer">
        <h2>Trainer Table</h2>
        <TrainerTable />
      </div>
      <div className="tableContainer">
        <h2>Training Registration Table</h2>
        <TrainingRegistrationTable />
      </div>
      <div className="tableContainer">
        <h2>Visit Statistic Table</h2>
        <VisitStatisticTable />
      </div>
    </div>
  );
}
