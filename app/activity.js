import { me } from 'appbit';
import clock from 'clock';
import { today } from 'user-activity';

export default function onActivityUpdate(callback) {
  if (me.permissions.granted('access_activity')) {
    clock.granularity = 'seconds';
    clock.addEventListener('tick', () => {
        callback({
            steps: getSteps(),
            levels: getElevationGain(),
        });
    });
  }
}

function getElevationGain() {
  const raw = today.adjusted.elevationGain || 0;
  return {
    raw,
    pretty: `+${raw}`,
  }
}

function getSteps() {
  const raw = today.adjusted.steps || 0;
  return {
    raw,
    pretty: raw > 999 ? Math.floor(raw/1000) + ',' + ('00'+(raw%1000)).slice(-3) : raw,
  }
}
