import { useQuery } from '@tanstack/react-query'
import React from 'react'
import apiAxiosInstance from '../../../api/axios'

export default function PurchaseTable() {
  const {data, isLoading} = useQuery({
    queryKey: ["purchases_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get('/getData')
      return res.data.Purchase as TPurchase[]
    }
  })
  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <h2>Purchase Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Client_id</th>
            <th>Product_id</th>
            <th>Date</th>
            <th>Quantity</th>
            <th>Total price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((purchase) => (
            <tr key={purchase.id}>
              <td>{purchase.id}</td>
              <td>{purchase.client_id}</td>
              <td>{purchase.product_id}</td>
              <td>{purchase.date}</td>
              <td>{purchase.quantity}</td>
              <td>{purchase.total_price}</td>
              {/* <td>
                <button onClick={() => handleUpdate(purchase)}>Update</button>
                <button onClick={() => handleDelete(purchase.id)}>Delete</button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* {insertFormVisible && (
        <PurchaseInsertForm onInsert={handleInsertSubmit} onCancel={handleInsertCancel}/>
      )}

      {updateFormVisible && selectedPurchase && (
        <PurchaseUpdateForm
          onUpdate={handleUpdateSubmit}
          initialValues={selectedPurchase}
          onCancel={handleUpdateCancel}
        />
      )}

      {!insertFormVisible && (
        <button onClick={handleInsert}>Insert New purchase</button>
      )} */}
      
    </div>
  )
}
