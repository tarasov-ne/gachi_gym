import { useQuery } from '@tanstack/react-query'
import React from 'react'
import apiAxiosInstance from '../../../api/axios'

export default function MembershipTable() {
  const {data, isLoading} = useQuery({
    queryKey: ["memberships_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance('/getData');
      return res.data.Membership as TMemberShip[];
    },
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  return isLoading ?(
    <div>MembershipTable</div>
  ) : (
    <div>
      <h2>Membership Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((membership) => (
            <tr key={membership.id}>
              <td>{membership.id}</td>
              <td>{membership.name}</td>
              <td>{membership.price}</td>
              <td>{membership.duration}</td>
              {/* <td>
                <button onClick={() => handleUpdate(membership)}>Update</button>
                <button onClick={() => handleDelete(membership.id)}>Delete</button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* {insertFormVisible && (
        <MembershipInsertForm onInsert={handleInsertSubmit} onCancel={handleInsertCancel}/>
      )}

      {updateFormVisible && selectedMembership && (
        <MembershipUpdateForm
          onUpdate={handleUpdateSubmit}
          initialValues={selectedMembership}
          onCancel={handleUpdateCancel}
        />
      )}

      {!insertFormVisible && (
        <button onClick={handleInsert}>Insert New Membership</button>
      )} */}
      
    </div>
  )
}
