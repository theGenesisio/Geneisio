import { useEffect, useState } from "react";
import CopyTradeCard from "./subComponents/CopyTradeCard";
import { useNotification } from "../layout/NotificationHelper.jsx";
import FetchWithAuth from "../auth/api.js";
import Loader from "./subComponents/Loader.jsx";
const CopyTrade = () => {
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [copyTrades, setCopyTrades] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await FetchWithAuth(
          `/copy-trade`,
          { method: "GET", credentials: "include" },
          "Failed to fetch copy trades"
        );
        if (response.failed) {
          addNotification(response.failed, "error");
        } else {
          const { trades, message } = response;
          trades && setCopyTrades(trades.reverse());
          addNotification(message);
        }
      } catch (err) {
        addNotification("An error occurred", "error");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 lg:p-0'>
      {loading ? (
        <Loader />
      ) : (
        copyTrades.map((trade, index) => <CopyTradeCard key={index} {...trade} />)
      )}
    </div>
  );
};
export default CopyTrade;
// Todo optimize and debug
// import { useEffect, useState } from "react";
// import CopyTradeCard from "./subComponents/CopyTradeCard";
// import { useNotification } from "../layout/NotificationHelper.jsx";
// import FetchWithAuth from "../auth/api.js";
// import Loader from "./subComponents/Loader.jsx";
// import { PlaceholderProfile } from "../../assets/utilities.jsx";
// import fetchImage from "../auth/apiGetIMG.js";

// const CopyTrade = () => {
//   const { addNotification } = useNotification();
//   const [loading, setLoading] = useState(true);
//   const [copyTrades, setCopyTrades] = useState([]);
//   const [traderInfo, setTraderInfo] = useState([]);

//   // Fetch copy trades and set them into state
//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         const response = await FetchWithAuth(
//           `/copy-trade`,
//           { method: "GET", credentials: "include" },
//           "Failed to fetch copy trades"
//         );
//         if (response.failed) {
//           addNotification(response.failed, "error");
//         } else {
//           const { trades, message } = response;
//           if (trades) {
//             setCopyTrades(trades.reverse());
//             addNotification(message);
//           }
//         }
//       } catch (err) {
//         addNotification("An error occurred", "error");
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Extract unique trader info (with a placeholder for imageSrc)
//   useEffect(() => {
//     setTraderInfo(
//       Array.from(
//         new Map(
//           copyTrades.map((trade) => [
//             trade.trader._id,
//             {
//               _id: trade.trader._id,
//               imageFilename: trade.trader.imageFilename,
//               traderName: trade.trader.name,
//               imageSrc: undefined, // Will be filled in after image loads
//             },
//           ])
//         ).values()
//       )
//     );
//   }, [copyTrades]);

//   // For each trader, fetch the image asynchronously and update the state as soon as it loads
//   useEffect(() => {
//     traderInfo.forEach((trader, index) => {
//       if (!trader.imageSrc) {
//         (async () => {
//           try {
//             const imageUrl = await fetchImage(trader.imageFilename, "/image/trader/");
//             const loadedImage = await new Promise((resolve) => {
//               const img = new Image();
//               img.src = imageUrl || PlaceholderProfile;
//               img.onload = () => resolve(img.src);
//               img.onerror = () => resolve(PlaceholderProfile);
//             });
//             // Update only this trader's info with the loaded image
//             setTraderInfo((prevInfo) => {
//               const newInfo = [...prevInfo];
//               newInfo[index] = { ...newInfo[index], imageSrc: loadedImage };
//               return newInfo;
//             });
//           } catch (err) {
//             console.error(`Error loading image for trader ${trader._id}:`, err);
//           }
//         })();
//       }
//     });
//   }, [traderInfo]);
//   return (
//     <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
//       {loading ? (
//         <Loader />
//       ) : (
//         copyTrades.map((trade, index) => {
//           // Match trader info (with the possibly updated imageSrc) to the trade info
//           const traderData = traderInfo.find((t) => t._id === trade.trader._id);
//           return <CopyTradeCard key={index} {...trade} traderData={traderData} />;
//         })
//       )}
//     </div>
//   );
// };

// export default CopyTrade;
