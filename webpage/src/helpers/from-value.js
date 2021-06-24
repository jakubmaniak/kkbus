export function fromValue(setter) {
    return (ev) => {
        setter(ev.target.value);
    };
}