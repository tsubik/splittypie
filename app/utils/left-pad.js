export default function leftPad(pad, string) {
    return pad.substring(0, pad.length - string.length) + string;
}
