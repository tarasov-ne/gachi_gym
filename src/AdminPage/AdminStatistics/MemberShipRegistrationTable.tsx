import { useQuery } from "@tanstack/react-query";
import apiAxiosInstance from "../../api/axios";
import moment from "moment";

export default function MemberShipRegistrationTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["membershipRegistrations_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get("/getMembershipRegistrations");
      return res.data as TMemberShipReg[];
    },
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  return isLoading ? (
    <div>Loading...</div>
  ) : (
  <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Client_id</th>
            <th>Membership_id</th>
            <th>Start_date</th>
            <th>End_date</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((membershipRegistration) => (
            <tr key={membershipRegistration.id}>
              <td>{membershipRegistration.id}</td>
              <td>{membershipRegistration.client_id}</td>
              <td>{membershipRegistration.membership_id}</td>
              <td>{moment(membershipRegistration.start_date).format("DD.MM.YYYY")}</td>
              <td>{moment(membershipRegistration.end_date).format("DD.MM.YYYY")}</td>
            </tr>
          ))}
        </tbody>
      </table> 
    </div>
  )
}
