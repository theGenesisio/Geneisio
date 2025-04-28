import { useState } from "react";
import { whatsappIcon } from "../../../assets/icons";
import FetchWithAuth from "../../auth/api";
import { useNotification } from "../../layout/NotificationHelper";
import { ListItem, ListItemPrefix } from "@material-tailwind/react";

const Whatsapp = () => {
  const [phoneNumber, setphoneNumber] = useState(null);
  const { addNotification } = useNotification();
  const openWhatsapp = async () => {
    try {
      const response = await FetchWithAuth(
        `/whatsapp`,
        {
          method: "GET",
          credentials: "include",
        },
        "Failed to open whatsapp chat"
      );
      if (response.failed) {
        const { message, failed } = response;
        addNotification(failed, "error");
        addNotification(message, "error");
      } else {
        const { number, message } = response;
        number && setphoneNumber(number);
        addNotification(message);
        window.open(`https://wa.me/${number}`, "_blank");
      }
    } catch (err) {
      addNotification("An error occurred", "error");
      console.error("Fetch error:", err);
    }
  };

  return (
    <ListItem
      onClick={() =>
        phoneNumber ? window.open(`https://wa.me/${phoneNumber}`, "_blank") : openWhatsapp()
      }>
      <ListItemPrefix>
        <span className='h-5 w-5 scale-125'>{whatsappIcon}</span>
      </ListItemPrefix>
      Whatsapp
    </ListItem>
  );
};

export default Whatsapp;
