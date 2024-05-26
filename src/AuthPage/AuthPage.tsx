import { useFormik } from "formik";
import "./AuthPage.css";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import apiAxiosInstance from "../api/axios";
import { useAtom } from "jotai";
import { logInAtom, clientAtom } from "../App";
import { Link, Navigate } from 'react-router-dom';

const validation = yup.object({
  login: yup.string().required("This is required field"),
  password: yup.string().required("This is required field"),
});

export default function AuthPage() {
  const [, setClientData] = useAtom(clientAtom);
  const [credentialsError, setCredentialsError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useAtom(logInAtom);

  const authForm = useFormik({
    initialValues: {
      login: "",
      password: "",
    },
    validationSchema: validation,
    onSubmit: async (values) => {
      apiAxiosInstance
        .post("/login", {
          login: values.login,
          password: values.password,
        })
        .then((response) => {
          console.log("Log in success");
          localStorage.setItem("token", response.data["token"]);
          console.log(response.data.user);
          setClientData(response.data.user);
          setIsLoggedIn(true);
        })
        .catch((error) => {
          if (error.response) {
            switch (error.response.status) {
              case 401:
                console.log("Invalid credentials (password)");
                authForm.errors.password = "Invalid password";
                setCredentialsError(true);
                return;

              case 404:
                console.log("Invalid credentials (nickname)");
                authForm.errors.login = "Invalid login";
                setCredentialsError(true);
                return;
            }
          }
        });
    },
  });

  useEffect(() => {
    const handleKeyUp = (e: any) => {
      if (e.code === "Enter" && e.target.tagName !== "BUTTON") {
        e.preventDefault();
        authForm.handleSubmit(e);
      }
    };

    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [authForm]);

  // Redirect to registration page if no account
  const redirectToRegistration = !credentialsError && (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <p>Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link></p>
    </div>
  );

  // Redirect to ClientPage if logged in
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className='authForm'>
      <div className='TAFwrapper'>
        <form onSubmit={authForm.handleSubmit} onKeyUp={(e) => {if(e.key === "Enter"){authForm.handleSubmit(e)}}}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <h1>Authorisation</h1>
          </div>

          <div className='loginFieldTAF'>
            <label>Login</label>
            <input id='loginIdTAF' name='login' type='text' placeholder='Login' 
            onBlur={authForm.handleBlur} onChange={authForm.handleChange} value={authForm.values.login}/>
            {authForm.errors.login && authForm.touched.login && <p style={{marginTop: "0.5rem", color: "red"}}>{authForm.errors.login}</p>}
          </div>

          <div className='passwordFieldTAF'>
            <label>Password</label>
            <input id='passwordIdTAF' name='password' type='password' placeholder='Password' 
            onBlur={authForm.handleBlur} onChange={authForm.handleChange} value={authForm.values.password}/>
            {authForm.errors.password && authForm.touched.password && <p style={{marginTop: "0.5rem", color: "red"}}>{authForm.errors.password}</p>}
          </div>

          <div className='TAFSubmitWrapper'>
            <button type='submit' className='TAFSubmit'>Submit</button>
          </div>
        </form>
        {redirectToRegistration}
      </div>
    </div>
  );
}
