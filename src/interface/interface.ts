import { TrackingOption } from "xero-node";
import { Dayjs } from "dayjs";
import { Focused } from 'react-credit-cards';

export interface IInvoice {
    contactID: any;
    trackingCategoryID: string;
    trackingOptionID: string | undefined;
    description: string;
    quantity: number;
    unitAmount: number;
    accountCode: string;
}

export interface ITrackingCategory {
    trackingCategoryID: string;
    name: string;
    status: string;
    options: TrackingOption[];
}

export interface ITrackingOption {
    trackingOptionID: string;
    name: string;
    status: string;
}

export interface IContact {
    firstname: string;
    lastname: string;
    address: string;
    phones: string[];
    email: string;
}

export interface IUnitDetails {
    numberOfUnits: number;
    startDate: Dayjs | null;
    deposit: number;
    administration: number;
    total: number;
}

export interface ICardDetails {
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    name: string;
    focused: Focused | undefined;
}