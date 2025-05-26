import { render, waitFor, screen } from "@testing-library/react";
import { SlashIDProviderImplementation } from "./slash-id-context";
import { MockSlashID } from "../components/test-utils";
import type { SlashIDOptions } from "@slashid/slashid";

describe("Lifecycle methods", () => {
  it("calls onInitError if getUserFromURL throws", async () => {
    const error = new Error("getUserFromURL error");
    const createSlashID = (options: SlashIDOptions) => {
      const mockSid = new MockSlashID(options);
      mockSid.getUserFromURL = jest.fn().mockRejectedValue(error);
      return mockSid;
    };

    const onInitError = jest.fn();

    render(
      <SlashIDProviderImplementation
        createSlashID={createSlashID}
        onInitError={onInitError}
        oid="test-oid"
        analyticsEnabled={false}
        tokenStorage="memory"
      >
        Test
      </SlashIDProviderImplementation>
    );

    await waitFor(() => {
      expect(onInitError).toHaveBeenCalledWith(error);
    });
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("calls onInitError if createAnonymousUser throws", async () => {
    const error = new Error("createAnonymousUser error");
    const createSlashID = (options: SlashIDOptions) => {
      const mockSid = new MockSlashID(options);
      mockSid.getUserFromURL = jest.fn().mockResolvedValue(null);
      mockSid.createAnonymousUser = jest.fn().mockRejectedValue(error);
      return mockSid;
    };

    const onInitError = jest.fn();

    render(
      <SlashIDProviderImplementation
        createSlashID={createSlashID}
        onInitError={onInitError}
        oid="test-oid"
        analyticsEnabled={false}
        tokenStorage="memory"
        anonymousUsersEnabled
      >
        Test
      </SlashIDProviderImplementation>
    );

    await waitFor(() => {
      expect(onInitError).toHaveBeenCalledWith(error);
    });
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
