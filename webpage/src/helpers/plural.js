export default function(value, singularNominativ, pluralNominativ, pluralGenitive = pluralNominativ) {
    value = Math.abs(parseInt(value, 10));

    if (value === 1) {
        return singularNominativ;
    }
    else if (/([^1]|^)[2-4]$/.test(value.toString().substr(-2))) {
        return pluralNominativ;
    }
    
    return pluralGenitive;
};