import {
  getPossibleDatalineOptions,
  OPTIONS_THEMES,
  OPTIONS_FONTS,
  OPTIONS_PROMPTS,
  OPTIONS_CURSORS,
} from '../common/settings.js';

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
  const isLongUsername = (safeJsonParse(props.settings.username).name || '').length > 8;

  return (
    <Page>
      <Section
        title="Configuration"
      >
        <TextInput
          label="Username (will appear as user@host)"
          placeholder="user"
          settingsKey="username"
          action="sudo usermod -l"
        />
        {isLongUsername &&
          <Text italic>Warning: usernames longer than 8 characters may cause other text to become clipped.</Text>}

        <Select
          label="Prompt ​ 🆕✨" // This line intentionally contains ZWSP unicode characters for spacing.
          settingsKey="prompt"
          options={OPTIONS_PROMPTS}
        />

        <Select
          label="Cursor"
          settingsKey="cursor"
          options={OPTIONS_CURSORS}
        />
      </Section>

      <Section
        title="Appearance"
      >
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
                icon={`https://terminal.watch/settings/theme__${option.value}.png`}
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
            ? <Text italic>All rows are full. Tap "Edit" to remove a row, then tap "Done" to add.</Text>
            : <Select
                label="Add Item"
                options={OPTIONS_DATA_POINTS}
              />
          }
        />
      </Section>

      <Section
        title="Feature requests and bug reports"
        description="Made with <3 by JD Hartley"
      >
        <Text><Text bold>Terminal</Text> is an open source clock face.</Text>
        <Text>Please report bugs and request features on GitHub:&nbsp;
          <Link source="https://github.com/jdhartley/terminal-for-fitbit">github.com/jdhartley/terminal-for-fitbit</Link>
        </Text>

        <Button
          label="Reset settings to default"
          onClick={() => props.settingsStorage.clear()}
        />
      </Section>
    </Page>
  );
});
