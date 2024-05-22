import { useQuery } from "@tanstack/react-query";
import React from "react";
import apiAxiosInstance from "../../../api/axios";

export default function MemberShipRegistrationTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["membershipRegistrations_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get("/getData");
      return res.data.MembershipRegistration as TMemberShipReg[];
    },
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  return isLoading ? (
    <div>Loading...</div>
  ) : (
  <div>
      <h2>MembershipRegistration Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Client_id</th>
            <th>Membership_id</th>
            <th>Start_date</th>
            <th>End_date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((membershipRegistration) => (
            <tr key={membershipRegistration.id}>
              <td>{membershipRegistration.id}</td>
              <td>{membershipRegistration.client_id}</td>
              <td>{membershipRegistration.membership_id}</td>
              <td>{membershipRegistration.start_date}</td>
              <td>{membershipRegistration.end_date}</td>
              {/* <td>
                <button onClick={() => handleUpdate(membershipRegistration)}>Update</button>
                <button onClick={() => handleDelete(membershipRegistration.id)}>Delete</button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* {insertFormVisible && (
        <MembershipRegistrationInsertForm onInsert={handleInsertSubmit} onCancel={handleInsertCancel}/>
      )}

      {updateFormVisible && selectedMembershipRegistration && (
        <MembershipRegistrationUpdateForm
          onUpdate={handleUpdateSubmit}
          initialValues={selectedMembershipRegistration}
          onCancel={handleUpdateCancel}
        />
      )}

      {!insertFormVisible && (
        <button onClick={handleInsert}>Insert New MembershipRegistration</button>
      )} */}
      
    </div>
  )
}
