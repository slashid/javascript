import { render, screen, waitFor, within } from "@testing-library/react";
import { OrganizationSwitcher } from ".";
import { TestSlashIDProvider } from "../../context/test-slash-id-provider";
import { TEXT } from "../text/constants";
import { ConfigurationProvider } from "../../context/config-context";
import { faker } from "@faker-js/faker";
import { createTestOrganization, createTestUser } from "../test-utils";
import userEvent from "@testing-library/user-event";
import { OrganizationDetails } from "@slashid/slashid";

const Fallback = ({ text }: { text: string }) => (
  <>
    {text}
  </>
)

describe("OrganizationSwitcher", () => {
  test("should render default fallback while loading", () => {
    const { container } = render(
      <TestSlashIDProvider>
        <OrganizationSwitcher />
      </TestSlashIDProvider>
    );

    const root = container.querySelector(".sid-organization-switcher")
    const fallback = container.querySelector(".sid-organization-switcher > .sid-dropdown")
    const triggerDisabledState = fallback?.querySelector<HTMLButtonElement>(".sid-dropdown__trigger")?.disabled
    const loadingText = fallback?.querySelector(".sid-dropdown__trigger__input span")?.innerHTML
    const label = fallback?.querySelector(".sid-dropdown__trigger__label")?.innerHTML

    expect(root).toBeInTheDocument()
    expect(fallback).toBeInTheDocument()
    expect(triggerDisabledState).toBe(true)
    expect(loadingText).toBe("-")
    expect(label).toBe(TEXT["org.switcher.label"])
  })

  test("should render org.switcher.label in default fallback", () => {
    const override = {
      "org.switcher.label": faker.commerce.productName()
    }
    const { container } = render(
      <TestSlashIDProvider>
        <ConfigurationProvider
          text={override}
        >
          <OrganizationSwitcher />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    const label = container.querySelector(".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger__label")?.innerHTML

    expect(label).toBe(override['org.switcher.label'])
  })

  test("should render custom fallback while loading", () => {
    const text = faker.airline.airplane().name

    render(
      <TestSlashIDProvider>
        <OrganizationSwitcher
          fallback={<Fallback text={text} />}
        />
      </TestSlashIDProvider>
    );

    expect(screen.queryByText(text)).toBeInTheDocument()
  })

  test("should display a dropdown input when initialisation is complete", async () => {
    const org = createTestOrganization()
    const user = createTestUser({ oid: org.id })
    const spy = vi.fn(async () => [org])

    user.getOrganizations = spy
    
    const { container } = render(
      <TestSlashIDProvider
        user={user}
      >
        <OrganizationSwitcher />
      </TestSlashIDProvider>
    );
    
    await waitFor(() => expect(screen.queryByText("-")).not.toBeInTheDocument())

    const root = container.querySelector(".sid-organization-switcher")
    const dropdown = container.querySelector(".sid-organization-switcher > .sid-dropdown")
    const triggerDisabledState = dropdown?.querySelector<HTMLButtonElement>(".sid-dropdown__trigger")?.disabled
    const label = dropdown?.querySelector(".sid-dropdown__trigger__label")?.innerHTML

    expect(root).toBeInTheDocument()
    expect(dropdown).toBeInTheDocument()
    expect(triggerDisabledState).toBe(false)
    expect(label).toBe(TEXT["org.switcher.label"])
  })

  test("should display the current organization as the selected value", async () => {
    const org = createTestOrganization()
    const user = createTestUser({ oid: org.id })
    const spy = vi.fn(async () => [org])

    user.getOrganizations = spy
    
    const { container } = render(
      <TestSlashIDProvider
        user={user}
      >
        <OrganizationSwitcher />
      </TestSlashIDProvider>
    );
    
    await waitFor(() => expect(screen.queryByText("-")).not.toBeInTheDocument())

    const currentValue = container.querySelector(".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger__input span")?.innerHTML

    expect(currentValue).toBe(org.org_name)
  })

  test("should display a menu on click", async () => {
    const org = createTestOrganization()
    const user = createTestUser({ oid: org.id })
    const anotherOrg = createTestOrganization()
    const spy = vi.fn(async () => [org, anotherOrg])
    const event = userEvent.setup();

    user.getOrganizations = spy
    
    const { container } = render(
      <TestSlashIDProvider
        user={user}
      >
        <OrganizationSwitcher />
      </TestSlashIDProvider>
    );
    
    await waitFor(() => expect(screen.queryByText("-")).not.toBeInTheDocument())
    await waitFor(() => expect(container.querySelector(".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger")).toBeTruthy())
    
    const trigger = container.querySelector(".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger")!
    
    ;(window as any).PointerEvent = class PointerEvent extends Event {};
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();

    event.click(trigger)

    await waitFor(() => expect(container.querySelector(".sid-organization-switcher > .sid-dropdown .sid-dropdown__popover")).toBeTruthy())

    const popover = container.querySelector<HTMLDivElement>(".sid-organization-switcher > .sid-dropdown .sid-dropdown__popover")!
    const { findByText } = within(popover)

    await expect(findByText(anotherOrg.org_name)).resolves.toBeInTheDocument()
  })

  test("should render all organizations in menu", async () => {
    const org = createTestOrganization()
    const user = createTestUser({ oid: org.id })
    const others = Array.from(Array(faker.number.int({ min: 2, max: 10 }))).map(() => createTestOrganization())
    const shuffledOrgs = faker.helpers.shuffle([org, ...others])

    const spy = vi.fn(async () => shuffledOrgs)
    const event = userEvent.setup();

    user.getOrganizations = spy
    
    const { container } = render(
      <TestSlashIDProvider
        user={user}
      >
        <OrganizationSwitcher />
      </TestSlashIDProvider>
    );
    
    await waitFor(() => expect(screen.queryByText("-")).not.toBeInTheDocument())
    await waitFor(() => expect(container.querySelector(".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger")).toBeTruthy())

    const trigger = container.querySelector(".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger")!
    
    ;(window as any).PointerEvent = class PointerEvent extends Event {};
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();

    event.click(trigger)

    await waitFor(() => expect(container.querySelector(".sid-organization-switcher > .sid-dropdown .sid-dropdown__popover")).toBeTruthy())

    const popover = container.querySelector<HTMLDivElement>(".sid-organization-switcher > .sid-dropdown .sid-dropdown__popover")!
    const { findByText } = within(popover)

    for (const org of shuffledOrgs) {
      await expect(findByText(org.org_name)).resolves.toBeInTheDocument()
    }
  })

  test("should only render organizations which satisfy predicate in menu", async () => {
    const org = createTestOrganization()
    const user = createTestUser({ oid: org.id })
    const others = Array.from(Array(faker.number.int({ min: 5, max: 10 }))).map(() => createTestOrganization())
    const shuffledOrgs = faker.helpers.shuffle([org, ...others])
    const [a, b, c, ...invalidOrgs] = others
    const validOrgs = [a, b, c]
    const ids = validOrgs.map(org => org.id)
    const predicate = (org: OrganizationDetails) => ids.includes(org.id)

    const spy = vi.fn(async () => shuffledOrgs)
    const event = userEvent.setup();

    user.getOrganizations = spy
    
    const { container } = render(
      <TestSlashIDProvider
        user={user}
      >
        <OrganizationSwitcher
          filter={predicate}
        />
      </TestSlashIDProvider>
    );
    
    await waitFor(() => expect(screen.queryByText("-")).not.toBeInTheDocument())
    await waitFor(() => expect(container.querySelector(".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger")).toBeTruthy())

    const trigger = container.querySelector(".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger")!
    
    ;(window as any).PointerEvent = class PointerEvent extends Event {};
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();

    event.click(trigger)

    await waitFor(() => expect(container.querySelector(".sid-organization-switcher > .sid-dropdown .sid-dropdown__popover")).toBeTruthy())

    const popover = container.querySelector<HTMLDivElement>(".sid-organization-switcher > .sid-dropdown .sid-dropdown__popover")!
    const { findByText, queryByText } = within(popover)

    const items = popover.querySelectorAll(".sid-dropdown__item")!

    expect(items.length).toBe(validOrgs.length)

    for (const org of validOrgs) {
      await expect(findByText(org.org_name)).resolves.toBeInTheDocument()
    }

    for (const org of invalidOrgs) {
      await expect(queryByText(org.org_name)).toBeNull()
    }
  })
});
