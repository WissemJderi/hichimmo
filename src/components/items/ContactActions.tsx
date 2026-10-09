import { FaPhoneAlt } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { formatNumber, phoneNumber } from "../../utils";

type PropType = {
  whatsappUrl: string;
  variant?: "rail" | "mobile";
};

const ContactActions = ({ whatsappUrl, variant = "rail" }: PropType) => {
  if (variant === "mobile") {
    return (
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ouvrir WhatsApp"
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 text-sm font-semibold text-white"
        >
          <IoLogoWhatsapp className="text-lg" aria-hidden />
          WhatsApp
        </a>
        <a
          href={`tel:+216${phoneNumber}`}
          aria-label="Appeler l'agence"
          className="grid h-11 w-12 place-items-center rounded-lg border border-primary/25 text-primary"
        >
          <FaPhoneAlt aria-hidden />
        </a>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-2.5">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-green-600"
      >
        <IoLogoWhatsapp className="text-lg" aria-hidden />
        Contacter via WhatsApp
      </a>
      <a
        href={`tel:+216${phoneNumber}`}
        className="flex items-center justify-center gap-2 rounded-lg border border-primary/25 px-5 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white"
      >
        <FaPhoneAlt aria-hidden />
        {formatNumber(phoneNumber)}
      </a>
    </div>
  );
};

export default ContactActions;
