import React from "react";
import { useAtom } from "jotai";
import { Link, Navigate, useLocation } from "react-router-dom";
import { clientAtom } from "../App";
import { useQuery } from "@tanstack/react-query";
import { logInAtom } from "../App";
import apiAxiosInstance from "../api/axios";
import moment from "moment";
import "./AppNavbar.css";

export default function AppNavbar() {
  const location = useLocation();
  const [clientInfo] = useAtom(clientAtom);
  const [, setIsLoggedIn] = useAtom(logInAtom);
  const { data: membershipRegistration } = useQuery({
    queryKey: ["membershipRegistrations_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get("/getMembershipRegistrations");
      return res.data as TMemberShipReg[];
    },
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  const remainingDays = clientInfo.membership_active
    ? membershipRegistration?.reduce((acc, membership) => {
      if (membership.client_id === clientInfo.id) {
        const diff = moment(membership.end_date).diff(moment(), 'days');
        return diff > acc ? diff : acc;
      }
      return acc;
    }, 0)
    : 0;

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
      {clientInfo.membership_active && (
        <>
          <Link to={"/training-registration"}>
            <div style={getStyleNav("/training-registration")}>
              Training registration
            </div>
          </Link>
          <Link to={"/purchase"}>
            <div style={getStyleNav("/purchase")}>Purchase</div>
          </Link>
        </>
      )}
      {clientInfo.id === 1 && (
        <Link to={"/admin-page"}>
          <div style={getStyleNav("/admin-page")}>Admin Page</div>
        </Link>
      )}

      <Link to={"/auth"} className="but" onClick={logout}>
        <div style={getStyleNav("/auth")}>Logout</div>
      </Link>
      {clientInfo.membership_active && (
        <div className="membership-info">
          Абонемент закончится через {remainingDays} дней.
        </div>
      )}
    </div>
  );
}
