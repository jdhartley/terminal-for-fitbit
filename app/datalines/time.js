import clock from 'clock';
import { preferences } from 'user-settings';

import Dataline from './Dataline';
import { zeroPad, swapClass } from '../utils';

export default ({
    showSeconds = false
} = {}) => new Dataline({
    name: 'TIME',
    showSeconds,
    updateValue(event = {}) {
        const is12HrFormat = preferences.clockDisplay === '12h';
        const date = event.date || new Date();

        let meridiem = '';
        let hours = date.getHours();
        const mins = zeroPad(date.getMinutes());
        const secs = this.showSeconds ? `:${zeroPad(date.getSeconds()) }` : '';

        if (is12HrFormat) {
            meridiem = hours < 12 ? ' AM' : ' PM';
            hours = hours % 12 || 12;
        } else {
            hours = zeroPad(hours);
        }

        const rawOffset = date.getTimezoneOffset();
        const absoluteOffset = Math.abs(rawOffset);
        const offset = [
            is12HrFormat && this.showSeconds && hours > 9 ? '' : ' ',
            (rawOffset < 0 ? '+' : '-'),
            ('00' + Math.floor(absoluteOffset / 60)).slice(-2),
            ':',
            ('00' + (absoluteOffset % 60)).slice(-2),
        ].join('');

        this.valueRef.text = `${hours}:${mins}${secs}${meridiem}${offset}`;
        swapClass(this.valueRef.root, 'color', 'green');
    },
    start() {
        clock.addEventListener('tick', this.updateValue);
    },
    stop() {
        clock.removeEventListener('tick', this.updateValue);
    },
});
