import { EmailEnum } from "../enums/email.enum";

type IEmailData = {
    subject: string;
    template: string;
};

type IEmailConstants<T extends Record<string, string>> = {
    [K in keyof T]: IEmailData;
};

export const emailConstants: IEmailConstants<typeof EmailEnum> = {
    [EmailEnum.WELCOME]: { subject: "Welcome", template: "Welcome" },
    [EmailEnum.ACTIVATE]: { subject: "ACTIVATE ACCOUNT", template: "ACTIVATE" },
    [EmailEnum.RECOVERY]: {
        subject: "RECOVERY PASSWORD",
        template: "RECOVERY",
    },
};

export type { IEmailConstants, IEmailData };
