import { me } from 'appbit';
import clock from 'clock';
import { today } from 'user-activity';

import Dataline from './Dataline';
import { swapClass } from '../utils';

export default new Dataline({
    name: 'AZMS',
    checkPermissions() {
        return me.permissions.granted('access_activity');
    },
    updateValue() {
        const raw = today.adjusted.activeZoneMinutes.total || 0;
        const unit = `minute${raw === 1 ? '' : 's'}`;

        this.valueRef.text = `${raw} ${unit}`;
        swapClass(this.valueRef.root, 'color', 'magenta');
    },
    start() {
        clock.addEventListener('tick', this.updateValue);
    },
    stop() {
        clock.removeEventListener('tick', this.updateValue);
    },
});
