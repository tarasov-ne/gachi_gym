import React from "react";
import { useAtom } from "jotai";
import { Link, useLocation } from "react-router-dom";
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
    const endDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    apiAxiosInstance.post("/visitStatisticInsert", {
      client_id: clientInfo.id,
      start_date: localStorage.getItem("start_date"),
      start_time: localStorage.getItem("start_time"),
      end_date: endDateTime.split(" ")[0],
      end_time: endDateTime.split(" ")[1],
    });

    setIsLoggedIn(false);
    localStorage.clear();
  }

  return (
    <div className="appNavbar">
      <Link to={"/"}>
        <div style={getStyleNav("/")}>Абонементы</div>
      </Link>
      {clientInfo.membership_active && (
        <>
          <Link to={"/training-registration"}>
            <div style={getStyleNav("/training-registration")}>
              Занятия
            </div>
          </Link>
          <Link to={"/purchase"}>
            <div style={getStyleNav("/purchase")}>Магазин</div>
          </Link>
        </>
      )}
      {clientInfo.id === 1 && (
        <Link to={"/admin-page"}>
          <div style={getStyleNav("/admin-page")}>Управление</div>
        </Link>
      )}

      <Link to={"/auth"} className="but" onClick={logout}>
        <div style={getStyleNav("/auth")}>Выйти</div>
      </Link>
      {clientInfo.membership_active && (
        <div className="membership-info">
          Абонемент закончится через {remainingDays} дней.
        </div>
      )}
    </div>
  );
}
