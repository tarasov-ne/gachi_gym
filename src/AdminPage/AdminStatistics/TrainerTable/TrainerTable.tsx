import { useQuery } from "@tanstack/react-query";
import apiAxiosInstance from "../../../api/axios";

export default function TrainerTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["trainiers_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get("/getData");
      return res.data.Trainer as TTrainerData[];
    },
  });

  return isLoading ? (
    <div>TrainerTable</div>
  ) : (
    <div>
      <h2>Trainer Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Phone number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((trainer) => (
            <tr key={trainer.id}>
              <td>{trainer.id}</td>
              <td>{trainer.name}</td>
              <td>{trainer.surname}</td>
              <td>{trainer.phone_number}</td>
              {/* <td>
                <button onClick={() => handleUpdate(trainer)}>Update</button>
                <button onClick={() => handleDelete(trainer.id)}>Delete</button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* {insertFormVisible && (
        <TrainerInsertForm onInsert={handleInsertSubmit} onCancel={handleInsertCancel}/>
      )}

      {updateFormVisible && selectTrainer && (
        <TrainerUpdateForm
          onUpdate={handleUpdateSubmit}
          initialValues={selectTrainer}
          onCancel={handleUpdateCancel}
        />
      )}

      {!insertFormVisible && (
        <button onClick={handleInsert}>Insert New trainer</button>
      )} */}
    </div>
  );
}
