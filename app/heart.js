import { me } from 'appbit';
import { display } from 'display';
import { HeartRateSensor } from 'heart-rate';
import { user } from 'user-profile';

let hrm, watchID, hrmCallback;
let lastReading = 0;
let heartRate;

export default function onHeartUpdate(callback) {
  if (me.permissions.granted('access_heart_rate') && me.permissions.granted('access_user_profile')) {
    hrmCallback = callback;
    hrm = new HeartRateSensor();
    setupEvents();
    start();
    lastReading = hrm.timestamp;
  } else {
    callback({
      bpm: '???'
    });
  }
}

function getReading() {
  if (hrm.timestamp === lastReading) {
    heartRate = '--';
  } else {
    heartRate = hrm.heartRate || '--';
  }
  lastReading = hrm.timestamp;
  hrmCallback({
    bpm: heartRate,
    zone: user.heartRateZone(hrm.heartRate || 0),
  });
}

function setupEvents() {
  display.addEventListener('change', function() {
    if (display.on) {
      start();
    } else {
      stop();
    }
  });
}

function start() {
  if (!watchID) {
    hrm.start();
    getReading();
    watchID = setInterval(getReading, 1000);
  }
}

function stop() {
  hrm.stop();
  clearInterval(watchID);
  watchID = null;
}
