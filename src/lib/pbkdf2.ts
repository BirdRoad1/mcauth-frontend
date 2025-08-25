import type { BinaryLike } from "crypto";
import crypto from 'crypto';

function hash(
  password: BinaryLike, salt?: string, iterations?: number) {

  iterations ??= 600000;
  salt ??= crypto.randomBytes(16).toString('hex');

  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, 32, 'sha256', (err, key) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(`pbkdf2:${salt}:${iterations}:${key.toString('base64')}`);
    })
  })
}

async function verify(
  password: BinaryLike, hashed: string) {

  const [, salt, iterStr, key] = hashed.split(':');
  if (salt === undefined || !iterStr || !key) throw new Error('Invalid hash');

  let iterations: number;
  if (!/^\d+$/.test(iterStr) || !Number.isFinite(iterations = Number.parseInt(iterStr))) {
    throw new Error('Invalid iterations');
  }

  const newHash = await hash(password, salt, iterations);

  return newHash === hashed;
}


export const pbkdf2 = { hash, verify };