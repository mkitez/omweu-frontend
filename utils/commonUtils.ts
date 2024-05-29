import jwtDecode, { JwtPayload } from 'jwt-decode';

export const debounce = (func: Function, timeout: number): Function => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), timeout);
  };
};

export const isJwtExpired = (token: string) => {
  const tokenDecoded = jwtDecode<JwtPayload>(token);
  if (!tokenDecoded.exp) {
    return true;
  }
  const expDate = new Date(tokenDecoded.exp * 1000);
  const expiresIn = expDate.valueOf() - Date.now();
  if (expiresIn <= 0) {
    return true;
  }
  return false;
};

export const capitalizeFirstLetter = (input: string) => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};
