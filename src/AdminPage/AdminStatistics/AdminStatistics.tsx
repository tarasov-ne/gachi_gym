import ClientTable from './ClientTable/ClientTable'
import MemberShipRegistrationTable from './MembershipRegistrationTable/MemberShipRegistrationTable'
import MembershipTable from './MembershipTable/MembershipTable'
import ProductTable from './ProductTable/ProductTable'
import PurchaseTable from './PurchaseTable/PurchaseTable'
import TrainerTable from './TrainerTable/TrainerTable'
import TrainingRegistrationTable from './TrainingRegistrationTable/TrainingRegistrationTable'
import VisitStatisticTable from './VisitStatisticTable/VisitStatisticTable'

export default function AdminStatistics() {
  return (
    <div>
        <h1>AdminStatistics</h1>
        <ClientTable/>
        <MemberShipRegistrationTable/>
        <MembershipTable/>
        <ProductTable/>
        <PurchaseTable/>
        <TrainerTable/>
        <TrainingRegistrationTable/>
        <VisitStatisticTable/>
    </div>
  )
}
