import document from 'document';
import device from 'device';
import { preferences } from 'user-settings';
import { createFontFit, zeroPad } from '../common/utils';
import 'string.prototype.repeat';

import clock from 'clock';
import { battery } from 'power';
import onActivityUpdate from './activity';
import onHeartUpdate from './heart';
import onSettingsChange from './settings';

// Labels
const host = String(device.modelName)
  .split(' ')[0]
  .toLowerCase();

const labels = {
  'TIME': '[TIME]',
  'DATE': '[DATE]',
  'BATT': '[BATT]',
  'STEP': '[STEP]',
  'LVLS': '[LVLS]',
  'HRRT': '[HRRT]',
};

Object.keys(labels).forEach((id) => {
  const elem = createFontFit(id);
  elem.text = labels[id];
});

// Username
const topLabel = createFontFit('TOP');
const bottomLabel = createFontFit('BOTTOM');
function updateUsername(settings) {
  const username = settings && settings.username && settings.username.name || 'user';
  const command = `${username}@${host}:~ $`;

  topLabel.text = `${command} now`;
  bottomLabel.text = command;
}
updateUsername();
onSettingsChange(updateUsername);


// Date and Time
const timeValue = createFontFit('TIME-value');
const dateValue = createFontFit('DATE-value');
clock.granularity = 'minutes';
clock.addEventListener('tick', (evt) => {
  const date = evt.date;
  timeValue.text = getTimeValue(date);
  dateValue.text = getDateValue(date);
});

// Battery
const battValueElem = document.getElementById('BATT-value');
const battValue = createFontFit(battValueElem);
function onBatteryChange() {
  battValue.text = getBatteryValue();
  updateBatteryColor();
}
battery.addEventListener('change', onBatteryChange);
onBatteryChange();

// Activity: Steps and Levels
const stepValue = createFontFit('STEP-value');
const lvlsValue = createFontFit('LVLS-value');

onActivityUpdate(({ steps, levels }) => {
  stepValue.text = `${steps.pretty} step${steps.raw === 1 ? '' : 's'}`;
  lvlsValue.text = `${levels.pretty} floor${levels.raw === 1 ? '' : 's'}`;
});

// Heart Rate
const hrrtValue = createFontFit('HRRT-value');

onHeartUpdate(({ bpm, zone: rawZone }) => {
  if (bpm === '--') {
    hrrtValue.text = '--';
    return;
  }

  let zone = '';
  if (rawZone && rawZone !== 'out-of-range') {
    zone = ` ${rawZone}`;
  }
  hrrtValue.text = `${bpm} bpm${zone}`;
});

function getTimeValue(date) {
  let meridiem = '';
  let hours = date.getHours();
  const mins = zeroPad(date.getMinutes());

  if (preferences.clockDisplay === '12h') {
    meridiem = hours < 12 ? ' AM' : ' PM';
    hours = hours % 12 || 12;
  } else {
    hours = zeroPad(hours);
  }

  const rawOffset = date.getTimezoneOffset();
  const absoluteOffset = Math.abs(rawOffset);
  const offset = [
    (rawOffset < 0 ? '+' : '-'),
    ('00' + Math.floor(absoluteOffset / 60)).slice(-2),
    ':',
    ('00' + (absoluteOffset % 60)).slice(-2),
  ].join('');

  return `${hours}:${mins}${meridiem} ${offset}`;
}

function getDateValue(date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return [
    days[date.getDay()],
    months[date.getMonth()],
    date.getDate(),
    date.getFullYear(),
  ].join(' ');
}

function getBatteryValue() {
  const level = Math.floor(battery.chargeLevel);
  const hashCount = Math.floor(level / 10);
  const dotCount = 10 - hashCount;

  const hashes = '#'.repeat(hashCount);
  const dots = '.'.repeat(dotCount);
  const spacer = level < 100 ? ' ' : '';

  return `[${hashes}${dots}]${spacer}${level}%`;
}

function updateBatteryColor() {
  const level = Math.floor(battery.chargeLevel);

  let color = '#00aa00';
  if (level <= 25) {
    color = '#aa0000';
  } else if (level <= 35) {
    color = '#ffaa00';
  }

  battValueElem.style.fill = color;
}
