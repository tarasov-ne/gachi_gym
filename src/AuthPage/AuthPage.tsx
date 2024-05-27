import { useFormik } from "formik";
import "./AuthPage.css";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import apiAxiosInstance from "../api/axios";
import { useAtom } from "jotai";
import { logInAtom, clientAtom } from "../App";
import { Link, Navigate, useNavigate } from "react-router-dom";
import moment from "moment";

const validation = yup.object({
  login: yup.string().required("This is required field"),
  password: yup.string().required("This is required field"),
});

export default function AuthPage() {
  const navigate = useNavigate();
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
      const startDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      localStorage.setItem("start_date", startDateTime.split(" ")[0]);
      localStorage.setItem("start_time", startDateTime.split(" ")[1]);
      apiAxiosInstance
        .post("/login", {
          login: values.login,
          password: values.password,
        })
        .then((response) => {
          localStorage.setItem("token", response.data["token"]);
          setClientData(response.data.user);
          setIsLoggedIn(true);
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
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

  const redirectToRegistration = !credentialsError && (
    <div style={{ textAlign: "center", marginTop: "1rem" }}>
      <p>
        Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
      </p>
    </div>
  );

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="authForm">
      <div className="TAFwrapper">
        <form
          onSubmit={authForm.handleSubmit}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              authForm.handleSubmit(e);
            }
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h1>Авторизация</h1>
          </div>

          <div className="loginFieldTAF">
            <label>Логин</label>
            <input
              id="loginIdTAF"
              name="login"
              type="text"
              placeholder="Login"
              onBlur={authForm.handleBlur}
              onChange={authForm.handleChange}
              value={authForm.values.login}
            />
            {authForm.errors.login && authForm.touched.login && (
              <p style={{ marginTop: "0.5rem", color: "red" }}>
                {authForm.errors.login}
              </p>
            )}
          </div>

          <div className="passwordFieldTAF">
            <label>Пароль</label>
            <input
              id="passwordIdTAF"
              name="password"
              type="password"
              placeholder="Password"
              onBlur={authForm.handleBlur}
              onChange={authForm.handleChange}
              value={authForm.values.password}
            />
            {authForm.errors.password && authForm.touched.password && (
              <p style={{ marginTop: "0.5rem", color: "red" }}>
                {authForm.errors.password}
              </p>
            )}
          </div>

          <div className="TAFSubmitWrapper">
            <button type="submit" className="TAFSubmit">
              Войти
            </button>
          </div>
        </form>
        {redirectToRegistration}
      </div>
    </div>
  );
}
