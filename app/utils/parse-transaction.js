import moment from "moment";

const parseAmount = (text) => {
    const amount = parseFloat(text.replace(",", "."));
    if (isNaN(amount)) return null;
    return amount;
};

const parseMomentDate = (text) => {
    if (text.length > 5) {
        return moment(text, "YYYYMMDD");
    } else if (text.length > 2) {
        return moment(text, "MMDD");
    }
    return moment(text, "DD");
};

const parseDate = date => date.format("YYYY-MM-DD");

export default function parseTransaction(transactionText) {
    if (!transactionText || !transactionText.trim()) return null;

    const parts = transactionText.trim().split(" ");
    const onlyMePattern = /\.\s*me\s*$/;
    let date = moment().utc();
    let name = null;
    let amount = null;
    let onlyMe = false;
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
    if (name && onlyMePattern.test(name)) {
        name = name.replace(onlyMePattern, "");
        onlyMe = true;
    }

    return {
        amount,
        date: parseDate(date),
        name: name || null,
        onlyMe
    };
}
