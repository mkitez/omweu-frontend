export const debounce = (func: Function, timeout: number): Function => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), timeout);
  };
};

interface TokenData {
  access: string;
  refresh: string;
}

export const saveTokens = (data: TokenData) => {
  localStorage.setItem('access', data.access);
  localStorage.setItem('refresh', data.refresh);
};

export const clearTokens = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};
