export function fromValue(setter) {
    return (ev) => {
        setter(ev.target.value);
    };
}

export function intFromValue(setter) {
    return (ev) => {
        let int = parseInt(ev.target.value);

        if (isNaN(int)) {
            throw new TypeError('Entered value cannot be parsed to integer');
            //console.error('Entered value cannot be parsed to integer');
            //return;
        }

        setter(int);
    };
}

export function floatFromValue(setter) {
    return (ev) => {
        let float = parseFloat(ev.target.value);

        if (isNaN(float)) {
            throw new TypeError('Entered value cannot be parsed to float');
            //console.error('Entered value cannot be parsed to float');
            //return;
        }

        setter(float);
    };
}