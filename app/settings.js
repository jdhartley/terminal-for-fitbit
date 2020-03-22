import objectAssign from 'object-assign';
import { me as appbit } from 'appbit';
import { readFileSync, writeFileSync } from 'fs';
import { peerSocket } from 'messaging';
import { getDefaultSettings } from '../common/settings';
import { hasElevationGain } from './config';

const SETTINGS_TYPE = 'cbor';
const SETTINGS_FILE = 'settings.cbor';

let settings;
let settingsChangeCallback;

export default function onSettingsChange(callback) {
  settings = loadSettings();
  settingsChangeCallback = callback;
  settingsChangeCallback(settings);
}

// Received message containing settings data
peerSocket.addEventListener('message', function(event) {
  const { type, data } = event.data;
  if (type !== 'settings') {
    return;
  }

  settings = data;
  settingsChangeCallback(settings);
});

// Register for the unload event
appbit.addEventListener('unload', saveSettings);

// Load settings from filesystem
function loadSettings() {
  let savedSettings = {};
  try {
    savedSettings = readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
    if (typeof savedSettings === 'undefined') {
      savedSettings = {};
    }
  } catch (ex) {
    // Allow fallthrough
  }

  return objectAssign(getDefaultSettings({ hasElevationGain }), savedSettings);
}

// Save settings to the filesystem
function saveSettings() {
  if (typeof settings === 'undefined') {
    console.log('Was going to save settings as undefined, exiting');
    return;
  }

  console.log('Saving settings to filesystem');
  writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}
