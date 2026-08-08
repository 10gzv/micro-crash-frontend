import { REGEXPS } from '../constants/regexp.const';

export const checkIsValidOdd = (value: string) => {
  const valid = REGEXPS.FLOAT.test(value);
  const splitValue = value.split('.');
  return (
    valid &&
    value[0] !== '.' &&
    !(splitValue.length > 1 && splitValue[1].length > 2)
  );
};
