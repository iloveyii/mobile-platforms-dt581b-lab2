export type ConditionT = {
    where?: any;
};

export type UserT = {
    id?: string | number;
    email: string;
    password: string
};

export type ResultT = {
    success: boolean;
    data: UserT;
};

export type ResponseT = {
    success: boolean
    data: any[],
};

export type ResponseT2 = {
    success: boolean
    action: ActionT,
};

export type ActionT = {
    id: string,
    type: string, // create read update delete
    form: FormT[], // list
    alert: AlertT[], // type: info, danger, warning, success
};

export type FormT = {
    key: string,
    value: string | number | boolean
};

export type AlertT = {
    type: "info" | "danger" | "warning" | "success"
    key: string,
    message: string
};
