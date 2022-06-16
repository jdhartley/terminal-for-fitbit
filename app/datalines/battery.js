import { battery } from 'power';
import { clock } from 'clock';

import Dataline from './Dataline';
import { swapClass } from '../utils';

export default new Dataline({
    name: 'BATT',
    updateValue() {
        const level = Math.floor(battery.chargeLevel);
        const isCharging = battery.charging;
        const showChargingHash = isCharging && (new Date()).getSeconds() % 2 === 0;
        const hashCount = Math.min(10, Math.floor(level / 10) + (showChargingHash ? 1 : 0));
        const dotCount = 10 - hashCount;

        const hashes = '#'.repeat(hashCount);
        const dots = '.'.repeat(dotCount);
        const spacer = level < 100 ? ' ' : '';

        this.labelRef.text = `[${isCharging ? 'CHRG' : 'BATT'}]`;
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
        this.onChargeHandler = () => {
            if (battery.charging) {
                clock.addEventListener('tick', this.updateValue);
            } else {
                clock.removeEventListener('tick', this.updateValue);
            }
        };

        battery.addEventListener('change', this.updateValue);
        battery.addEventListener('change', this.onChargeHandler);
    },
    stop() {
        battery.removeEventListener('change', this.updateValue);

        clock.removeEventListener('tick', this.updateValue);
        battery.removeEventListener('change', this.onChargeHandler);

        delete this.onChargeHandler;
    },
});
