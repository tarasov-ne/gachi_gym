import React from 'react';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import * as Yup from 'yup';
import { TTrainingReg } from '../../../@types/trainingRegData';



const TraininigRegistrationUpdateForm = ({ onUpdate, initialValues, onCancel }: any) => {
  const formik = useFormik({
    initialValues: initialValues, 
    validationSchema: Yup.object({
        client_id: Yup.number().required('Required'),
        trainer_id: Yup.number().required('Required'),
        date: Yup.date().required('Required'),
        start: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      onUpdate.mutate(values)
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
        <label htmlFor="client_id">client_id</label>
      <input
        type="text"
        id="client_id"
        name="client_id"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.client.id}
      />
      {formik.touched.client && formik.errors.client ? (
        <div>{formik.errors.client_id}</div>
      ) : null}

      <label htmlFor="trainer_id">trainer_id</label>
      <input
        type="text"
        id="trainer_id"
        name="trainer_id"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.trainer && formik.errors.trainer ? (
        <div>{formik.errors.trainer.id}</div>
      ) : null}

      <label htmlFor="date">date</label>
      <input
        type="text"
        id="date"
        name="date"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.date}
      />
      {formik.touched.date && formik.errors.date ? (
        <div>{formik.errors.date}</div>
      ) : null}

      <label htmlFor="start">start</label>
      <input
        type="text"
        id="start"
        name="start"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.start}
      />
      {/* {formik.touched.start && formik.errors.start ? (
        <div>{formik.errors.start}</div>
      ) : null} */}

      <button type="submit">Update TrainingRegistration</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default TraininigRegistrationUpdateForm;
