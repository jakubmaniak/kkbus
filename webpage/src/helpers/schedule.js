function hour(time, { ceil = false } = {}) {
    if (ceil) {
        return Math.ceil(parseFloat(time.replace(':', '.')));
    }

    return parseInt(time, 10);
}

function minute(time) {
    return parseInt(time.split(':')[1]);
}

function overlaps(a, b) {
    return a.end.minute != 0 && hour(a.end.hour) == hour(b.start.hour);
}

function transformEntries(entries) {
    return entries.map((entry) => {
        let start = {
            index: hour(entry.startHour),
            hour: hour(entry.startHour),
            minute: minute(entry.startHour)
        };
        let end = {
            index: hour(entry.endHour, { ceil: true }),
            hour: hour(entry.endHour),
            minute: minute(entry.endHour)
        };

        if (end.index == start.index) end.index++;

        return {
            span: end.index - start.index,
            pretty: entry.startHour + ' - ' + entry.endHour,
            start,
            end
        };
    });
}

function aggregateOverlappingEntries(entries) {
    let groups = [];
    let stack = [];

    for (let entry of entries) {
        let overlapping = false;

        for (let stackedEntry of stack) {
            overlapping ||= overlaps(stackedEntry, entry);

            if (overlapping) break;
        }

        if (overlapping) {
            stack.push(entry);
            continue;
        }
        
        if (stack.length) {
            groups.push(stack);
        }

        stack = [entry];
    }

    groups.push(stack);

    return groups;
}

function groupEntries(groups) {
    return groups.map((entries) => {
        let startIndex = Math.min(...entries.map((entry) => entry.start.index));
        let endIndex = Math.max(...entries.map((entry) => entry.end.index));

        return {
            startIndex,
            endIndex,
            totalSpan: endIndex - startIndex,
            entries
        };
    });
}

function boilGroups(groups) {
    return groups.map((group) => {
        group.entries = group.entries.map((entry, index) => {
            entry.level = index;
            return entry;
        });

        let levels = group.entries.map((entry) => new Set([entry]));

        for (let entry of group.entries) {
            if (entry.level == 0) {
                continue;
            }

            for (let level = 0; level < entry.level; level++) {
                let boils = ![...levels[level]].some((levelEntry) => {
                    return (levelEntry.start.index > entry.end.index || entry.start.index < levelEntry.end.index);
                });

                if (boils) {
                    levels[entry.level].delete(entry);
                    levels[level].add(entry);
                    entry.level = level;
                }
            }
        }

        return group;
    });
}

export default function organizeEntries(data) {
    return boilGroups(
        groupEntries(
            aggregateOverlappingEntries(
                transformEntries(data)
            )
        )
    );
}


/*
let entries = [
    { startHour: '09:00', endHour: '09:30' },
    { startHour: '09:30', endHour: '10:30' },
    { startHour: '10:30', endHour: '10:45' },
    { startHour: '10:45', endHour: '12:15' },
    { startHour: '12:15', endHour: '12:30' },
    { startHour: '13:00', endHour: '13:30' },
    { startHour: '14:00', endHour: '15:00' },
    { startHour: '15:00', endHour: '16:30' },
    { startHour: '17:00', endHour: '17:30' },
    { startHour: '17:30', endHour: '18:00' },
    { startHour: '18:00', endHour: '18:30' },
    { startHour: '20:00', endHour: '23:30' }
];

let transformedEntries = transformEntries(entries);
let aggregatedEntries = aggregateOverlappingEntries(transformedEntries);
let groupedEntries = groupEntries(aggregatedEntries);
let boiledGroups = boilGroups(groupedEntries);



const readline = require('readline');
const con = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const interface = (input) => {
    input = input.toLowerCase();

    if (input == 'src') console.dir(entries, { depth: 4 });
    else if (input == 'aggregate') console.dir(aggregatedEntries, { depth: 4 });
    else if (input == 'group') console.dir(groupedEntries, { depth: 4 });
    else if (input == 'transform') console.dir(transformedEntries, { depth: 4 });
    else if (input == 'boil') console.dir(boiledGroups, { depth: 4 });
    else if (input == 'exit') process.exit();
    else if (input == 'clear') console.clear();

    con.question('> ', interface);
};

con.question('> ', interface);
*/