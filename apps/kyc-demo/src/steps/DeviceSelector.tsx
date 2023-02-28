import {
  Button,
  Card,
  Column,
  Columns,
  IllustrationDesktop,
  IllustrationSmartphone,
  Stack,
  Title,
} from "design-system";

export function DeviceSelector(props: {
  flowId: string;
  onMobile: () => void;
  onDesktop: () => void;
}) {
  return (
    <Columns space={16}>
      <Column width="1/2">
        <Card padding={32}>
          <Stack space={24} align="center">
            <IllustrationSmartphone size={80} kind="color" />
            <Title size="small" align="center">
              Complete the procedure on your mobile device
            </Title>
            <Button
              type="submit"
              kind="solid"
              hierarchy="primary"
              label="Switch device"
              onPress={props.onMobile}
            />
          </Stack>
        </Card>
      </Column>
      <Column width="1/2">
        <Card padding={32}>
          <Stack space={24} align="center">
            <IllustrationDesktop size={80} kind="color" />
            <Title size="small" align="center">
              Complete the procedure on this device
            </Title>
            <Button
              type="submit"
              kind="solid"
              hierarchy="primary"
              label="Continue"
              onPress={props.onDesktop}
            />
          </Stack>
        </Card>
      </Column>
    </Columns>
  );
}
