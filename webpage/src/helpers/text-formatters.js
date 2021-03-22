export const routeFormatter = (item) => {
    return (typeof item === 'string')
        ? item
        : `${item.a} - ${item.b}`;
};