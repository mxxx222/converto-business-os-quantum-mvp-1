import { importJWK, jwtVerify, SignJWT, type JWK } from 'jose'

const iss = process.env.JWT_ISS as string
const aud = process.env.JWT_AUD as string
const pubJwk = JSON.parse(process.env.JWT_PUBLIC_KEY_JWK || '{}')
const privJwk = JSON.parse(process.env.JWT_PRIVATE_KEY_JWK || '{}')

export async function signJWT(payload: Record<string, any>, expSeconds = 900) {
  const key = await importJWK(pubJwk.kty ? (privJwk as JWK) : ({} as JWK), 'RS256')
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuer(iss)
    .setAudience(aud)
    .setIssuedAt()
    .setExpirationTime(`${expSeconds}s`)
    .sign(key)
}

export async function verifyJWT(token: string) {
  const key = await importJWK(pubJwk as JWK, 'RS256')
  const { payload } = await jwtVerify(token, key, { issuer: iss, audience: aud })
  return payload as any
}


