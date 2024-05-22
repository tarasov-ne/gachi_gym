import  { useState } from "react";
import apiAxiosInstance from "../../../api/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import ClientUpdateForm from "./ClientUpdateForm";
import { queryClient } from "../../../main";

export default function ClientTable() {
  const [updateFormVisible, setUpdateFormVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<TClientData | null>(
    null
  );

  const handleUpdateCancel = () => {
    setUpdateFormVisible(false);
  };

  const handleUpdate = (client: TClientData) => {
    setUpdateFormVisible(true);
    setSelectedClient(client);
  };

  const handleDeleteMutation = useMutation({
    mutationFn: (id: number) => apiAxiosInstance.delete(`/clientDelete/${id}`),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["clients_all"] });
      const previousClientData = queryClient.getQueryData(["clients_all"]);
      if (previousClientData) {
        queryClient.setQueryData(
          ["clients_all"],
          (previousClientData as TClientData[]).filter((i) => i.id != id)
        );
      }
      return { previousClientData };
    },
    mutationKey: ["clientDeletMutation"],
    onError: (err, variables, context) => {
      if (context?.previousClientData) {
        queryClient.setQueryData<TClientData[]>(
          ["clients_all"],
          context.previousClientData as TClientData[]
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clients_all"] });
    },
  });

  const handleUpdateSubmit = useMutation({
    mutationFn: (newData: TClientData) =>
      apiAxiosInstance.put(`/clientUpdate/${selectedClient?.id}`, newData),
    onMutate: async (newData: TClientData) => {
      await queryClient.cancelQueries({ queryKey: ["clients_all"] });
      const previousClientData = queryClient.getQueryData(["clients_all"]);
      if (previousClientData)
        queryClient.setQueryData(
          ["clients_all"],
          (previousClientData as TClientData[]).map((value) => {
            if (value.id === selectedClient?.id) return newData as TClientData;
            return value;
          })
        );
      return { previousClientData };
    },
    mutationKey: ["clientUpdateMutation"],
    onError: (err, variables, context) => {
      if (context?.previousClientData) {
        queryClient.setQueryData<TClientData[]>(
          ["clients_all"],
          context.previousClientData as TClientData[]
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clients_all"] });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["clients_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get("/getData");
      return res.data.Client as TClientData[];
    },
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <h2>Client Table</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Login</th>
            <th>Password</th>
            <th>Name</th>
            <th>Surname</th>
            <th>E-mail</th>
            <th>Phone-number</th>
            <th>Membership active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(
            (client) =>
              client.id !== 1 && (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.login}</td>
                  <td>{client.password}</td>
                  <td>{client.name}</td>
                  <td>{client.surname}</td>
                  <td>{client.e_mail}</td>
                  <td>{client.phone_number}</td>
                  <td>{client.membership_active ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button onClick={() => handleUpdate(client)}>Update</button>
                    <button
                      onClick={() => handleDeleteMutation.mutate(client.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>

      {updateFormVisible && selectedClient && (
        <ClientUpdateForm
          onUpdate={handleUpdateSubmit}
          initialValues={selectedClient}
          onCancel={handleUpdateCancel}
        />
      )}
    </div>
  );
}
