import { numberFormat } from '../utils';

export function summarizeHourlySteps(records, minutes) {
    if (minutes === 0) return '0';

    let total = 0;
    let available = 0;
    // History is newest first; never include records from the preceding hour.
    for (let index = 0; index < minutes; index++) {
        const steps = records[index] && records[index].steps;
        if (typeof steps === 'number' && isFinite(steps) && steps >= 0 && Math.floor(steps) === steps) {
            total += steps;
            available++;
        }
    }

    if (available === 0) return '--';
    return `${total}${available < minutes ? '+' : ''}`;
}

export function formatHourlySteps(daily, hourly) {
    let value = `${numberFormat(daily)}  ▏ ${hourly} hr`;
    // Each value row has 18 glyph slots. Compact spacing before dropping grouping.
    if (value.length > 18) value = value.replace(' hr', 'hr');
    if (value.length > 18) value = value.replace(/,/g, '');
    if (value.length > 18) value = value.replace('  ▏ ', '▏ ');
    return value;
}
