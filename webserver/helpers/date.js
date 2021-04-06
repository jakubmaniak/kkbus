module.exports.parseDate = (date) => {
    try {
        if (date instanceof Date) {
            date = date.toJSON();
        }
    
        if (typeof date == 'number') {
            date = new Date(date).toJSON()
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
            toArray: () => text.split('-').map((i) => parseInt(i)),
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