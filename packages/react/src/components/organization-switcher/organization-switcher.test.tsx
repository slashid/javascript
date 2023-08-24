import { findByTestId, render, screen, waitFor, within } from "@testing-library/react";
import { OrganizationSwitcher } from ".";
import { TestSlashIDProvider } from "../../context/test-slash-id-provider";
import { TEXT } from "../text/constants";
import { ConfigurationProvider } from "../../context/config-context";
import { faker } from "@faker-js/faker";
import {
  createTestOrganization,
  createTestUser,
  polyfillPointerEvent,
} from "../test-utils";
import userEvent from "@testing-library/user-event";
import { OrganizationDetails } from "@slashid/slashid";

const Fallback = ({ text }: { text: string }) => <>{text}</>;

describe("OrganizationSwitcher", () => {
  test("should render default fallback while loading", () => {
    const { container } = render(
      <TestSlashIDProvider>
        <OrganizationSwitcher />
      </TestSlashIDProvider>
    );

    const root = container.querySelector(".sid-organization-switcher");
    const fallback = container.querySelector(
      ".sid-organization-switcher > .sid-dropdown"
    );
    const triggerDisabledState = fallback?.querySelector<HTMLButtonElement>(
      ".sid-dropdown__trigger"
    )?.disabled;
    const loadingText = fallback?.querySelector(
      ".sid-dropdown__trigger__input span"
    )?.innerHTML;
    const label = fallback?.querySelector(
      ".sid-dropdown__trigger__label"
    )?.innerHTML;

    expect(root).toBeInTheDocument();
    expect(fallback).toBeInTheDocument();
    expect(triggerDisabledState).toBe(true);
    expect(loadingText).toBe("-");
    expect(label).toBe(TEXT["org.switcher.label"]);
  });

  test("should render org.switcher.label in default fallback", () => {
    const override = {
      "org.switcher.label": faker.commerce.productName(),
    };
    const { container } = render(
      <TestSlashIDProvider>
        <ConfigurationProvider text={override}>
          <OrganizationSwitcher />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    const label = container.querySelector(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger__label"
    )?.innerHTML;

    expect(label).toBe(override["org.switcher.label"]);
  });

  test("should render custom fallback while loading", () => {
    const text = faker.airline.airplane().name;

    render(
      <TestSlashIDProvider>
        <OrganizationSwitcher fallback={<Fallback text={text} />} />
      </TestSlashIDProvider>
    );

    expect(screen.queryByText(text)).toBeInTheDocument();
  });

  test("should display a dropdown input when initialisation is complete", async () => {
    const org = createTestOrganization();
    const user = createTestUser({ oid: org.id });
    const spy = vi.fn(async () => [org]);
    const expectedLabel = faker.company.buzzPhrase();

    user.getOrganizations = spy;

    const { container } = render(
      <TestSlashIDProvider user={user}>
        <ConfigurationProvider
          text={{
            "org.switcher.label": expectedLabel,
          }}
        >
          <OrganizationSwitcher />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    await waitFor(() =>
      expect(screen.queryByText("-")).not.toBeInTheDocument()
    );

    const root = container.querySelector(".sid-organization-switcher");
    const dropdown = container.querySelector(
      ".sid-organization-switcher > .sid-dropdown"
    );
    const triggerDisabledState = dropdown?.querySelector<HTMLButtonElement>(
      ".sid-dropdown__trigger"
    )?.disabled;
    const label = dropdown?.querySelector(
      ".sid-dropdown__trigger__label"
    )?.innerHTML;

    expect(root).toBeInTheDocument();
    expect(dropdown).toBeInTheDocument();
    expect(triggerDisabledState).toBe(false);
    expect(label).toBe(expectedLabel);
  });

  test("should display the current organization as the selected value", async () => {
    const org = createTestOrganization();
    const user = createTestUser({ oid: org.id });
    const spy = vi.fn(async () => [org]);

    user.getOrganizations = spy;

    const { container } = render(
      <TestSlashIDProvider user={user}>
        <OrganizationSwitcher />
      </TestSlashIDProvider>
    );

    await waitFor(() =>
      expect(screen.queryByText("-")).not.toBeInTheDocument()
    );

    const currentValue = container.querySelector(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger__input span"
    )?.innerHTML;

    expect(currentValue).toBe(org.org_name);
  });

  test("should display the current organizations label override as the selected value", async () => {
    const currentOrg = createTestOrganization();
    const user = createTestUser({ oid: currentOrg.id });
    const anotherOrg = createTestOrganization();
    const spy = vi.fn(async () => [anotherOrg, currentOrg]);

    const expected = faker.commerce.product();

    user.getOrganizations = spy;

    const { container } = render(
      <TestSlashIDProvider user={user}>
        <OrganizationSwitcher
          renderLabel={(org) => {
            if (org.id === currentOrg.id) return expected;
            return org.org_name;
          }}
        />
      </TestSlashIDProvider>
    );

    await waitFor(() =>
      expect(screen.queryByText("-")).not.toBeInTheDocument()
    );

    const currentValue = container.querySelector(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger__input span"
    )?.innerHTML;

    expect(currentValue).toBe(expected);
  });

  test("should display a menu on click", async () => {
    const org = createTestOrganization();
    const user = createTestUser({ oid: org.id });
    const anotherOrg = createTestOrganization();
    const spy = vi.fn(async () => [org, anotherOrg]);
    const event = userEvent.setup();

    user.getOrganizations = spy;

    const { container } = render(
      <TestSlashIDProvider user={user}>
        <OrganizationSwitcher />
      </TestSlashIDProvider>
    );

    await waitFor(() =>
      expect(screen.queryByText("-")).not.toBeInTheDocument()
    );

    const trigger = container.querySelector(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger"
    )!;

    polyfillPointerEvent();
    await event.click(trigger);

    const popover = container.querySelector<HTMLDivElement>(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__popover"
    )!;
    const { findByText } = within(popover);

    await expect(findByText(anotherOrg.org_name)).resolves.toBeInTheDocument();
  });

  test("should render all organizations in menu", async () => {
    const org = createTestOrganization();
    const user = createTestUser({ oid: org.id });
    const others = Array.from(Array(faker.number.int({ min: 2, max: 10 }))).map(
      () => createTestOrganization()
    );
    const shuffledOrgs = faker.helpers.shuffle([org, ...others]);

    const spy = vi.fn(async () => shuffledOrgs);
    const event = userEvent.setup();

    user.getOrganizations = spy;

    const { container } = render(
      <TestSlashIDProvider user={user}>
        <OrganizationSwitcher />
      </TestSlashIDProvider>
    );

    await waitFor(() =>
      expect(screen.queryByText("-")).not.toBeInTheDocument()
    );

    const trigger = container.querySelector(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger"
    )!;

    polyfillPointerEvent();
    await event.click(trigger);

    const popover = container.querySelector<HTMLDivElement>(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__popover"
    )!;
    const { findByText } = within(popover);

    for (const org of shuffledOrgs) {
      await expect(findByText(org.org_name)).resolves.toBeInTheDocument();
    }
  });

  test("should only render organizations which satisfy predicate in menu", async () => {
    const org = createTestOrganization();
    const user = createTestUser({ oid: org.id });
    const others = Array.from(Array(faker.number.int({ min: 5, max: 10 }))).map(
      () => createTestOrganization()
    );
    const shuffledOrgs = faker.helpers.shuffle([org, ...others]);
    const [a, b, c, ...invalidOrgs] = others;
    const validOrgs = [a, b, c];
    const ids = validOrgs.map((org) => org.id);
    const predicate = (org: OrganizationDetails) => ids.includes(org.id);

    const spy = vi.fn(async () => shuffledOrgs);
    const event = userEvent.setup();

    user.getOrganizations = spy;

    const { container } = render(
      <TestSlashIDProvider user={user}>
        <OrganizationSwitcher filter={predicate} />
      </TestSlashIDProvider>
    );

    await waitFor(() =>
      expect(screen.queryByText("-")).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(
        container.querySelector(
          ".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger"
        )
      ).toBeTruthy()
    );

    const trigger = container.querySelector(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger"
    )!;

    polyfillPointerEvent();
    await event.click(trigger);

    const popover = container.querySelector<HTMLDivElement>(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__popover"
    )!;
    const { findByText, queryByText } = within(popover);

    const items = popover.querySelectorAll(".sid-dropdown__item")!;

    expect(items.length).toBe(validOrgs.length);

    for (const org of validOrgs) {
      await expect(findByText(org.org_name)).resolves.toBeInTheDocument();
    }

    for (const org of invalidOrgs) {
      await expect(queryByText(org.org_name)).toBeNull();
    }
  });

  test("should render organization label overrides for items which satisfy the predicate in menu", async () => {
    const currentOrg = createTestOrganization();
    const user = createTestUser({ oid: currentOrg.id });
    const others = Array.from(Array(faker.number.int({ min: 3, max: 10 }))).map(
      () => createTestOrganization()
    );

    const shuffledOrgs = faker.helpers.shuffle([currentOrg, ...others]);
    const overridenOrgs = faker.helpers
      .shuffle(shuffledOrgs)
      // select a random number of shuffledORgs to override
      .slice(0, faker.number.int({ min: 2, max: shuffledOrgs.length - 1 }))
      // create label overrides, append index for uniqueness
      .map((org, i) => ({ id: org.id, label: faker.commerce.product() + i }));

    const spy = vi.fn(async () => shuffledOrgs);
    const event = userEvent.setup();

    user.getOrganizations = spy;

    const { container } = render(
      <TestSlashIDProvider user={user}>
        <OrganizationSwitcher
          renderLabel={(org) => {
            const override = overridenOrgs.find(({ id }) => id === org.id);

            if (override) return override.label;

            return org.org_name;
          }}
        />
      </TestSlashIDProvider>
    );

    await waitFor(() =>
      expect(screen.queryByText("-")).not.toBeInTheDocument()
    );

    const trigger = container.querySelector(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger"
    )!;

    polyfillPointerEvent();
    await event.click(trigger);

    const popover = container.querySelector<HTMLDivElement>(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__popover"
    )!;
    const { findByText } = within(popover);

    // assert overriden labels are rendered correctly
    for (const org of overridenOrgs) {
      await expect(findByText(org.label)).resolves.toBeInTheDocument();
    }

    const notOverridenOrgs = shuffledOrgs.filter(
      (org) => !overridenOrgs.find(({ id }) => id === org.id)
    );

    // assert un-overriden labels are still present
    for (const org of notOverridenOrgs) {
      await expect(findByText(org.org_name)).resolves.toBeInTheDocument();
    }
  });

  test("should render organization label override components in menu", async () => {
    const currentOrg = createTestOrganization();
    const user = createTestUser({ oid: currentOrg.id });
    const others = Array.from(Array(faker.number.int({ min: 3, max: 10 }))).map(
      () => createTestOrganization()
    );

    const shuffledOrgs = faker.helpers.shuffle([currentOrg, ...others]);
    const testId = `test-${faker.string.uuid()}`;
    const OverrideComponent = () => {
      return <div data-testid={testId}>foo</div>;
    };

    const spy = vi.fn(async () => shuffledOrgs);
    const event = userEvent.setup();

    user.getOrganizations = spy;

    const { container } = render(
      <TestSlashIDProvider user={user}>
        <OrganizationSwitcher
          renderLabel={(org) => {
            if (org.id === currentOrg.id) return <OverrideComponent />;

            return org.org_name;
          }}
        />
      </TestSlashIDProvider>
    );

    await waitFor(() =>
      expect(screen.queryByText("-")).not.toBeInTheDocument()
    );

    const trigger = container.querySelector(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger"
    )!;

    polyfillPointerEvent();
    await event.click(trigger);

    const popover = container.querySelector<HTMLDivElement>(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__popover"
    )!;
    const { findByText, findByTestId } = within(popover);

    // assert OverrideComponent rendered correctly
    console.log("looking for", testId)
    await expect(findByTestId(testId)).resolves.toBeInTheDocument();

    const notOverridenOrgs = shuffledOrgs.filter(
      (org) => org.id !== currentOrg.id
    );

    // assert un-overriden labels are still present
    for (const org of notOverridenOrgs) {
      await expect(findByText(org.org_name)).resolves.toBeInTheDocument();
    }
  });

  test("should render org.switcher.label in loaded dropdown input", async () => {
    const org = createTestOrganization();
    const user = createTestUser({ oid: org.id });
    const spy = vi.fn(async () => [org]);
    const expected = faker.commerce.productDescription();

    user.getOrganizations = spy;

    const { container } = render(
      <TestSlashIDProvider user={user}>
        <ConfigurationProvider
          text={{
            "org.switcher.label": expected,
          }}
        >
          <OrganizationSwitcher />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    await waitFor(() =>
      expect(screen.queryByText("-")).not.toBeInTheDocument()
    );
    const actual = container.querySelector<HTMLLabelElement>(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger__label"
    )?.textContent;

    expect(expected).toBe(actual);
  });

  test("should call SlashIDProvider.__switchOrganizationInContext when an organization is selected", async () => {
    const org = createTestOrganization();
    const user = createTestUser({ oid: org.id });
    const others = Array.from(Array(faker.number.int({ min: 5, max: 10 }))).map(
      () => createTestOrganization()
    );
    const shuffledOrgs = faker.helpers.shuffle([org, ...others]);

    const getOrganizations = vi.fn(async () => shuffledOrgs);
    const event = userEvent.setup();

    user.getOrganizations = getOrganizations;

    const spy = vi.fn(async () => undefined);

    const { container } = render(
      <TestSlashIDProvider user={user} __switchOrganizationInContext={spy}>
        <OrganizationSwitcher />
      </TestSlashIDProvider>
    );

    await waitFor(() =>
      expect(screen.queryByText("-")).not.toBeInTheDocument()
    );

    const trigger = container.querySelector(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger"
    )!;

    polyfillPointerEvent();
    await event.click(trigger);

    const popover = container.querySelector<HTMLDivElement>(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__popover"
    )!;
    const items = popover.querySelectorAll(".sid-dropdown__item")!;

    const unselectedItems = Array.from(items).filter(
      (element) =>
        element.querySelector<HTMLSpanElement>("span")?.textContent !==
        org.org_name
    );

    const [item] = faker.helpers.shuffle(unselectedItems);
    const itemName = item.querySelector<HTMLSpanElement>("span")?.textContent;
    const selectedOrg = others.find((org) => org.org_name === itemName);

    await event.click(item);

    expect(spy).toHaveBeenCalled();
    expect(selectedOrg).not.toBeUndefined();
    expect(spy).toHaveBeenCalledWith({ oid: selectedOrg?.id });
  });

  test("the selected value should change after an organization is selected", async () => {
    const org = createTestOrganization();
    const user = createTestUser({ oid: org.id });
    const others = Array.from(Array(faker.number.int({ min: 5, max: 10 }))).map(
      () => createTestOrganization()
    );
    const shuffledOrgs = faker.helpers.shuffle([org, ...others]);

    const getOrganizations = vi.fn(async () => shuffledOrgs);
    const event = userEvent.setup();

    user.getOrganizations = getOrganizations;

    const spy = vi.fn(async () => undefined);

    const { container } = render(
      <TestSlashIDProvider user={user} __switchOrganizationInContext={spy}>
        <OrganizationSwitcher />
      </TestSlashIDProvider>
    );

    await waitFor(() =>
      expect(screen.queryByText("-")).not.toBeInTheDocument()
    );

    const trigger = container.querySelector(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger"
    )!;

    polyfillPointerEvent();
    await event.click(trigger);

    const popover = container.querySelector<HTMLDivElement>(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__popover"
    )!;
    const items = popover.querySelectorAll(".sid-dropdown__item")!;

    const unselectedItems = Array.from(items).filter(
      (element) =>
        element.querySelector<HTMLSpanElement>("span")?.textContent !==
        org.org_name
    );

    const [item] = faker.helpers.shuffle(unselectedItems);
    const itemName = item.querySelector<HTMLSpanElement>("span")?.textContent;
    const selectedOrg = others.find((org) => org.org_name === itemName);

    await event.click(item);

    const currentValue = container.querySelector(
      ".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger__input span"
    )?.innerHTML;

    expect(currentValue).toBe(selectedOrg?.org_name);
  });
});
