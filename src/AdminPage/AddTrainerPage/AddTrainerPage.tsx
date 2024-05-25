import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import apiAxiosInstance from "../../api/axios";

const valScheme = Yup.object({
  name: Yup.string().required(),
  surname: Yup.string().required(),
  phone_number: Yup.string().required(),
});

export default function AddTrainerPage() {
  const [isSending, setIsSending] = useState(false);
  const [isError, setIsError] = useState(false);

  const addTrainerFormik = useFormik({
    initialValues: {
      name: "",
      surname: "",
      phone_number: "",
    },
    validationSchema: valScheme,
    onSubmit: (values) => {
      sendMutation.mutate(values);
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (values: any) => {
      await apiAxiosInstance.post("/trainerInsert", values);
    },
    onMutate: (_values) => {
      setIsSending(true);
      setIsError(false);
    },
    onError: (_error) => {
      setIsError(true);
    },
    onSuccess: () => {
      addTrainerFormik.values.name = "";
      addTrainerFormik.values.surname = "";
      addTrainerFormik.values.phone_number = "";
    },
    onSettled: () => {
      setIsSending(false);
    },
  });
  return (
    <div className="userAddForm">
      <div>Trainer add form</div>

      <div className="addUserFormWrapper">
        <form onSubmit={addTrainerFormik.handleSubmit}>
          <div className="addUserInputFieldWrapper">
            <label>Name</label>
            <input
              id="nameField"
              name="name"
              type="text"
              value={addTrainerFormik.values.name}
              onChange={addTrainerFormik.handleChange}
              onBlur={addTrainerFormik.handleBlur}
            />
            {addTrainerFormik.errors.name && addTrainerFormik.touched.name ? (
              <p style={{ margin: 0, color: "red" }}>
                {addTrainerFormik.errors.name}
              </p>
            ) : (
              <></>
            )}
          </div>

          <div className="addUserInputFieldWrapper">
            <label>Surname</label>
            <input
              id="surnameField"
              name="surname"
              type="text"
              value={addTrainerFormik.values.surname}
              onChange={addTrainerFormik.handleChange}
              onBlur={addTrainerFormik.handleBlur}
            />
            {addTrainerFormik.errors.surname &&
            addTrainerFormik.touched.surname ? (
              <p style={{ margin: 0, color: "red" }}>
                {addTrainerFormik.errors.surname}
              </p>
            ) : (
              <></>
            )}
          </div>

          <div className="addUserInputFieldWrapper">
            <label>Phone number</label>
            <input
              id="work_modeField"
              name="phone_number"
              type="text"
              value={addTrainerFormik.values.phone_number}
              onChange={addTrainerFormik.handleChange}
              onBlur={addTrainerFormik.handleBlur}
            ></input>
            {addTrainerFormik.errors.phone_number &&
            addTrainerFormik.touched.phone_number ? (
              <p style={{ margin: 0, color: "red" }}>
                {addTrainerFormik.errors.phone_number}
              </p>
            ) : (
              <></>
            )}
          </div>

          <div className="addUserSubmitButton">
            <button disabled={isSending ? true : false} type="submit">
              {!isSending ? "Submit" : "Sending..."}
            </button>
          </div>
          <div style={{ width: "100%", marginLeft: "25%" }}>
            {isError ? "Something went wrong... Try again." : null}
          </div>
        </form>
      </div>
    </div>
  );
}
