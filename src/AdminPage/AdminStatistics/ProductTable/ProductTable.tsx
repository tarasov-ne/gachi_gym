import { useQuery } from '@tanstack/react-query'
import React from 'react'
import apiAxiosInstance from '../../../api/axios'

export default function ProductTable() {
  const {data, isLoading} = useQuery({
    queryKey: ["products_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get('/getData');
      return res.data.Product as TProduct[];
    },
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: true,
  })
  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <h2>Product Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.count}</td>
              {/* <td>
                <button onClick={() => handleUpdate(product)}>Update</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* {insertFormVisible && (
        <ProductInsertForm onInsert={handleInsertSubmit} onCancel={handleInsertCancel}/>
      )}

      {updateFormVisible && selectedProduct && (
        <ProductUpdateForm
          onUpdate={handleUpdateSubmit}
          initialValues={selectedProduct}
          onCancel={handleUpdateCancel}
        />
      )} */}

      {/* {!insertFormVisible && (
        <button onClick={handleInsert}>Insert Product</button>
      )} */}
      
    </div>

  )
}
