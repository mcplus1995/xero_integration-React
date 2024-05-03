import Payment from "payment";

function clearNumber(value: string = ""): string {
    return value.replace(/\D+/g, "");
}

export function formatCreditCardNumber(value: string): string {
    if (!value) {
        return value;
    }

    const issuer: string = Payment.fns.cardType(value);
    const clearValue: string = clearNumber(value);
    let nextValue: string;

    switch (issuer) {
        case "amex":
            nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
                4,
                10
            )} ${clearValue.slice(10, 15)}`;
            break;
        case "dinersclub":
            nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
                4,
                10
            )} ${clearValue.slice(10, 14)}`;
            break;
        default:
            nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
                4,
                8
            )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
            break;
    }

    return nextValue.trim();
}

export function formatCVC(value: string, prevValue?: string, allValues: {[key: string]: string} = {}): string {
    const clearValue: string = clearNumber(value);
    let maxLength: number = 4;

    if (allValues.number) {
        const issuer: string = Payment.fns.cardType(allValues.number);
        maxLength = issuer === "amex" ? 4 : 3;
    }

    return clearValue.slice(0, maxLength);
}

export function formatExpirationDate(value: string): string {
    const clearValue: string = clearNumber(value);

    if (clearValue.length >= 3) {
        return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
    }

    return clearValue;
}

export function formatFormData(data: {[key: string]: string}): string[] {
    return Object.keys(data).map(d => `${d}: ${data[d]}`);
}
