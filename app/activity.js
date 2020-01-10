import { me } from 'appbit';
import clock from 'clock';
import { today } from 'user-activity';
import { units } from 'user-settings';

export default function onActivityUpdate(callback) {
  if (me.permissions.granted('access_activity')) {
    clock.granularity = 'seconds';
    clock.addEventListener('tick', () => {
        callback({
            steps: getSteps(),
            levels: getElevationGain(),
            distance: getDistance(),
        });
    });
  }
}

function getElevationGain() {
  const raw = today.adjusted.elevationGain || 0;
  const unit = `floor${raw === 1 ? '' : 's'}`;

  return `+${raw} ${unit}`;
}

function getSteps() {
  const raw = today.adjusted.steps || 0;
  const unit = `step${raw === 1 ? '' : 's'}`;

  return `${raw > 999 ? Math.floor(raw/1000) + ',' + ('00'+(raw%1000)).slice(-3) : raw} ${unit}`;
}

function getDistance() {
  const meters = today.adjusted.distance || 0;
  const raw = meters / (units.distance === 'us' ? 1609 : 1000);
  const unit = units.distance === 'us' ? 'mi' : 'km';

  return `${(Math.round(raw * 100) / 100).toFixed(2)} ${unit}`;
}
