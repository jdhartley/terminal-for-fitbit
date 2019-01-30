registerSettingsPage(() => {
  return (
    <Page>
      <Section
        title="Top and bottom command username"
        description="Will appear as user@host"
      >
        <TextInput
          label="Username"
          placeholder="user"
          settingsKey="username"
        />
      </Section>
    </Page>
  );
});
