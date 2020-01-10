import document from 'document';
import device from 'device';
import { preferences, units } from 'user-settings';
import { createFontFit, zeroPad } from '../common/utils';
import 'string.prototype.repeat';

import clock from 'clock';
import { battery } from 'power';
import onActivityUpdate from './activity';
import onHeartUpdate from './heart';
import onSettingsChange from './settings';

const IS_GEMINI = device.modelId === '38';

// Labels
const host = String(device.modelName)
  .split(' ')[0]
  .toLowerCase();

const labels = [
  'TIME',
  'DATE',
  'BATT',
  'STEP',
  IS_GEMINI ? 'DIST' : 'LVLS',
  'HRRT',
];

Object.keys(labels).forEach((id, index) => {
  const elem = createFontFit('label' + index);
  elem.text = '[' + labels[id] + ']';
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
const timeValue = createFontFit('value0');
const dateValue = createFontFit('value1');
clock.granularity = 'minutes';
clock.addEventListener('tick', (evt) => {
  const date = evt.date;
  timeValue.text = getTimeValue(date);
  dateValue.text = getDateValue(date);
});

// Battery
const battValueElem = document.getElementById('value2');
const battValue = createFontFit(battValueElem);
function onBatteryChange() {
  battValue.text = getBatteryValue();
  updateBatteryColor();
}
battery.addEventListener('change', onBatteryChange);
onBatteryChange();

// Activity: Steps and Levels
const stepValue = createFontFit('value3');
const value4 = createFontFit('value4');

onActivityUpdate(({ steps, levels, distance }) => {
  stepValue.text = steps;
  value4.text = IS_GEMINI ? distance : levels;
});

// Heart Rate
const hrrtValue = createFontFit('value5');

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
