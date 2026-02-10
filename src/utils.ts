export const phoneNumber = "98622442";
export const formatNumber = (phoneNumber: string): string => {
  const first = phoneNumber.slice(0, 2);
  const second = phoneNumber.slice(2, 5);
  const third = phoneNumber.slice(5, 8);
  return `${first} ${second} ${third}`;
};

export const titleCase = (location: string): string => {
  return location.charAt(0).toUpperCase() + location.slice(1);
};

// Get a location text are remove the _ if it found them
// Akouda -> Akouda
// Hammam_sousse -> Hammam sousse
const seperateLocationName = (location: string): string => {
  return location.split("_").join(" ");
};

export const formatTitle = (location: string): string => {
  const seperatedName = seperateLocationName(location);
  const titleCasedName = titleCase(seperatedName);
  return titleCasedName;
};

// Format the given price by adding ,s between every 3 digits and add DT at the end
// 10000 -> 10, 000 DT
// 100 -> 100 DT
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString("fr-FR")} DT`;
};

// Create a whatsapp url from the property ref and title
export const createWhatsappUrl = (ref: string, title: string) => {
  const whatsappNumber = "21698622442";

  const message = `Je suis intéressé par le bien avec la référence ${ref} (${title}). Est-il encore disponible ?`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

export const formatDateObject = (date: string) => {
  const formattedDate = new Date(date);

  const month = formattedDate.toLocaleDateString("fr-FR", { month: "long" }); // février
  const year = formattedDate.getUTCFullYear(); // 2026
  const numberOfDay = formattedDate.getUTCDate(); // 6

  return `${numberOfDay} ${month} ${year}`;
};

export const formatFloor = (floorNum: number): string => {
  if (floorNum === 0) return "Rez-de-chaussée";
  if (floorNum === 1) return "1er étage";
  return `${floorNum}e étage`;
};
