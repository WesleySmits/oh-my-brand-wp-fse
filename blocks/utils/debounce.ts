export default function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number = 100
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return function (this: unknown, ...args: Parameters<T>): void {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}
