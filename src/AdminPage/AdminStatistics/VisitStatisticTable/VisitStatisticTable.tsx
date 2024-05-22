import { useQuery } from '@tanstack/react-query'
import React from 'react'
import apiAxiosInstance from '../../../api/axios'

export default function VisitStatisticTable() {
  const {data, isLoading} = useQuery({
    queryKey: ["visitStatistics_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get('/getData');
      return res.data.VisitStatistic as TVisitStatisticData[]
    }
  })
  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <h2>VisitStatistic Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Client_id</th>
            <th>Start date</th>
            <th>End date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((visitStatistic) => (
            <tr key={visitStatistic.id}>
              <td>{visitStatistic.id}</td>
              <td>{visitStatistic.client_id}</td>
              <td>{visitStatistic.start_date}</td>
              <td>{visitStatistic.end_date}</td>
              {/* <td>
                <button onClick={() => handleUpdate(visitStatistic)}>Update</button>
                <button onClick={() => handleDelete(visitStatistic.id)}>Delete</button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* {insertFormVisible && (
        <VisitStatisticInsertForm onInsert={handleInsertSubmit} onCancel={handleInsertCancel}/>
      )}

      {updateFormVisible && selectVisitStatistic && (
        <VisitStatisticUpdateForm
          onUpdate={handleUpdateSubmit}
          initialValues={selectVisitStatistic}
          onCancel={handleUpdateCancel}
        />
      )}

      {!insertFormVisible && (
        <button onClick={handleInsert}>Insert New VisitStatistic</button>
      )}
       */}
    </div>
  )
}
