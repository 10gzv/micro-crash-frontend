import CryptoJS from 'crypto-js';

export const generateSha512 = (seed: string) => {
  return CryptoJS.SHA512(seed).toString(CryptoJS.enc.Hex);
};

export const randomSeedGenerator = (length = 40) => {
  return CryptoJS.lib.WordArray.random(length / 2).toString(CryptoJS.enc.Hex);
};

export const generateSha = (
  serverSeed: string,
  clientSeed1: string,
  clientSeed2: string,
  clientSeed3: string,
) => {
  let seed = serverSeed;
  if (clientSeed1) seed += clientSeed1;
  if (clientSeed2) seed += clientSeed2;
  if (clientSeed3) seed += clientSeed3;
  return generateSha512(seed);
};
