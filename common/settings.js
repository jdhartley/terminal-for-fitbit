const DATA_LINE_MAP = {
    TIME: 'Time',
    DATE: 'Date',
    BATT: 'Battery',
    STEP: 'Step count',
    LVLS: 'Elevation gain',
    DIST: 'Distance',
    HRRT: 'Heart rate',
    AZMS: 'Active Zone Minutes',
};

const getDatalineObjectByValue = (value) => {
    const name = DATA_LINE_MAP[value];
    return { name, value }
};


export const OPTIONS_THEMES = [
    { name: 'Default', description: 'Dark', value: 'DEFAULT' },
    { name: 'Dracula', description: 'Dark', value: 'DRACULA' },
    { name: 'Hopscotch', description: 'Dark', value: 'HOPSCOTCH' },
    { name: 'Solarized Dark', description: 'Dark', value: 'SOLARIZED_DARK' },
    { name: 'Solarized Light', description: 'Light', value: 'SOLARIZED_LIGHT' },
];

export const OPTIONS_FONTS = [
    { name: 'Source Code Pro', value: 'Source_Code_Pro_22' },
    { name: 'Hack', value: 'Hack_22' },
    { name: 'Fira Code', value: 'Fira_Code_22' },
    { name: 'Sudo', value: 'Sudo_30' },
    { name: 'Roboto Mono', value: 'Roboto_Mono_22' },
    { name: 'Nova Mono', value: 'NovaMono_24' },
];

export const OPTIONS_CURSORS = [
    { name: 'None (disable cursor blinking)', value: 'none' },
    { name: 'Full block', value: '█' },
    { name: 'Half block', value: '▌' },
    { name: 'I-Beam', value: '▏' },
    { name: 'Underline', value: '▁' },
];


export const getPossibleDatalineOptions = ({ hasElevationGain = false } = {}) => {
    return Object.keys(DATA_LINE_MAP)
        .filter(key =>  key !== 'LVLS' || hasElevationGain)
        .map(getDatalineObjectByValue);
};

export const getDefaultSettings = ({ hasElevationGain = false } = {}) => {
    const defaultDatalines = ['TIME', 'DATE', 'BATT', 'STEP', hasElevationGain ? 'DIST' : 'LVLS', 'HRRT'];

    return {
        username: 'user',
        font: { values: [OPTIONS_FONTS[0]], selected: [0] },
        theme: { values: [OPTIONS_THEMES[0]], selected: [0] },
        cursor: { values: [OPTIONS_CURSORS[0]], selected: [0] },
        datalines: defaultDatalines.map(getDatalineObjectByValue),
    };
};
