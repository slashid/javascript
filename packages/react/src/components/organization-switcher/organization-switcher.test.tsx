import { render, screen } from "@testing-library/react";
import { OrganizationSwitcher } from ".";
import { TestSlashIDProvider } from "../../context/test-slash-id-provider";
import { TestOrganizationProvider } from "../../context/test-organization-context";
import { TEXT } from "../text/constants";
import { ConfigurationProvider } from "../../context/config-context";
import { faker } from "@faker-js/faker";

const Setup = ({ children }: { children: React.ReactNode }) => (
  <TestSlashIDProvider
    providers={({ children }) => (
      <TestOrganizationProvider>
        {children}
      </TestOrganizationProvider>
    )}
  >
    {children}
  </TestSlashIDProvider>
)

const Fallback = ({ text }: { text: string }) => (
  <>
    {text}
  </>
)

describe("OrganizationSwitcher", () => {
  test("should render default fallback while loading", () => {
    const { container } = render(
      <Setup>
        <OrganizationSwitcher />
      </Setup>
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
      <Setup>
        <ConfigurationProvider
          text={override}
        >
          <OrganizationSwitcher />
        </ConfigurationProvider>
      </Setup>
    );

    const label = container.querySelector(".sid-organization-switcher > .sid-dropdown .sid-dropdown__trigger__label")?.innerHTML

    expect(label).toBe(override['org.switcher.label'])
  })

  test("should render custom fallback while loading", () => {
    const text = faker.airline.airplane().name

    render(
      <Setup>
        <OrganizationSwitcher
          fallback={<Fallback text={text} />}
        />
      </Setup>
    );

    expect(screen.queryByText(text)).toBeInTheDocument()
  })

  test.skip("should render fallback before root default org check is complete", () => {
    expect(false).toBeTruthy()
  })

  test.skip("should display a dropdown input when initialisation is complete", () => {
    expect(false).toBeTruthy()
  })

  test.skip("should display the current organization as the selected value", () => {
    expect(false).toBeTruthy()
  })

  test.skip("should display a menu on click", () => {
    expect(false).toBeTruthy()
  })

  test.skip("should render all organizations in menu", () => {
    expect(false).toBeTruthy()
  })

  test.skip("should only render organizations which satisfy predicate in menu", () => {
    expect(false).toBeTruthy()
  })

  test.skip("should render org.switcher.label in dropdown input", () => {
    expect(false).toBeTruthy()
  })

  test.skip("should call SlashIDProvider.__switchOrganizationInContext when an organization is selected", () => {
    expect(false).toBeTruthy()
  })

  test.skip("the selected value should change after an organization is selected", () => {
    expect(false).toBeTruthy()
  })
});
