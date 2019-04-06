export function prefix(str: string, value: string, width: number): string {
    while (str.length < width) {
        str = `${value}${str}`;
    }
    return str;
}

export function formatSeconds(time: number) {
    const ms = (Math.floor((time - Math.floor(time)) * 1000) / 1000) * 1000;
    const s = Math.floor(time) % 60;
    const m = Math.floor((time - s) / 60);
    return `${prefix(m.toString(), "0", 2)}:${prefix(s.toString(), "0", 2)}.${prefix(ms.toString(), "0", 3)}`;
}
