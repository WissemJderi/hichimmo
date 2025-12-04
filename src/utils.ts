export const phoneNumber = "98622442";
export const formatNumber = (phoneNumber: string): string => {
  const first = phoneNumber.slice(0, 2);
  const second = phoneNumber.slice(2, 5);
  const third = phoneNumber.slice(5, 8);
  return `${first} ${second} ${third}`;
};
