import { me } from 'appbit';
import clock from 'clock';
import { today } from 'user-activity';
import { units } from 'user-settings';

import Dataline from './Dataline';
import { swapClass } from '../utils';

export default new Dataline({
    name: 'DIST',
    checkPermissions() {
        return me.permissions.granted('access_activity');
    },
    updateValue() {
        const meters = today.adjusted.distance || 0;
        const raw = meters / (units.distance === 'us' ? 1609 : 1000);
        const unit = units.distance === 'us' ? 'mi' : 'km';

        this.valueRef.text = `${(Math.round(raw * 100) / 100).toFixed(2)} ${unit}`;
        swapClass(this.valueRef.root, 'color', 'orange');
    },
    start() {
        clock.addEventListener('tick', this.updateValue);
    },
    stop() {
        clock.removeEventListener('tick', this.updateValue);
    },
});
