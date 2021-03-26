export const routeFormatter = (item) => {
    return (typeof item === 'string')
        ? item
        : `${item.departureLocation} - ${item.arrivalLocation}`;
};