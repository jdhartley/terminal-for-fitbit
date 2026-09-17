import { me } from 'appbit';
import clock from 'clock';
import { today, minuteHistory } from 'user-activity';

import Dataline from './Dataline';
import { swapClass, numberFormat } from '../utils';
import { summarizeHourlySteps, formatHourlySteps } from './hourly-steps';

export default ({ showHourly = false } = {}) => new Dataline({
    name: 'STEP',
    checkPermissions() {
        return me.permissions.granted('access_activity');
    },
    updateValue(event = {}) {
        const raw = today.adjusted.steps || 0;
        const unit = `step${raw === 1 ? '' : 's'}`;

        if (showHourly) {
            const date = event.date || new Date();
            const minuteKey = `${Math.floor(date.getTime() / 60000)}:${date.getTimezoneOffset()}`;
            if (this.minuteKey !== minuteKey) {
                const minutes = date.getMinutes();
                this.hourlySteps = '0';
                if (minutes > 0) {
                    try {
                        this.hourlySteps = summarizeHourlySteps(minuteHistory.query({ limit: minutes }), minutes);
                    } catch (error) {
                        this.hourlySteps = '--';
                    }
                }
                this.minuteKey = minuteKey;
            }
            this.valueRef.text = formatHourlySteps(raw, this.hourlySteps);
        } else {
            this.valueRef.text = `${numberFormat(raw)} ${unit}`;
        }
        swapClass(this.valueRef.root, 'color', 'purple');
    },
    start() {
        this.minuteKey = undefined;
        clock.addEventListener('tick', this.updateValue);
    },
    stop() {
        clock.removeEventListener('tick', this.updateValue);
    },
});
