import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import apiAxiosInstance from "../../../api/axios";
import TraininigRegistrationUpdateForm from "./TrainingRegistrationUpdateForm";
import { TTrainingReg } from "../../../@types/trainingRegData";
import { queryClient } from "../../../main";
import TrainingRegistrationUpdateForm from "./TrainingRegistrationUpdateForm";

export default function TrainingRegistrationTable() {
  const [updateFormVisible, setUpdateFormVisible] = useState(false);
  const [selectedTrainingRegistration, setSelectedTrainingRegistration] =
    useState<TTrainingReg | null>(null);

  const handleUpdateCancel = () => {
    setUpdateFormVisible(false);
  };

  const handleUpdate = (trainingReg: TTrainingReg) => {
    setUpdateFormVisible(true);
    setSelectedTrainingRegistration(trainingReg);
  };

  const handleDeleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiAxiosInstance.delete(`/trainingRegistrationDelete/${id}`),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: ["trainingRegistrations_all"],
      });
      const previousTrainingReg = queryClient.getQueryData([
        "trainingRegistrations_all",
      ]);
      if (previousTrainingReg) {
        queryClient.setQueryData(
          ["trainingRegistrations_all"],
          (previousTrainingReg as TTrainingReg[]).filter((i) => i.id != id)
        );
      }
      return { previousTrainingReg };
    },
    mutationKey: ["trainingRegDeleteMutation"],
    onError: (err, variables, context) => {
      if (context?.previousTrainingReg) {
        queryClient.setQueryData<TTrainingReg[]>(
          ["trainingRegistrations_all"],
          context.previousTrainingReg as TTrainingReg[]
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["trainingRegistrations_all"],
      });
    },
  });

  const handleUpdateSubmit = useMutation({
    mutationFn: (newData: TTrainingReg) =>
      apiAxiosInstance.put(
        `/trainingRegistrationUpdate/${selectedTrainingRegistration?.id}`,
        newData
      ),
    onMutate: async (newData: TTrainingReg) => {
      await queryClient.cancelQueries({
        queryKey: ["trainingRegistrations_all"],
      });
      const previousTrainingReg = queryClient.getQueryData([
        "trainingRegistrations_all",
      ]);
      if (previousTrainingReg)
        queryClient.setQueryData(
          ["trainingRegistrations_all"],
          (previousTrainingReg as TTrainingReg[]).map((value) => {
            if (value.id === selectedTrainingRegistration?.id)
              return newData as TTrainingReg;
            return value;
          })
        );
      return { previousTrainingReg };
    },
    mutationKey: ["trainingRegUpdateMutation"],
    onError: (err, variables, context) => {
      if (context?.previousTrainingReg) {
        queryClient.setQueryData<TTrainingReg[]>(
          ["trainingRegistrations_all"],
          context.previousTrainingReg as TTrainingReg[]
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["trainingRegistrations_all"],
      });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["trainingRegistrations_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get("/getTrainingRegistrations");
      console.log(res.data as TTrainingReg[]);
      return res.data as TTrainingReg[];
    },
  });
  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <h2>TrainingRegistration Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Client_id</th>
            <th>Trainer_id</th>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((trainingRegistration: any) => (
            <tr key={trainingRegistration.id}>
              <td>{trainingRegistration.id}</td>
              <td>{trainingRegistration.client.id}</td>
              <td>{trainingRegistration.trainer.id}</td>
              <td>{trainingRegistration.date}</td>
              <td>{trainingRegistration.start}</td>
              <td>{trainingRegistration.end}</td>
              <td>
                <button onClick={() => handleUpdate(trainingRegistration)}>
                  Update
                </button>
                <button
                  onClick={() =>
                    handleDeleteMutation.mutate(trainingRegistration.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {updateFormVisible && selectedTrainingRegistration && (
        <TrainingRegistrationUpdateForm
          onUpdate={handleUpdateSubmit}
          initialValues={selectedTrainingRegistration}
          onCancel={handleUpdateCancel}
        />
      )}
    </div>
  );
}
