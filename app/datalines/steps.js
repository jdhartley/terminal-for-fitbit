import { me } from 'appbit';
import clock from 'clock';
import { today } from 'user-activity';

import Dataline from './Dataline';
import { swapClass, numberFormat } from '../utils';

export default new Dataline({
    name: 'STEP',
    checkPermissions() {
        return me.permissions.granted('access_activity');
    },
    updateValue() {
        const raw = today.adjusted.steps || 0;
        const unit = `step${raw === 1 ? '' : 's'}`;

        this.valueRef.text = `${numberFormat(raw)} ${unit}`;
        swapClass(this.valueRef.root, 'color', 'purple');
    },
    start() {
        clock.addEventListener('tick', this.updateValue);
    },
    stop() {
        clock.removeEventListener('tick', this.updateValue);
    },
});
