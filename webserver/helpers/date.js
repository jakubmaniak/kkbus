module.exports.parseDate = (date) => {
    try {
        if (typeof date == 'number') {
            date = new Date(date);
        }

        if (date instanceof Date) {
            date = date.toJSON();
        }
    
        date = date.slice(0, 10);
        let parts = date.split(/[\.\-\/]/);
    
        if (parts.length < 3) {
            return null;
        }
        parts = parts.slice(0, 3);
    
        if (parts[2].length > 2) {
            parts = parts.reverse();
        }
    
        let d = new Date(parts.join('-'));
    
        if (isNaN(d)) {
            return null;
        }
    
        let text = d.toJSON().slice(0, 10);
    
        return {
            toString: () => text,
            toArray: () => text.split('-').map((i) => parseInt(i, 10)),
            toObject: () => new Date(text),
            addDays: (days) => {
                return this.parseDate(d.getTime() + days * 24 * 3600 * 1000);
            }
        };
    }
    catch {
        return null;
    }
};

module.exports.parseTime = (time) => {
    try {
        let t;

        if (typeof time == 'number') {
            time = new Date(time);
        }

        if (time instanceof Date) {
            t = new Date(time)
                .toJSON()
                .slice(11, 19)
                .split(':')
                .slice(0, 3);
        }
        else {
            t = time.split(':').slice(0, 3);
            
            if (t.length < 2) return null;
            if (t.length == 2) t.push(0);
        }

        t = t.map((i) => parseInt(i, 10))
            .map((i) => i.toString().padStart(2, '0'));

        if (t[0] == 24 && t[1] == 0) {
            t[0] = 0;
        }
        if (t[0] < 0 || t[0] > 23) return null;
        if (t[1] < 0 || t[1] > 59) return null;
        if (t[2] < 0 || t[2] > 59) return null;
    
        return {
            toString: (segments = 2) => t.slice(0, segments).join(':'),
            toArray: (segments = 2) => t.slice(0, segments)
        };
    }
    catch {
        return null;
    }
};

module.exports.parseDateTime = (datetime) => {
    let date, time;

    if (datetime instanceof Date) {
        date = this.parseDate(datetime);
        time = this.parseTime(datetime);
    }
    else if (typeof datetime == 'number') {
        date = this.parseDate(datetime);
        time = this.parseTime(datetime);
    }
    else {
        [date, time] = datetime.trim().split(/[T\s]/);

        date = this.parseDate(date);
        time = this.parseTime(time);
    }

    if (date == null || time == null) return null;
    
    return {
        getTime: () => time,
        getDate: () => date,
        toString: (timeSegments = 2) => date.toString() + ' ' + time.toString(timeSegments),
        toObject: () => new Date(date.toString() + ' ' + time.toString())
    };
};