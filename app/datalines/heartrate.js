import { me } from 'appbit';
import { display } from 'display';
import { HeartRateSensor } from 'heart-rate';
import { user } from 'user-profile';

import Dataline from './Dataline';
import { swapClass } from '../utils';

const ZONES = {
    'out-of-range': '',
    'fat-burn': 'fat-burn',
    'cardio': 'cardio',
    'peak': 'peak',

    'below-custom': '',
    'custom': 'in zone',
    'above-custom': 'gt zone',
};

export default new Dataline({
    name: 'HRRT',
    checkPermissions() {
        return me.permissions.granted('access_heart_rate') && me.permissions.granted('access_user_profile');
    },
    updateValue() {
        const bpm = this.hrm.heartRate;

        if (this.hrm.timestamp === this.lastReadingTimestamp || !bpm) {
            this.valueRef.text = '--';
            return;
        }

        this.lastReadingTimestamp = this.hrm.timestamp;

        let zone = ZONES[user.heartRateZone(bpm)] || '';

        this.valueRef.text = `${bpm} bpm ${zone}`;
        swapClass(this.valueRef.root, 'color', 'red');
    },
    start() {
        this.hrm = new HeartRateSensor({ frequency: 1 });
        this.hrm.addEventListener('reading', this.updateValue);

        this.onDisplayChange = () => {
            if (display.on) {
                this.hrm.start();
            } else {
                this.hrm.stop();
            }
        };
        display.addEventListener('change', this.onDisplayChange);

        this.hrm.start();
    },
    stop() {
        this.hrm.stop();

        this.hrm.removeEventListener('reading', this.updateValue);
        display.removeEventListener('change', this.onDisplayChange);

        delete this.hrm;
        delete this.onDisplayChange;
    },
});
