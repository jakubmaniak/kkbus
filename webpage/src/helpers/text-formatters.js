export const routeFormatter = (item) => {
    return (typeof item === 'string')
        ? item
        : `${item.a.departureLocation} - ${item.b.departureLocation}`;
};