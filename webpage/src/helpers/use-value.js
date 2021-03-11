export function useValue(setter) {
    return (ev) => {
        setter(ev.target.value);
    };
}