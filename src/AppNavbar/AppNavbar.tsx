import React from "react";
import { useAtom } from "jotai";
import { Link, useLocation } from "react-router-dom";
import { clientAtom } from "../App";
import { logInAtom } from "../App";
import "./AppNavbar.css";

export default function AppNavbar() {
  const location = useLocation();
  const [clientInfo] = useAtom(clientAtom);
  const [, setIsLoggedIn] = useAtom(logInAtom);

  function getStyleNav(ref: string): React.CSSProperties {
    let style: React.CSSProperties = {};
    if (ref === location.pathname) {
      style.backgroundColor = "rgb(150, 42, 245)";
      style.border = "1px solid black";
    }
    return style;
  }
  function logout() {
    setIsLoggedIn(false);
    localStorage.clear();
  }

  return (
    <div className="appNavbar">
      <Link to={"/"}>
        <div style={getStyleNav("/")}>Membership</div>
      </Link>

      {clientInfo.membership_active === true ? (
        <Link to={"/training-registration"}>
          <div style={getStyleNav("/training-registration")}>
            Training registration
          </div>
        </Link>
      ) : (
        <></>
      )}

      {clientInfo.membership_active === true ? (
        <Link to={"/purchase"}>
          <div style={getStyleNav("/purchase")}>Purchase</div>
        </Link>
      ) : (
        <></>
      )}

      {clientInfo.id === 1 ? (
        <Link to={"/admin-page"}>
          <div style={getStyleNav("/admin-page")}>Admin page</div>
        </Link>
      ) : (
        <></>
      )}
      <button className="but" type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
