import { useEffect, useState } from "react";
import moment from "moment";
import Popup from "reactjs-popup";
import apiAxiosInstance from "../../api/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import "./Popup.css";
import { useAtom } from "jotai";
import { clientAtom } from "../../App";
import { SlotInfo } from "react-big-calendar";
import { queryClient } from "../../main";
import { TTrainingReg } from "../../@types/trainingRegData";

const BookingPopup = ({ selectedSlot, selectedEvent, events, onClose }: any) => {
  const { data } = useQuery({
    queryKey: ["trainers"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get("/getTrainers");
      return res.data as TTrainerData[];
    },
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  const [selectedTime, setSelectedTime] = useState<SlotInfo | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<TTrainerData | null>(
    null
  );
  const [client] = useAtom(clientAtom);
  useEffect(() => {
    if (selectedEvent) {
      setSelectedTime(moment(selectedEvent.start).format("HH:mm") as any);
      setSelectedTrainer(selectedEvent.appointment.trainer);
    }
  }, [selectedEvent]);

  const handleAddBooking = useMutation({
    mutationFn: (values: any) =>
        apiAxiosInstance.post("/trainingRegistrationInsert", values),

    onMutate: async (values: any) => {
      await queryClient.cancelQueries({ queryKey: ["appointments"] });
      const previousAppoinmentsData = queryClient.getQueryData([
        "appointments",
      ]) as TTrainingReg[];
      if (previousAppoinmentsData)
        queryClient.setQueryData(
          ["appointments"],
          [...previousAppoinmentsData, values]
        );
      return { previousAppoinmentsData };
    },

    mutationKey: ["appoinment_insert"],

    onError: (_err, _variables, context) => {
      if (context?.previousAppoinmentsData) {
        queryClient.setQueryData<TTrainingReg[]>(
          ["appointments"],
          context.previousAppoinmentsData as TTrainingReg[]
        );
      }
    },
    onSuccess: () => {
      setSelectedTime(null);
      setSelectedTrainer(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onClose();
    },
  });

  const handleUpdateBooking = useMutation({
    mutationFn: (values: any) => apiAxiosInstance.put(`/trainingRegistrationUpdate/${selectedEvent.appointment.id}`, values),

    onMutate: async (values: any) => {
      await queryClient.cancelQueries({ queryKey: ["appointments"] });
      const previousAppointmentsData = queryClient.getQueryData(["appointments"]) as TTrainingReg[];
      if (previousAppointmentsData)
        queryClient.setQueryData(
          ["appointments"],
          previousAppointmentsData.map(app => app.id === selectedEvent.appointment.id ? values : app)
        );
      return { previousAppointmentsData };
    },

    mutationKey: ["appointment_update"],

    onError: (_err, _variables, context) => {
      if (context?.previousAppointmentsData) {
        queryClient.setQueryData<TTrainingReg[]>(
          ["appointments"],
          context.previousAppointmentsData as TTrainingReg[]
        );
      }
    },
    onSuccess: () => {
      setSelectedTime(null);
      setSelectedTrainer(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onClose();
    },
  });

  const handleDeleteBooking = useMutation({
    mutationFn: (id: number) =>
      apiAxiosInstance.delete(
        `/trainingRegistrationDelete/${id}`
      ),

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["appointments"] });
      console.log(selectedEvent?.appoinment)
      const previousAppointmentsData = queryClient.getQueryData([
        "appointments",
      ]) as TTrainingReg[];
      if (previousAppointmentsData) {
        queryClient.setQueryData(
          ["appointments"],
          (previousAppointmentsData as TTrainingReg[]).filter(
            (app) => app.id != id
          )
        );
      }
      return { previousAppointmentsData };
    },
    mutationKey: ["appointment_delete"],
    onError: (_err, _variables, context) => {
      if (context?.previousAppointmentsData) {
        queryClient.setQueryData<TTrainingReg[]>(
          ["appointments"],
          context.previousAppointmentsData as TTrainingReg[]
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onClose();
    },
  });

  const handleTimeChange = (e: any) => {
    setSelectedTime(e.target.value);
  };

  const handleTrainerChange = (e: any) => {
    const selectedSurname = e.target.value;
    const selectedTrainer =
      data?.find(
        (trainer: TTrainerData) => trainer.surname === selectedSurname
      ) || null;
    setSelectedTrainer(selectedTrainer);
  };

  const renderTimeOptions = () => {
    const startTime = moment().hours(8).minutes(0);
    const endTime = moment().hours(22).minutes(0);
    const timeIntervals = [];
  
    while (startTime.isBefore(endTime)) {
      timeIntervals.push(startTime.format("HH:mm"));
      startTime.add(90, "minutes");
    }
  
    const occupiedTimeSlots = events?.filter((event: any) =>
      event.appointment.trainer.id === selectedTrainer?.id &&
      moment(event.start).isSame(moment(selectedSlot?.start), 'day')
    ).map((event: any) => ({
      start: moment(event.start).format("HH:mm"),
      end: moment(event.end).format("HH:mm"),
    }));
  
    const isTimeSlotAvailable = (time: string) => {
      return !occupiedTimeSlots.some((slot: any) => {
        const slotStart = moment(slot.start, "HH:mm");
        const slotEnd = moment(slot.end, "HH:mm");
        const currentTime = moment(time, "HH:mm");
        const currentEndTime = moment(time, "HH:mm").add(90, "minutes");
        
        // Check if the current time slot overlaps with an occupied slot
        if (currentTime.isBetween(slotStart, slotEnd, null, '[)') || currentEndTime.isBetween(slotStart, slotEnd, null, '(]')) {
          // Check if it's the same client booking with a different trainer
          if (slot.clientId === client.id && slot.trainerId !== selectedTrainer?.id) {
            return false; // Disable if client has booking with another trainer
          }
          // Check if the time slot is already taken by the same trainer
          if (slot.trainerId === selectedTrainer?.id) {
            return false; // Disable if time slot is already taken by the same trainer
          }
        }
        return true;
      });
    };
  
    return (
      <select className="popup-select" value={selectedTime as any || ""} onChange={handleTimeChange}>
        <option value="">Выберите время</option>
        {timeIntervals.map((time, index) => {
          const isAvailable = isTimeSlotAvailable(time);
          return (
            <option key={index} value={time} disabled={!isAvailable}>
              {time}-{moment(time, "HH:mm").add(90, "minutes").format("HH:mm")}
            </option>
          );
        })}
      </select>
    );
  };
  
  

  const handleSave = () => {
    const bookingData = {
      client: client,
      date: moment(selectedSlot?.start as any).format("YYYY-MM-DD"),
      start: selectedTime,
      trainer: selectedTrainer,
    };

    if (selectedEvent) {
      handleUpdateBooking.mutate(bookingData);
    } else {
      handleAddBooking.mutate(bookingData);
    }
  };

  return (
    <Popup
      open={true}
      modal
      closeOnDocumentClick
      onClose={onClose}
      className="popup-container"
    >
      <div className="popup-content">
        <h2 className="popup-header">
          {selectedEvent ? "Изменить запись на тренировку" : "Запись на тренировку"}
        </h2>
        <p>Дата: {moment(selectedSlot?.start).format("DD.MM.YYYY")}</p>
        <select className="popup-select" value={selectedTrainer?.surname || ""} onChange={handleTrainerChange}>
          <option className="popup-label" value="">
            Выберите тренера:
          </option>
          {data?.map((trainer, index) => (
            <option key={index} value={trainer.surname}>
              {trainer.surname}
            </option>
          ))}
        </select>
        <label className="popup-label">
          Время:
          {renderTimeOptions()}
        </label>
        <div className="popup-buttons">
          <button className="popup-button" onClick={handleSave}>
            Подтвердить
          </button>
          {selectedEvent && (
            <button
              className="popup-button"
              onClick={() => handleDeleteBooking.mutate(selectedEvent?.appointment.id)}
            >
              Удалить
            </button>
          )}
          <button className="popup-button" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default BookingPopup;
