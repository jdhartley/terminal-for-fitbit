import { me } from 'appbit';
import * as fs from 'fs';
import * as messaging from 'messaging';

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
messaging.peerSocket.addEventListener('message', function(evt) {
  settings[evt.data.key] = evt.data.value;
  settingsChangeCallback(settings);
})

// Register for the unload event
me.addEventListener('unload', saveSettings);

// Load settings from filesystem
function loadSettings() {
  try {
    const settings = fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
    if (typeof settings === 'undefined') {
      return {};
    }
    return settings;
  } catch (ex) {
    return {};
  }
}

// Save settings to the filesystem
function saveSettings() {
  if (typeof settings === 'settings') {
    console.log('Was going to save settings as undefined, exiting');
    return;
  }

  console.log('Saving settings to filesystem');
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}
