import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import apiAxiosInstance from "../../api/axios";

const valScheme = Yup.object({
  name: Yup.string().required(),
  price: Yup.number().required(),
  count: Yup.number().required(),
});

export default function AddProductPage() {
  const [isSending, setIsSending] = useState(false);
  const [isError, setIsError] = useState(false);

  const addTrainerFormik = useFormik({
    initialValues: {
      name: "",
      price: "",
      count: "",
    },
    validationSchema: valScheme,
    onSubmit: (values) => {
      sendMutation.mutate(values);
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (values: any) => {
      await apiAxiosInstance.post("/productInsert", values);
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
      addTrainerFormik.values.price = "";
      addTrainerFormik.values.count = "";
    },
    onSettled: () => {
      setIsSending(false);
    },
  });
  return (
    <div className="userAddForm">
      <div>Product add form</div>

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
            <label>Price</label>
            <input
              id="surnameField"
              name="price"
              type="text"
              value={addTrainerFormik.values.price}
              onChange={addTrainerFormik.handleChange}
              onBlur={addTrainerFormik.handleBlur}
            />
            {addTrainerFormik.errors.price &&
            addTrainerFormik.touched.price ? (
              <p style={{ margin: 0, color: "red" }}>
                {addTrainerFormik.errors.price}
              </p>
            ) : (
              <></>
            )}
          </div>

          <div className="addUserInputFieldWrapper">
            <label>Count</label>
            <input
              id="work_modeField"
              name="count"
              type="text"
              value={addTrainerFormik.values.count}
              onChange={addTrainerFormik.handleChange}
              onBlur={addTrainerFormik.handleBlur}
            ></input>
            {addTrainerFormik.errors.count &&
            addTrainerFormik.touched.count ? (
              <p style={{ margin: 0, color: "red" }}>
                {addTrainerFormik.errors.count}
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
