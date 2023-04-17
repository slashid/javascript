import { LinksFunction, json } from "@remix-run/node";
import { LoggedOut, LoggedIn, Form } from "@slashid/react";
import { SSR } from "@slashid/slashid";
import { Profile } from "demo-form";

import slashIDstyles from "@slashid/react/style.css";
import profileStyles from "demo-form/style.css";
import { useLoaderData } from "@remix-run/react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slashIDstyles },
  { rel: "stylesheet", href: profileStyles },
];

export async function loader() {
  const ssrUser = new SSR.User(
    "eyJhbGciOiJSUzI1NiIsICJraWQiOiJwWXNOR0EifQ.eyJhdWQiOiI4MTdiMWQyOS0zODAwLWJjMGMtMzZlYi04M2FiNjMyZjY2YTUiLCAiYXV0aGVudGljYXRlZF9tZXRob2RzIjpbImVtYWlsX2xpbmsiXSwgImV4cCI6MTY4MDc5Mjc0NiwgImZpcnN0X3Rva2VuIjpmYWxzZSwgImdyb3VwcyI6WyJUZXN0LTEiXSwgImdyb3Vwc19jbGFpbV9uYW1lIjoiZ3JvdXBzIiwgImlhdCI6MTY4MDcwNjM0NiwgImlzcyI6Imh0dHBzOi8vYXBpLnNhbmRib3guc2xhc2hpZC5jb20iLCAianRpIjoiZjdiNDI2MDc1NTVjNDAyNTJhMTY0OTI4OTllODlhMGYiLCAib2lkIjoiODE3YjFkMjktMzgwMC1iYzBjLTM2ZWItODNhYjYzMmY2NmE1IiwgInBlcnNvbl9pZCI6IjA2M2U0ZDI4LWY1OGQtN2JiNC1iYzA4LTA4ZDg3MmY4MGU4OSIsICJzdWIiOiIwNjNlNGQyOC1mNThkLTdiYjQtYmMwOC0wOGQ4NzJmODBlODkifQ.P7Ot32_a-W6S7_Qh7DauqNFrrIYxmLNVEM-ZBfga6sx_N9OR3W2Aj_c1UdGjWjUPTxskpBMGmczimMiWfk6-bnFv5_23BB-RRnE9ovQzVpVjGv2R6akm58nYZ4EcF-FMQMDR86wzCgeFfuWNNIiylc63UWQLOVj_0qLxj141M_rPyBsoYGDfDoEM4W1IIlAkjF1fGH68doPZ0vu8I3Bw2dwv7CmUl8PaY_pAgN9a_LhOljwAtA6u_W1of3DfszNx-v7lHmP8ptLdA_gLapvy6_NNphx0Srq1tS637pDjETjGTNMGtoNOwenf6R5Odto7yLkaJCxnxdoJuG0M8Zg50w"
  );
  const bucket = await ssrUser.getBucket();
  const attributes = await bucket.get();
  return json({ attributes });
}

export default function Index() {
  const { attributes } = useLoaderData<typeof loader>();

  return (
    <div className="index">
      <div>
        <h1>Attributes with SSR</h1>
        <pre>{JSON.stringify(attributes, null, 2)}</pre>
      </div>
      <LoggedOut>
        <div className="formWrapper">
          <Form />
        </div>
      </LoggedOut>
      <LoggedIn>
        <Profile />
      </LoggedIn>
    </div>
  );
}
