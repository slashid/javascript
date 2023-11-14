import { defaultOrganization } from ".";
import { faker } from "@faker-js/faker";
import {
  createTestOrganization,
  createTestUser,
} from "../../components/test-utils";
import { SlashID, User } from "@slashid/slashid";

describe("middleware: defaultOrganization", () => {
  test("factory returns a function", () => {
    const oid = faker.string.uuid();
    const middleware = defaultOrganization(oid);

    expect(typeof middleware).toBe("function");
  });
  test("returns a user", async () => {
    const user = createTestUser();
    const oid = faker.string.uuid();
    const middleware = defaultOrganization(oid);
    const sid = {} as SlashID;

    user.getOrganizations = vi.fn(async () => []);
    user.getTokenForOrganization = vi.fn(
      async (oid) => createTestUser({ oid }).token
    );

    const output = await middleware({ user, sid });

    expect(output).toBeInstanceOf(User);
  });
  test("returns user where oid matches provided static oid", async () => {
    const org = createTestOrganization();
    const user = createTestUser({ oid: org.id });

    const otherOrgs = Array.from(
      Array(faker.number.int({ min: 3, max: 20 }))
    ).map(() => createTestOrganization());
    const allOrgs = faker.helpers.shuffle([org, ...otherOrgs]);

    const randomOtherOrgs = faker.helpers.shuffle(otherOrgs);
    const [{ id: defaultOid }] = randomOtherOrgs;

    const middleware = defaultOrganization(defaultOid);
    const sid = {} as SlashID;

    user.getOrganizations = vi.fn(async () => allOrgs);
    user.getTokenForOrganization = vi.fn(
      async (oid) => createTestUser({ oid }).token
    );

    const output = await middleware({ user, sid });

    expect(output.oid).toBe(defaultOid);
  });
  test("returns user where oid matches the resolved oid from sync search function", async () => {
    const org = createTestOrganization();
    const user = createTestUser({ oid: org.id });

    const otherOrgs = Array.from(
      Array(faker.number.int({ min: 3, max: 20 }))
    ).map(() => createTestOrganization());
    const allOrgs = faker.helpers.shuffle([org, ...otherOrgs]);

    const [{ id: defaultOid }] = faker.helpers.shuffle(otherOrgs);

    const middleware = defaultOrganization(() => defaultOid);
    const sid = {} as SlashID;

    user.getOrganizations = vi.fn(async () => allOrgs);
    user.getTokenForOrganization = vi.fn(
      async (oid) => createTestUser({ oid }).token
    );

    const output = await middleware({ user, sid });

    expect(output.oid).toBe(defaultOid);
  });
  test("returns user where oid matches the resolved oid from async search function", async () => {
    const org = createTestOrganization();
    const user = createTestUser({ oid: org.id });

    const otherOrgs = Array.from(
      Array(faker.number.int({ min: 3, max: 20 }))
    ).map(() => createTestOrganization());
    const allOrgs = faker.helpers.shuffle([org, ...otherOrgs]);

    const [{ id: defaultOid }] = faker.helpers.shuffle(otherOrgs);

    const middleware = defaultOrganization(async () => defaultOid);
    const sid = {} as SlashID;

    user.getOrganizations = vi.fn(async () => allOrgs);
    user.getTokenForOrganization = vi.fn(
      async (oid) => createTestUser({ oid }).token
    );

    const output = await middleware({ user, sid });

    expect(output.oid).toBe(defaultOid);
  });
  test("calls the provided search function with organizations and user object", async () => {
    const org = createTestOrganization();
    const user = createTestUser({ oid: org.id });

    const otherOrgs = Array.from(
      Array(faker.number.int({ min: 3, max: 20 }))
    ).map(() => createTestOrganization());
    const allOrgs = faker.helpers.shuffle([org, ...otherOrgs]);

    const [{ id: defaultOid }] = faker.helpers.shuffle(otherOrgs);

    const spy = vi.fn(() => defaultOid);
    const middleware = defaultOrganization(spy);
    const sid = {} as SlashID;

    user.getOrganizations = vi.fn(async () => allOrgs);
    user.getTokenForOrganization = vi.fn(
      async (oid) => createTestUser({ oid }).token
    );

    await middleware({ user, sid });

    expect(spy).toBeCalledWith(
      expect.objectContaining({ user, organizations: allOrgs })
    );
  });
});
