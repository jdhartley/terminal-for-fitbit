import * as messaging from 'messaging';
import { settingsStorage } from 'settings';

function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val)
    });
  }
}

function sendSettingData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log('No peerSocket connection');
  }
}

settingsStorage.addEventListener('change', (evt) => {
  if (evt.oldValue !== evt.newValue) {
      sendValue(evt.key, evt.newValue);
  }
});
