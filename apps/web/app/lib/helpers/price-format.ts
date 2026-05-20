export const formatPriceIRR = (price: number, useToman = false) => {
  const amount = useToman ? price / 10 : price;
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان ";
};
