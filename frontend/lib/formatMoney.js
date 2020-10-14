export default function (amount) {
  const options = {
    style: "currency",
    currency: "COP",
  };

  const formatter = new Intl.NumberFormat("es-CO", options);
  return formatter.format(amount);
}
