import { useFormik } from "formik";
import "./RegistrationPage.css"; // Use the same stylesheet for consistency
import * as yup from "yup";
import apiAxiosInstance from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { clientAtom, logInAtom } from "../App";
import { useAtom } from "jotai";
import moment from "moment";

const validation = yup.object({
  login: yup.string().required("This is required field"),
  password: yup.string().required("This is required field"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("This is required field"),
  name: yup.string().required("This is required field"),
  surname: yup.string().required("This is required field"),
  phone_number: yup.string().required("This is required field"),
  e_mail: yup
    .string()
    .email("Invalid email format")
    .required("This is required field"),
});

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [, setClientData] = useAtom(clientAtom);
  const [isLoggedIn, setIsLoggedIn] = useAtom(logInAtom);
  const registrationForm = useFormik({
    initialValues: {
      login: "",
      password: "",
      confirmPassword: "",
      name: "",
      surname: "",
      phone_number: "",
      e_mail: "",
      membership_active: false,
    },
    validationSchema: validation,
    onSubmit: async (values) => {
      const startDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      localStorage.setItem("start_date", startDateTime.split(" ")[0]);
      localStorage.setItem("start_time", startDateTime.split(" ")[1]);
      apiAxiosInstance
        .post("/addClient", {
          login: values.login,
          password: values.password,
          name: values.name,
          surname: values.surname,
          phone_number: values.phone_number,
          e_mail: values.e_mail,
          membership_active: false,
        })
        .then((response) => {
          console.log("Registration success");
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

  return (
    <div className="authForm">
      <div className="TAFwrapper">
        <form onSubmit={registrationForm.handleSubmit}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h1>Регистрация</h1>
          </div>

          <div className="loginFieldTAF">
            <label>Логин</label>
            <input
              id="loginIdTAF"
              name="login"
              type="text"
              placeholder="Login"
              onBlur={registrationForm.handleBlur}
              onChange={registrationForm.handleChange}
              value={registrationForm.values.login}
            />
            {registrationForm.errors.login &&
              registrationForm.touched.login && (
                <p style={{ marginTop: "0.5rem", color: "red" }}>
                  {registrationForm.errors.login}
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
              onBlur={registrationForm.handleBlur}
              onChange={registrationForm.handleChange}
              value={registrationForm.values.password}
            />
            {registrationForm.errors.password &&
              registrationForm.touched.password && (
                <p style={{ marginTop: "0.5rem", color: "red" }}>
                  {registrationForm.errors.password}
                </p>
              )}
          </div>

          <div className="passwordFieldTAF">
            <label>Подтвердите пароль</label>
            <input
              id="confirmPasswordIdTAF"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              onBlur={registrationForm.handleBlur}
              onChange={registrationForm.handleChange}
              value={registrationForm.values.confirmPassword}
            />
            {registrationForm.errors.confirmPassword &&
              registrationForm.touched.confirmPassword && (
                <p style={{ marginTop: "0.5rem", color: "red" }}>
                  {registrationForm.errors.confirmPassword}
                </p>
              )}
          </div>

          <div className="nameFieldTAF">
            <label>Имя</label>
            <input
              id="nameIdTAF"
              name="name"
              type="text"
              placeholder="Name"
              onBlur={registrationForm.handleBlur}
              onChange={registrationForm.handleChange}
              value={registrationForm.values.name}
            />
            {registrationForm.errors.name && registrationForm.touched.name && (
              <p style={{ marginTop: "0.5rem", color: "red" }}>
                {registrationForm.errors.name}
              </p>
            )}
          </div>

          <div className="surnameFieldTAF">
            <label>Фамилия</label>
            <input
              id="surnameIdTAF"
              name="surname"
              type="text"
              placeholder="Surname"
              onBlur={registrationForm.handleBlur}
              onChange={registrationForm.handleChange}
              value={registrationForm.values.surname}
            />
            {registrationForm.errors.surname &&
              registrationForm.touched.surname && (
                <p style={{ marginTop: "0.5rem", color: "red" }}>
                  {registrationForm.errors.surname}
                </p>
              )}
          </div>

          <div className="phoneNumberFieldTAF">
            <label>Номер телефона</label>
            <input
              id="phoneNumberIdTAF"
              name="phone_number"
              type="text"
              placeholder="Phone Number"
              onBlur={registrationForm.handleBlur}
              onChange={registrationForm.handleChange}
              value={registrationForm.values.phone_number}
            />
            {registrationForm.errors.phone_number &&
              registrationForm.touched.phone_number && (
                <p style={{ marginTop: "0.5rem", color: "red" }}>
                  {registrationForm.errors.phone_number}
                </p>
              )}
          </div>

          <div className="emailFieldTAF">
            <label>E-mail</label>
            <input
              id="emailIdTAF"
              name="e_mail"
              type="email"
              placeholder="Email"
              onBlur={registrationForm.handleBlur}
              onChange={registrationForm.handleChange}
              value={registrationForm.values.e_mail}
            />
            {registrationForm.errors.e_mail &&
              registrationForm.touched.e_mail && (
                <p style={{ marginTop: "0.5rem", color: "red" }}>
                  {registrationForm.errors.e_mail}
                </p>
              )}
          </div>

          <div className="TAFSubmitWrapper">
            <button type="submit" className="TAFSubmit">
              Зарегистрироваться
            </button>
          </div>
          <Link to={"/auth"} className="linkToAuth">
            Назад к авторизации
          </Link>
        </form>
      </div>
    </div>
  );
}
