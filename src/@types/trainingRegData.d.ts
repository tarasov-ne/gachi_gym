import { SlotInfo } from "react-big-calendar";

type TTrainingReg = {
    id: number;
    client: TClientData;
    trainer: TTrainerData;
    date: string;
    start: SlotInfo;
    end: string;
}