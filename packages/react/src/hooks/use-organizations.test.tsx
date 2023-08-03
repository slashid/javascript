import { render, screen } from "@testing-library/react";
import { useOrganizations } from "../main";
import { faker } from "@faker-js/faker";
import { OrganizationDetails } from "@slashid/slashid";
import { TestSlashIDProvider } from "../context/test-slash-id-provider";

interface Props {
  content?: (orgs: ReturnType<typeof useOrganizations>) => React.ReactNode
}

const TestComponent = ({ content = () => <>Ready!</> }: Props) => {
  const orgs = useOrganizations();

  if (orgs.isLoading) {
    return <div>Loading...</div>;
  }

  return <>{content(orgs)}</>;
};

const createOrganization = ():OrganizationDetails => ({
  id: faker.string.uuid(),
  org_name: faker.company.buzzPhrase(),
  tenant_name: faker.company.buzzPhrase(),
  managed_organizations: Array.from(Array(faker.number.int({ min: 1, max: 1000 })))
})

describe("useOrganizations", () => {
  test("should display loading state while loading", async () => {
    render(
      <TestOrganizationProvider
        isLoading={true}
      >
        <TestComponent />
      </TestOrganizationProvider>
    );

    expect.assertions(1);
    await expect(
      screen.findByText("Loading...")
    ).resolves.toBeInTheDocument();
  });

  test("should display content when loading finished", async () => {
    const content = faker.animal.cat()

    render(
        <TestOrganizationProvider
          isLoading={false}
        >
          <TestComponent content={() => content} />
        </TestOrganizationProvider>
    );

    expect.assertions(1);
    await expect(
      screen.findByText(content)
    ).resolves.toBeInTheDocument();
  });

  test("current organization is null when unresolved", async () => {
    const content = faker.animal.cat()

    render(
        <TestOrganizationProvider
          isLoading={false}
        >
          <TestComponent content={({ currentOrganization }) => (
            currentOrganization === null && content
          )} />
        </TestOrganizationProvider>
    );

    expect.assertions(1);
    await expect(
      screen.findByText(content)
    ).resolves.toBeInTheDocument();
  });

  test("current organization is returned when resolved", async () => {
    const currentOrganization: OrganizationDetails = createOrganization()

    render(
        <TestOrganizationProvider
          isLoading={false}
          currentOrganization={currentOrganization}
        >
          <TestComponent content={({ currentOrganization }) => (
            <>
              <div>
                {currentOrganization?.id}
              </div>
              <div>
                {currentOrganization?.org_name}
              </div>
              <div>
                {currentOrganization?.tenant_name}
              </div>
              <div>
                managed: {currentOrganization?.managed_organizations?.length}
              </div>
            </>
          )} />
        </TestOrganizationProvider>
    );

    expect.assertions(4);
    await expect(
      screen.findByText(currentOrganization.id)
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(currentOrganization.org_name)
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(currentOrganization.tenant_name)
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(`managed: ${currentOrganization.managed_organizations?.length}`)
    ).resolves.toBeInTheDocument();
  });

  test("organizations should be empty array when unresolved", async () => {
    const content = faker.animal.cat()

    render(
        <TestOrganizationProvider
          isLoading={false}
        >
          <TestComponent content={({ organizations }) => (
            organizations.length === 0 && content
          )} />
        </TestOrganizationProvider>
    );

    expect.assertions(1);
    await expect(
      screen.findByText(content)
    ).resolves.toBeInTheDocument();
  });

  test("organizations should be returned once resolved", async () => {
    const expectedOrgs = Array.from(Array(faker.number.int({ min: 1, max: 20 }))).map(() => createOrganization())
    const expected = (orgs: OrganizationDetails[]) => `orgs:${orgs.length}`

    render(
        <TestOrganizationProvider
          isLoading={false}
          organizations={expectedOrgs}
        >
          <TestComponent content={({ organizations }) => (expected(organizations))} />
        </TestOrganizationProvider>
    );

    expect.assertions(1);
    await expect(
      screen.findByText(expected(expectedOrgs))
    ).resolves.toBeInTheDocument();
  });

  test("when switchOrganizations is called SlashIDProvider.__switchOrganizationInContext should be called", async () => {
    const oid = faker.string.uuid()
    const spy = vi.fn()

    const SideEffect = () => {
      const { switchOrganization } = useOrganizations()

      switchOrganization({ oid })

      return <></>
    }

    render(
      <TestSlashIDProvider
        __switchOrganizationInContext={spy}
        providers={({ children }) => (
          <TestOrganizationProvider
            isLoading={false}
          >
            {children}
          </TestOrganizationProvider>
        )}
      >
        <SideEffect />       
      </TestSlashIDProvider>
    );

    expect(spy).toBeCalledWith({ oid })
    expect(spy).toBeCalledTimes(1)
  });
});
