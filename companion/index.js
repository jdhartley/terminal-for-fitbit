import { peerSocket } from 'messaging';
import { settingsStorage } from 'settings';

import { getDefaultSettings } from '../common/settings.js';

let settings = {};


const getTextSetting = (settingName) => {
    const hasElevationGain = settingsStorage.getItem('hasElevationGain') === 'true';
    const defaultValue = getDefaultSettings({ hasElevationGain })[settingName];

    const rawValue = settingsStorage.getItem(settingName);
    const value = JSON.parse(rawValue);

    if (!value) {
        settingsStorage.setItem(settingName, JSON.stringify({ name: defaultValue }));
        return defaultValue;
    }
    return value.name;
};

const getJsonSetting = (settingName) => {
    const hasElevationGain = settingsStorage.getItem('hasElevationGain') === 'true';
    const defaultValue = getDefaultSettings({ hasElevationGain })[settingName];

    const rawValue = settingsStorage.getItem(settingName);
    const value = JSON.parse(rawValue);

    if (!value) {
        settingsStorage.setItem(settingName, JSON.stringify(defaultValue));
        return defaultValue;
    }
    return value;
};

const build = () => {
    settings = {
        username: getTextSetting('username'),
        font: getJsonSetting('font'),
        theme: getJsonSetting('theme'),
        cursor: getJsonSetting('cursor'),
        datalines: getJsonSetting('datalines'),
    };
};

// Immediately build settings so we can use.
build();


function sendSettingData() {
    if (peerSocket.readyState === peerSocket.OPEN) {
        peerSocket.send({
            type: 'settings',
            data: settings,
        });
    } else {
        console.log('No peerSocket connection');
    }
}

settingsStorage.addEventListener('change', (event) => {
    build();
    sendSettingData();
});

// when the socket opens, send the current app settings
peerSocket.addEventListener('open', () => {
    sendSettingData();
});

// Let's save if we have elevation gain or not.
peerSocket.addEventListener('message', (event) => {
    const { type, data } = event.data;
    if (type === 'config') {
        settingsStorage.setItem('hasElevationGain', data.hasElevationGain);
    }
})
