import * as document from 'document';
import device from 'device';
import clock from 'clock';
import { FitFont } from 'fitfont';

import 'string.prototype.repeat';
import 'polyfill-array-includes';

import { peerSocket } from 'messaging';
import onSettingsChange from './settings';
import { hasElevationGain } from './config';

import TIME from './datalines/time';
import DATE from './datalines/date';
import BATT from './datalines/battery';
import STEP from './datalines/steps';
import DIST from './datalines/distance';
import LVLS from './datalines/levels';
import HRRT from './datalines/heartrate';
import { swapClass } from './utils';

// Set our clock granularity to seconds to update lines.
// The `tick` event does not fire when the screen is off.
clock.granularity = 'seconds';


peerSocket.addEventListener('open', () => {
	peerSocket.send({
		type: 'config',
		data: { hasElevationGain },
    });
});

const host = String(device.modelName)
    .split(' ')[0]
    .toLowerCase();



const allDatalines = { TIME, DATE, BATT, STEP, DIST, LVLS, HRRT };

const updatePromptLine = (function() {
    let bottomLabel;
    let command;
    let cursor;

    const updateValue = () => {
        if (!bottomLabel) {
            return;
        }

        if (!cursor || cursor === 'none') {
            bottomLabel.text = command;
            return;
        }

        bottomLabel.text = `${command} ${cursor}`;

        setTimeout(() => {
            if (bottomLabel) bottomLabel.text = command;
        }, 500);
    };

    return (...args) => {
        [bottomLabel, command, cursor] = args;

        clock.removeEventListener('tick', updateValue);

        if (!cursor || cursor === 'none') {
            updateValue();
            return;
        }

        clock.addEventListener('tick', updateValue);
    };
})();

onSettingsChange((settings) => {
    const font = settings.font.values[0].value;
    const cursor = settings.cursor.values[0].value;

    function text(id) {
        return new FitFont({ id, font });
    }

    const lines = [
        { label: text('label0'), value: text('value0') },
        { label: text('label1'), value: text('value1') },
        { label: text('label2'), value: text('value2') },
        { label: text('label3'), value: text('value3') },
        { label: text('label4'), value: text('value4') },
        { label: text('label5'), value: text('value5') },
    ];

    // Username
    const topLabel = text('TOP');
    const bottomLabel = text('BOTTOM');

    const username = settings.username || 'user';
    const command = `${username}@${host}:~ $`;

    topLabel.text = `${command} now`;

    updatePromptLine(bottomLabel, command, cursor);

    const theme = settings.theme.values[0].value;

    [document.getElementById('Root'), document.getElementById('Labels')]
        .forEach((elem) => swapClass(elem, 'theme', theme));

    const datalines = settings.datalines || [];
    const newDatalineNames = datalines.map((dp) => dp.value);

    const linesToUpdate = lines.slice(0, datalines.length);
    const linesToClear = lines.slice(datalines.length);

    // Disable datalines that are no longer needed
    Object.keys(allDatalines)
        .filter((dp) => !newDatalineNames.includes(dp))
        .forEach((dp) => allDatalines[dp].disable());

    // Move datalines to their new row
    linesToUpdate.forEach((row, index) => {
        const key = newDatalineNames[index];
        allDatalines[key].update(row.label, row.value, theme);
    });

    // Clear out text in now-empty rows
    linesToClear.forEach((row) => {
        // Note a bug in FitFont where setting to empty string does not work
        // https://github.com/gregoiresage/fitfont/issues/3
        row.label.text = ' ';
        row.value.text = ' ';
    });

    // Position the bottom label based on how many lines we have
    const isIonicScreen = device.screen.height === 250;
    const startingPosition = isIonicScreen ? 210 : 255;
    const lineSpacing = isIonicScreen ? 30 : 37;
    const missingLines = 6 - datalines.length;
    document.getElementById('BOTTOM').y = startingPosition - (lineSpacing * missingLines);
});
