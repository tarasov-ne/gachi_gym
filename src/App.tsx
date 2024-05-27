import { atom, useAtom } from "jotai";
import { Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiAxiosInstance from "./api/axios.ts";
import AuthPage from "./AuthPage/AuthPage.tsx";
import ClientPage from "./ClientPage/ClientPage.tsx";
import AdminPageLayout from "./AdminPage/AdminPageLayout/AdminPageLayout.tsx";
import UserAddPage from "./AdminPage/AddUserPage/UserAddPage.tsx";
import AddTrainerPage from "./AdminPage/AddTrainerPage/AddTrainerPage.tsx";
import AdminStatistics from "./AdminPage/AdminStatistics/AdminStatistics.tsx";
import DatePicker from "./DatePicker/DatePicker.tsx";
import AddProductPage from "./AdminPage/AddProductPage/AddProductPage.tsx";
import AddMembershipPage from "./AdminPage/AddMembershipPage/AddMembershipPage.tsx";
import MembershipRegistrationPage from "./MembershipRegistrationPage/MembershipRegistrationPage.tsx";
import PurchasePage from "./PurchasePage/PurchasePage.tsx";
import RegistrationPage from "./RegistrationPage/RegistrationPage.tsx";
import TablesInfo from "./AdminPage/TablesInfo/TablesInfo.tsx";
import moment from "moment";

export const clientAtom = atom<TClientData>({
  id: 0,
  login: "",
  password: "",
  name: "",
  surname: "",
  phone_number: "",
  e_mail: "",
  membership_active: false,
});
export const logInAtom = atom<boolean>(false);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useAtom(logInAtom);
  const [clientInfo, setUserInfo] = useAtom(clientAtom);

  useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const response = await apiAxiosInstance.get("/session");
        const sessionData = response.data as TSessionData;
  
        setUserInfo(sessionData.user);
        setIsLoggedIn(sessionData.authenticated);
        return sessionData;
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          const endDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
          await apiAxiosInstance.post("/visitStatisticInsert", {
            client_id: clientInfo.id,
            start_date: localStorage.getItem("start_date"),
            start_time: localStorage.getItem("start_time"),
            end_date: endDateTime.split(" ")[0],
            end_time: endDateTime.split(" ")[1],
          });
        }
        throw error;
      }
    },
    gcTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchIntervalInBackground: true,
  });
  
  

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={isLoggedIn ? <ClientPage /> : <AuthPage />}>
        <Route
          index
          element={
            <div className="mainPageWrapper">
              <MembershipRegistrationPage />
            </div>
          }
        />
        <Route path="training-registration" element={<DatePicker />} />
        <Route path="purchase" element={<PurchasePage />} />
        <Route path="admin-page" element={<AdminPageLayout />}>
          <Route index element={<AdminStatistics />} />
          <Route path="info" element={<TablesInfo/>}/>
          <Route path="add-user" element={<UserAddPage />} />
          <Route path="add-trainer" element={<AddTrainerPage />} />
          <Route path="add-product" element={<AddProductPage />} />
          <Route path="add-membership" element={<AddMembershipPage />} />
        </Route>
      </Route>
      <Route path="/register" element={<RegistrationPage />} />
    </Routes>
  );
}
