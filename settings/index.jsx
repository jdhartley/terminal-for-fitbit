import { getPossibleDatalineOptions, OPTIONS_THEMES, OPTIONS_FONTS } from '../common/settings.js';

const safeJsonParse = (json, fallback = []) => {
  try {
    return JSON.parse(json) || fallback;
  } catch (e) {
    return fallback;
  }
}

registerSettingsPage((props) => {
  const hasElevationGain = props.settingsStorage.getItem('hasElevationGain') === 'true';
  const OPTIONS_DATA_POINTS = getPossibleDatalineOptions({ hasElevationGain });

  return (
    <Page>
      <Button
        list
        label="[DEBUG] Clear Settings Storage"
        onClick={() => props.settingsStorage.clear()}
      />

      <Section
        title="Appearance"
      >
        <TextInput
          label="Username (will appear as user@host)"
          placeholder="user"
          settingsKey="username"
          action="sudo usermod -l"
        />
        <Select
          label="Font"
          settingsKey="font"
          options={OPTIONS_FONTS}
        />

        <Select
          label="Color theme"
          settingsKey="theme"
          options={OPTIONS_THEMES}
          renderItem={
            (option) =>
              <TextImageRow
                label={option.name}
                sublabel={option.description}
                icon="https://d33wubrfki0l68.cloudfront.net/db7b86d698061d9adb251fd1bc9de0af88e5f27d/c8b5f/images/watchface.png"
              />
          }
        />
      </Section>

      <Section
        title="Clock face data"
      >
        <AdditiveList
          settingsKey="datalines"
          maxItems="6"
          addAction={
            safeJsonParse(props.settings.datalines).length >= 6
            ? <Text italic>All rows are full</Text>
            : <Select
                label="Add Item"
                options={OPTIONS_DATA_POINTS}
              />
          }
        />
      </Section>
    </Page>
  );
});
