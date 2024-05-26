import { useState } from "react";
import { Calendar, SlotInfo, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useQuery } from "@tanstack/react-query";
import apiAxiosInstance from "../api/axios";
import { clientAtom } from "../App";
import { useAtom } from "jotai";
import { toast } from "react-toastify";
import BookingPopup from "./Popup/Popup";
import { TTrainingReg } from "../@types/trainingRegData";

const localizer = momentLocalizer(moment);

export default function DatePicker() {
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [client] = useAtom(clientAtom);

  const { data, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get("/getTrainingRegistrations");
      console.log(res.data);
      return res.data as TTrainingReg[];
    },
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  const { data: membershipRegistration } = useQuery({
    queryKey: ["membershipRegistrations_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get("/getMembershipRegistrations");
      return res.data as TMemberShipReg[];
    },
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  const remainingDays = client.membership_active
    ? membershipRegistration?.reduce((acc, membership) => {
      if (membership.client_id === client.id) {
        const diff = moment(membership.end_date).diff(moment(), 'days');
        return diff > acc ? diff : acc;
      }
      return acc;
    }, 0)
    : 0;

  const events = data?.map((reg: TTrainingReg) => ({
    title: `Клиент ${reg.client.surname}, тренер ${reg.trainer.surname}`,
    start: moment(`${reg.date} ${reg.start}`, "YYYY-MM-DD HH:mm:ss").toDate(),
    end: moment(`${reg.date} ${reg.end}`, "YYYY-MM-DD HH:mm:ss").toDate(),
    appointment: reg,
  }));

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (moment(slotInfo.start).isBefore(moment(), "day")) {
      toast.error("Невозможно выбрать прошедшую дату");
      return;
    }
    const daysUntilSelectedSlot = moment(slotInfo.start).diff(moment(), 'days');
    if (remainingDays as any < daysUntilSelectedSlot) {
      toast.error("Невозможно записаться на занятие, так как срок действия абонемента истекает ранее выбранной даты.");
      return;
    }
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
  };

  const handleSelectEvent = (event: any) => {
    const appointment = event.appointment;
    if (appointment.client.id === client.id) {
      setSelectedEvent(event);
      setSelectedSlot({
        start: event.start,
        end: event.end,
        slots: [],
        action: "select",
      });
    }
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 1000 }}
        selectable={true}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
      {(selectedSlot || selectedEvent) && (
        <BookingPopup
          selectedSlot={selectedSlot}
          selectedEvent={selectedEvent}
          events={events}
          onClose={() => {
            setSelectedSlot(null);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
}
