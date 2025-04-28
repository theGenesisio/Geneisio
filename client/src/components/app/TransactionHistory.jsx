/**
 * TransactionForm component renders a tabbed interface for viewing transaction history.
 * It includes tabs for "Deposit" and "Withdrawal" and conditionally renders the respective
 * history tables based on the active tab.
 *
 * @component
 * @example
 * // Usage example:
 * // <TransactionForm />
 *
 * @returns {JSX.Element} The rendered TransactionForm component.
 *
 * @description
 * The component uses the `useSearchParams` hook from `react-router-dom` to read the query parameter
 * and set the initial active tab. It also uses the `useState` and `useEffect` hooks from React.
 *
 * @function
 * @name TransactionForm
 */
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BanknotesIcon, DocumentCurrencyDollarIcon } from "@heroicons/react/24/solid";
import WithdawalHistoryTable from "./subComponents/WithdawalHistoryTable";
import DepositHistoryTable from "./subComponents/DepositHistoryTable";
import LiveTradeTable from "./subComponents/LivetradeTable";
import { liveTradeIcon } from "../../assets/icons";
const TransactionForm = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("");

  const tabs = [
    { name: "Deposit", icon: <BanknotesIcon className='h-4 w-4 text-success-light' /> },
    {
      name: "Withdrawal",
      icon: <DocumentCurrencyDollarIcon className='h-4 w-4 text-error-light' />,
    },
    {
      name: "LiveTrade",
      icon: <span className='h-4 w-4 text-success-light'>{liveTradeIcon}</span>,
    },
  ];

  // Set the initial active tab based on the query parameter
  useEffect(() => {
    const initialTab = searchParams.get("tab")?.toLowerCase() || "deposit"; // Default to "deposit"
    const matchingTab = tabs.find((tab) => tab.name.toLowerCase() === initialTab);
    setActiveTab(matchingTab ? matchingTab.name : "Deposit"); // Default to "deposit" if no match
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <section className='max-w-[96dvw] md:max-w-[95dvw] lg:max-w-[80dvw] md:w-full flex flex-col justify-center mx-auto pe-2'>
      <div className='w-full mb-5 bg-primary-default shadow-md rounded-md'>
        <ul className='flex px-2 py-2 rounded-md'>
          {tabs.map((tab) => (
            <li key={tab.name} className='flex-auto text-center'>
              <button
                className={`flex items-center justify-center w-full py-2 text-sm cursor-pointer transition-all ease-in-out duration-500 delay-100 rounded-md font-semibold ${
                  activeTab === tab.name
                    ? "bg-primary-dark text-text-light font-bold"
                    : "hover:scale-105 text-primary-light"
                }`}
                onClick={() => setActiveTab(tab.name)}>
                {tab.icon}
                <span className='ml-1'>{tab.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Conditionally render diff text underneath the tabs */}
      {activeTab === "Deposit" && <DepositHistoryTable />}
      {activeTab === "Withdrawal" && <WithdawalHistoryTable />}
      {activeTab === "LiveTrade" && <LiveTradeTable />}
    </section>
  );
};

export default TransactionForm;
