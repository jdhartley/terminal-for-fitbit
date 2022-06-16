import { me } from 'appbit';
import clock from 'clock';
import { today, goals } from 'user-activity';

import Dataline from './Dataline';
import { swapClass, numberFormat } from '../utils';

export default new Dataline({
    name: 'CALS',
    checkPermissions() {
        return me.permissions.granted('access_activity');
    },
    updateValue() {
        const raw = today.adjusted.calories || 0;

        this.valueRef.text = `${numberFormat(raw)} Cal`;
        swapClass(this.valueRef.root, 'color', 'cyan');
    },
    start() {
        clock.addEventListener('tick', this.updateValue);
    },
    stop() {
        clock.removeEventListener('tick', this.updateValue);
    },
});
