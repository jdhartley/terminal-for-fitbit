import clock from 'clock';

import Dataline from './Dataline';
import { swapClass } from '../utils';

clock.granularity = 'minutes';

export default new Dataline({
    name: 'DATE',
    updateValue(event = {}) {
        const date = event.date || new Date();

        // @TODO: localize the date string
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        this.valueRef.text = [
            days[date.getDay()],
            months[date.getMonth()],
            date.getDate(),
            date.getFullYear(),
        ].join(' ');
        swapClass(this.valueRef.root, 'color', 'cyan');
    },
    start() {
        clock.addEventListener('tick', this.updateValue);
    },
    stop() {
        clock.removeEventListener('tick', this.updateValue);
    },
});
