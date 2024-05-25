type Time = {
    h: number;
    m: number;
}

type TimeStamp = {
    id?: number;
    date: Date;
    start: Time;
    end: Time;
    client: TClientData;
    trainer: TTrainerData;
}