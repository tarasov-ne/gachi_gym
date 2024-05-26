import { atom, useAtom } from "jotai";
import { Routes, Route, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate()

  useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const response = await apiAxiosInstance.get("/session");
      setUserInfo((response.data as TSessionData).user);
      setIsLoggedIn((response.data as TSessionData).authenticated);
      return response.data as TSessionData;
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
