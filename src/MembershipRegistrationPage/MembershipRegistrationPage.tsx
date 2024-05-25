import { useQuery } from "@tanstack/react-query";
import apiAxiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { queryClient } from "../main";
import { useMutation } from "@tanstack/react-query";
import { clientAtom } from "../App";
import "./MembershipRegistrationPage.css";
import { useAtom } from "jotai";
import moment from "moment";

export default function MembershipRegistrationPage() {
  const [clientInfo] = useAtom(clientAtom);
  const { data: memberships } = useQuery({
    queryKey: ["membership_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance("/getData");
      return res.data.Membership as TMemberShip[];
    },
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  const handleAddMembershipRegistration = useMutation({
    mutationFn: (values: any) =>
      apiAxiosInstance.post("/membershipRegistrationInsert", values),

    onMutate: async (values: any) => {
      await queryClient.cancelQueries({ queryKey: ["membershipReg_all"] });
      const previousMembershipRegData = queryClient.getQueryData([
        "membershipReg_all",
      ]) as TMemberShipReg[];
      if (previousMembershipRegData)
        queryClient.setQueryData(
          ["membershipReg_all"],
          [...previousMembershipRegData, values]
        );
      return { previousMembershipRegData };
    },

    mutationKey: ["membershipReg_all"],

    onError: (_err, _variables, context) => {
      if (context?.previousMembershipRegData) {
        queryClient.setQueryData<TMemberShipReg[]>(
          ["membershipReg_all"],
          context.previousMembershipRegData as TMemberShipReg[]
        );
      }
    },
    onSuccess: () => {
      toast.success("Абонемент успешно оформлен! Пожалуйста, обновите страницу.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["membershipReg_all"] });
    },
  });

  const handleMembershipClick = (membership: TMemberShip) => {
    if (clientInfo.membership_active) {
      toast.error("У вас уже есть активный абонемент.");
      return;
    } else {
      clientInfo.membership_active = true;
      handleAddMembershipRegistration.mutate({
        client_id: clientInfo.id,
        membership_id: membership.id,
        start_date: moment().format("YYYY-MM-DD"),
        end_date: moment()
          .add(membership.duration, "days")
          .format("YYYY-MM-DD"),
      });
    }
  };

  return (
    <div className="membership-registration">
      <h1>Membership Registration</h1>
      <div className="memberships">
        {memberships?.map((membership) => (
          <div key={membership.id} className="membership-card">
            <h2>{membership.name}</h2>
            <p>Цена: {membership.price} рублей</p>
            <p>Длительность: {membership.duration} дней</p>
            <button onClick={() => handleMembershipClick(membership)}>
              Оформить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
