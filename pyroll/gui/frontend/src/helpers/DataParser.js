export const parseNumericValue = (value) => {
        if (value === undefined || value === null || value === '') {
            return '';
        }

        const numValue = Number(value);
        return !isNaN(numValue) ? numValue : value;
    };