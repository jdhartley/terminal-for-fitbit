import { battery } from 'power';

import Dataline from './Dataline';
import { swapClass } from '../utils';

export default new Dataline({
    name: 'BATT',
    updateValue() {
        const level = Math.floor(battery.chargeLevel);
        const hashCount = Math.floor(level / 10);
        const dotCount = 10 - hashCount;

        const hashes = '#'.repeat(hashCount);
        const dots = '.'.repeat(dotCount);
        const spacer = level < 100 ? ' ' : '';

        this.valueRef.text = `[${hashes}${dots}]${spacer}${level}%`;

        let color = 'green';
        if (level <= 25) {
            color = 'red';
        } else if (level <= 35) {
            color = 'orange';
        }
        swapClass(this.valueRef.root, 'color', color);
    },
    start() {
        battery.addEventListener('change', this.updateValue);
    },
    stop() {
        battery.removeEventListener('change', this.updateValue);
    },
});
