import { useSlashID } from "@slashid/react";
import { useEffect, useState, SyntheticEvent } from "react";

export const Storage = () => {
  // User object reference - only available after successful authentication
  const { user } = useSlashID();
  // React state for rendering our attributes stored in Data Vault
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  // Simple form state to enable storing new attributes
  const [newAttrName, setNewAttrName] = useState<string>("");
  const [newAttrValue, setNewAttrValue] = useState<string>("");

  // after authentication, fetch the attributes from Data Vault
  useEffect(() => {
    async function fetchUserAttributes() {
      // getBucket takes in an optional `bucketName | string` argument
      // if not present, it will return the default Read/Write bucket
      const bucket = user?.getBucket();
      // calling bucket.get() with no arguments will return all attributes stored in this bucket
      const attrs = await bucket?.get<Record<string, string>>();

      setAttributes(attrs!);
    }

    fetchUserAttributes();
  }, [user]);

  const addNewAttribute = async () => {
    // store new attribute
    const bucket = user?.getBucket();
    await bucket?.set({ [newAttrName]: newAttrValue });

    // simple refetch logic to re-render updated attributes list
    const attrs = await bucket?.get<Record<string, string>>();
    setAttributes(attrs!);

    // reset the form
    setNewAttrName("");
    setNewAttrValue("");
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    addNewAttribute();
  };

  return (
    <div>
      <main className="storage">
        <h2>Stored attributes</h2>
        {Object.keys(attributes).length === 0 ? (
          <p>Looks like there's nothing in here!</p>
        ) : null}
        <ul>
          {/* display attributes from Data Vault as list items */}
          {Object.entries(attributes).map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>
        {/* minimal form for storing new attributes */}
        <form method="post" onSubmit={handleSubmit}>
          <input
            value={newAttrName}
            placeholder="Attribute name"
            onChange={(e) => setNewAttrName(e.target.value)}
          />
          <input
            value={newAttrValue}
            placeholder="Attribute value"
            onChange={(e) => setNewAttrValue(e.target.value)}
          />
          <button type="submit">Add attribute</button>
        </form>
      </main>
    </div>
  );
};
