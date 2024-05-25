import React from 'react';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import * as Yup from 'yup';

const ClientUpdateForm = ({ onUpdate, initialValues, onCancel }: any) => {
  const formik = useFormik({
    initialValues: initialValues as TClientData,
    validationSchema: Yup.object({
        login: Yup.string().required('Required'),
        password: Yup.string().required('Required'),
        name: Yup.string().required('Required'),
        surname: Yup.string().required('Required'),
        e_mail: Yup.string().required('Required'),
        phone_number: Yup.string().required('Required')
    }),
    onSubmit: (values) => {
      onUpdate.mutate(values)
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
        <label htmlFor="name">Login</label>
      <input
        type="text"
        id="login"
        name="login"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.login}
      />
      {formik.touched.login && formik.errors.login ? (
        <div>{formik.errors.login}</div>
      ) : null}

      <label htmlFor="name">Password</label>
      <input
        type="text"
        id="password"
        name="password"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.password && formik.errors.password ? (
        <div>{formik.errors.password}</div>
      ) : null}

      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.name}
      />
      {formik.touched.name && formik.errors.name ? (
        <div>{formik.errors.name}</div>
      ) : null}

      <label htmlFor="surname">Surname</label>
      <input
        type="text"
        id="surname"
        name="surname"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.surname}
      />
      {formik.touched.surname && formik.errors.surname ? (
        <div>{formik.errors.surname}</div>
      ) : null}

      <label htmlFor="e_mail">E-mail</label>
      <input
        type="text"
        id="e_mail"
        name="e_mail"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.e_mail}
      />
      {formik.touched.e_mail && formik.errors.e_mail ? (
        <div>{formik.errors.e_mail}</div>
      ) : null}

      <label htmlFor="phone_number">Phone number</label>
      <input
        type="text"
        id="phone_number"
        name="phone_number"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.phone_number}
      />
      {formik.touched.phone_number && formik.errors.phone_number ? (
        <div>{formik.errors.phone_number}</div>
      ) : null}

      <button type="submit">Update Client</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default ClientUpdateForm;
