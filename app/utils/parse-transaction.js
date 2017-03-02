import moment from "moment";

const parseAmount = (text) => {
    const amount = parseFloat(text.replace(",", "."));
    if (isNaN(amount)) return null;
    return amount;
};

const parseMomentDate = (text) => {
    if (text.length > 5) {
        return moment(text, "YYYYMMDD").utc();
    } else if (text.length > 2) {
        return moment(text, "MMDD").utc();
    }
    return moment(text, "DD").utc();
};

const parseDate = date => date.toISOString().substring(0, 10);

export default function parseTransaction(transactionText) {
    if (!transactionText || !transactionText.trim()) return null;

    const parts = transactionText.trim().split(" ");
    let date = moment();
    let name = null;
    let amount = null;
    if (parts.length <= 2) {
        amount = parseAmount(parts[0]);
        name = amount ? parts[1] : parts.join(" ");
    } else if (parseAmount(parts[1])) {
        amount = parseAmount(parts[1]);
        date = parseMomentDate(parts[0]);
        name = parts.slice(2).join(" ");
    } else {
        amount = parseAmount(parts[0]);
        name = parts.slice(1).join(" ");
    }

    if (!date.isValid()) date = moment();

    return {
        amount,
        date: parseDate(date),
        name: name || null
    };
}
