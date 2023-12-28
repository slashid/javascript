// import { createVerifier } from 'fast-jwt'
// import buildGetJwks from "get-jwks";
import join from "url-join";
import * as jose from "jose";

export const verifyToken = async ({
  token,
  baseApiUrl,
  oid,
}: {
  token?: string;
  baseApiUrl: string;
  oid: string;
}) => {
  if (!token) return Promise.reject();

  const remoteJWKS = new URL(join(baseApiUrl, "/.well-known/jwks.json"));

  const JWKS = jose.createRemoteJWKSet(remoteJWKS);

  // throws if verification fails
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { payload: _, protectedHeader: __ } = await jose.jwtVerify(token, JWKS, {
    issuer: baseApiUrl,
    audience: oid,
  });
};
