import { act, render, screen, waitFor } from "@testing-library/react";
import { useOrganizations } from "../main";
import { faker } from "@faker-js/faker";
import { OrganizationDetails } from "@slashid/slashid";
import { TestSlashIDProvider } from "../context/test-providers";
import { createTestOrganization, createTestUser } from "../components/test-utils";

interface Props {
  content?: (orgs: ReturnType<typeof useOrganizations>) => React.ReactNode
  skipLoading?: boolean
}

const TestComponent = ({ content = () => <>Ready!</> , skipLoading = false }: Props) => {
  const orgs = useOrganizations();

  if (orgs.isLoading && !skipLoading) {
    return <div>Loading...</div>;
  }

  return <>{content(orgs)}</>;
};

// let interceptor: RequestInterceptor

describe("useOrganizations", () => {
  // beforeEach(() => {
  //   const {
  //     interceptor: _interceptor
  //   } = createRequestInterceptor()
  
  //   interceptor = _interceptor
  // })

  // afterEach(() => {
  //   interceptor?.close()
  // })

  test("should display loading state while loading", async () => {
    const user = createTestUser()

    user.getOrganizations = vi.fn(() => new Promise(() => undefined))

    render(
      <TestSlashIDProvider
        user={user}
      >
        <TestComponent />
      </TestSlashIDProvider>
    );

    expect.assertions(1);
    await expect(
      screen.findByText("Loading...")
    ).resolves.toBeInTheDocument();
  });

  test("should display content when loading finished", async () => {
    const content = faker.animal.cat()
    const org = createTestOrganization()

    const user = createTestUser({ oid: org.id })

    user.getOrganizations = vi.fn(async () => [org])

    render(
      <TestSlashIDProvider
        user={user}
      >
        <TestComponent content={() => content} />
      </TestSlashIDProvider>
    );

    expect.assertions(1);
    await expect(
      screen.findByText(content)
    ).resolves.toBeInTheDocument();
  });

  test("does not resolve if currentOrganization not found", async () => {
    const org = createTestOrganization()
    const orgs = [org]

    // the users oid does not match an org in [orgs]
    const user = createTestUser({ oid: faker.string.uuid() })

    user.getOrganizations = vi.fn(async () => orgs)

    let _isLoading: boolean
    let _organizations = []
    let _currentOrganization: OrganizationDetails | null

    const SideEffect = () => {
      const { isLoading, organizations, currentOrganization } = useOrganizations()

      _isLoading = isLoading
      _organizations = organizations
      _currentOrganization = currentOrganization

      return <></>
    }

    render(
      <TestSlashIDProvider
        user={user}
      >
        <SideEffect />
      </TestSlashIDProvider>
    );

    await waitFor(() => expect(_isLoading).toBe(true))
    await waitFor(() => expect(_organizations.length).toEqual(orgs.length))
    await waitFor(() => expect(_currentOrganization).toBe(null))
  });

  test("current organization is returned when resolved", async () => {
    const currentOrganization: OrganizationDetails = createTestOrganization()
    const otherOrgs = Array
      .from(Array(faker.number.int({ min: 1, max: 5 })))
      .map(() => createTestOrganization())
    const shuffledOrgs = faker.helpers.shuffle([currentOrganization, ...otherOrgs])

    const user = createTestUser({ oid: currentOrganization.id })
    user.getOrganizations = vi.fn(async () => shuffledOrgs)

    render(
      <TestSlashIDProvider
        user={user}
      >
        <TestComponent content={({ currentOrganization }) => (
          <>
            <div>
              id: {currentOrganization?.id}
            </div>
            <div>
              name: {currentOrganization?.org_name}
            </div>
            <div>
              tenant: {currentOrganization?.tenant_name}
            </div>
            <div>
              managed: {currentOrganization?.managed_organizations?.length}
            </div>
          </>
        )} />
      </TestSlashIDProvider>
    );

    expect.assertions(4);
    await expect(
      screen.findByText(`id: ${currentOrganization.id}`)
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(`name: ${currentOrganization.org_name}`)
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(`tenant: ${currentOrganization.tenant_name}`)
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(`managed: ${currentOrganization.managed_organizations?.length}`)
    ).resolves.toBeInTheDocument();
  });

  test("should display loading state while loading", async () => {
    const user = createTestUser()

    user.getOrganizations = vi.fn(() => new Promise(() => undefined))

    render(
      <TestSlashIDProvider
        user={user}
      >
        <TestComponent />
      </TestSlashIDProvider>
    );

    expect.assertions(1);
    await expect(
      screen.findByText("Loading...")
    ).resolves.toBeInTheDocument();
  });

  test("organizations should be empty array when unresolved", async () => {
    const user = createTestUser()
    const expected = (orgs: OrganizationDetails[]) => `orgs:${orgs.length}`

    user.getOrganizations = vi.fn(() => new Promise(() => undefined))

    render(
      <TestSlashIDProvider
        user={user}
      >
        <TestComponent
          skipLoading
          content={({ organizations }) => (
            expected(organizations)
          )}
        />
      </TestSlashIDProvider>
    );

    expect.assertions(1);
    await expect(
      screen.findByText(expected([]))
    ).resolves.toBeInTheDocument();
  });

  test("organizations should be returned once resolved", async () => {
    const currentOrg = createTestOrganization()
    const otherOrgs = Array.from(Array(faker.number.int({ min: 1, max: 20 }))).map(() => createTestOrganization())
    const shuffledOrgs = faker.helpers.shuffle([currentOrg, ...otherOrgs])

    const user = createTestUser({ oid: currentOrg.id })
    user.getOrganizations = vi.fn(async () => shuffledOrgs)

    const expected = (orgs: OrganizationDetails[]) => `orgs:${orgs.length}`

    render(
      <TestSlashIDProvider
        user={user}
      >
        <TestComponent content={({ organizations }) => (expected(organizations))} />
      </TestSlashIDProvider>
    );

    expect.assertions(1);
    await expect(
      screen.findByText(expected(shuffledOrgs))
    ).resolves.toBeInTheDocument();
  });

  test("when switchOrganizations is called SlashIDProvider.__switchOrganizationInContext should be called", async () => {
    const org = createTestOrganization()

    const user = createTestUser({ oid: org.id })
    user.getOrganizations = vi.fn(async () => [org])
    
    const oid = faker.string.uuid()
    const spy = vi.fn()

    const SideEffect = () => {
      const { switchOrganization } = useOrganizations()

      act(() => {
        switchOrganization({ oid })
      })

      return <></>
    }


    render(
      <TestSlashIDProvider
        user={user}
        __switchOrganizationInContext={spy}
      >
        <SideEffect />       
      </TestSlashIDProvider>
    );

    expect(spy).toBeCalledWith({ oid })
  });
});
