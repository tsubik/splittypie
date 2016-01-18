export default function (text) {
    return text.replace(/(\n|\r)/g, " ").replace(/\s+/g, " ").trim();
}
