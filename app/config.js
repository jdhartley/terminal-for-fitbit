import { me as appbit } from 'appbit';
import { today } from 'user-activity';

export const hasElevationGain = appbit.permissions.granted('access_activity')
    && typeof today.local.elevationGain !== 'undefined';
