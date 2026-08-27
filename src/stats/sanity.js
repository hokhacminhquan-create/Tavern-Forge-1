/**
 * Evaluates constraints for a variable change.
 * @param {Object} variable
 * @param {any} currentValue
 * @param {any} newValue
 * @param {any} delta
 * @returns {Object} { allowed, clampedValue, flags, reason }
 */
export function checkConstraints(variable, currentValue, newValue, delta) {
    const result = { allowed: true, clampedValue: newValue, flags: [], reason: null };

    if (!validateValue(variable, newValue)) {
        result.allowed = false;
        result.reason = `Invalid value type for ${variable.type}`;
        return result;
    }

    if (variable.type === 'number') {
        let val = Number(newValue);
        
        if (variable.min !== undefined && variable.min !== null && val < variable.min) {
            val = variable.min;
        }
        if (variable.max !== undefined && variable.max !== null && val > variable.max) {
            val = variable.max;
        }

        if (variable.allowNegative === false && val < 0) {
            val = 0;
        }

        if (variable.canDecrease === false && val < Number(currentValue)) {
            result.allowed = false;
            result.reason = `${variable.name} cannot decrease.`;
            return result;
        }
        
        if (variable.canIncrease === false && val > Number(currentValue)) {
            result.allowed = false;
            result.reason = `${variable.name} cannot increase.`;
            return result;
        }

        if (variable.flagThreshold !== undefined && variable.flagThreshold !== null) {
            const diff = Math.abs(val - Number(currentValue));
            if (diff > variable.flagThreshold) {
                result.flags.push(`Large change: ${variable.tag} changed by ${diff}, exceeds threshold ${variable.flagThreshold}`);
            }
        }

        result.clampedValue = val;
    }

    return result;
}

/**
 * Validates a value against a variable type.
 * @param {Object} variable
 * @param {any} value
 * @returns {boolean}
 */
export function validateValue(variable, value) {
    switch (variable.type) {
        case 'number':
            return !isNaN(Number(value));
        case 'string':
            return typeof value === 'string';
        case 'boolean':
            return typeof value === 'boolean';
        case 'list':
            return Array.isArray(value);
        default:
            return true;
    }
}
