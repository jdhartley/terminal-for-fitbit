import { me } from 'appbit';
import clock from 'clock';
import { today } from 'user-activity';

import Dataline from './Dataline';
import { swapClass } from '../utils';

export default new Dataline({
    name: 'LVLS',
    checkPermissions() {
        return me.permissions.granted('access_activity');
    },
    updateValue() {
        const raw = today.adjusted.elevationGain || 0;
        const unit = `floor${raw === 1 ? '' : 's'}`;

        this.valueRef.text = `+${raw} ${unit}`;
        swapClass(this.valueRef.root, 'color', 'orange');
    },
    start() {
        clock.addEventListener('tick', this.updateValue);
    },
    stop() {
        clock.removeEventListener('tick', this.updateValue);
    },
});
