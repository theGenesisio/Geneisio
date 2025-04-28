import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { CheckCircleIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { useNotification } from "../layout/NotificationHelper";
import FetchWithAuth from "../auth/api";
import Loader from "./subComponents/Loader";
import { useNavigate } from "react-router-dom";
/**
 * Fetches investment plans from the server.
 * Updates the state with the fetched plans and handles errors.
 * @async
 * @function
 * @returns {Promise<void>}
 */

/**
 * Navigates to the next page of plans if there are more pages available.
 * Increments the current page state.
 * @function
 * @returns {void}
 */

/**
 * Navigates to the previous page of plans if the current page is greater than 1.
 * Decrements the current page state.
 * @function
 * @returns {void}
 */

/**
 * Selects a specific plan for investment.
 * Sets the selected plan state and initializes the amount input with the plan's minimum limit.
 * @param {Object} plan - The investment plan to select.
 * @param {number} plan.limits.min - The minimum amount allowed for the plan.
 * @function
 * @returns {void}
 */

/**
 * Handles the action to confirm an investment.
 * Validates the amount against the selected plan's limits and submits the investment request.
 * Navigates to the dashboard on success.
 * @async
 * @function
 * @returns {Promise<void>}
 */

export default function PricingCard() {
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await FetchWithAuth(
        `/plans`,
        {
          method: "GET",
          credentials: "include",
        },
        "Failed to fetch plans"
      );
      if (response.failed) {
        addNotification(response.message, "error");
      } else {
        const { plans, message } = response;
        plans && setPlans(plans);
        addNotification(message);
      }
    } catch (err) {
      addNotification("An error occurred", "error");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const PLANS_PER_PAGE = 4;
  const indexOfLastPlan = currentPage * PLANS_PER_PAGE;
  const indexOfFirstPlan = indexOfLastPlan - PLANS_PER_PAGE;
  const currentPlans = plans.slice(indexOfFirstPlan, indexOfLastPlan);
  const totalPages = Math.ceil(plans.length / PLANS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const selectPlan = (plan) => {
    setSelectedPlan(plan);
    setAmount(plan.limits.min); // Set initial amount to the plan's minimum value
  };

  const handleAction = async () => {
    if (amount < selectedPlan.limits.min || amount > selectedPlan.limits.max) {
      addNotification(
        `Amount must be between ${selectedPlan.limits.min} and ${selectedPlan.limits.max}`,
        "error"
      );
      return;
    }
    setIsLoading(true);
    try {
      const response = await FetchWithAuth(
        `/investment`,
        {
          method: "POST",
          body: JSON.stringify({
            plan: selectedPlan,
            amount,
          }),
          credentials: "include",
        },
        "Failed to create plan"
      );
      if (response.failed) {
        addNotification(response.message, "error");
      } else {
        const { success, message } = response;
        if (success) {
          addNotification(message, "success");
          navigate("/app/dashboard");
        } else {
          addNotification("Investment request was not successful", "error");
        }
      }
    } catch (err) {
      addNotification("An error occurred while processing", "error");
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='w-full pb-4'>
      {/* Card showcase */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {loading ? (
          <Loader />
        ) : (
          currentPlans.map((plan, index) => (
            <Card key={index} color='gray' variant='gradient' className='w-full p-6'>
              <CardHeader
                floated={false}
                shadow={false}
                color='transparent'
                className='m-0 mb-8 rounded-none border-b border-white/10 pb-8 text-center'>
                <Typography variant='small' color='white' className='font-normal uppercase'>
                  {plan.name}
                </Typography>
                <Typography
                  variant='h1'
                  color='white'
                  className='mt-6 flex justify-center gap-1 text-7xl font-normal'>
                  {plan.ROIPercentage}% <span className='self-end text-4xl'>ROI</span>
                </Typography>
              </CardHeader>
              <CardBody className='p-0'>
                <ul className='flex flex-col gap-4'>
                  <li className='flex items-center gap-4'>
                    <CheckCircleIcon className='w-5 h-5 text-primary-mild' />
                    <Typography className='font-normal'>Min: ${plan.limits.min}</Typography>
                  </li>
                  <li className='flex items-center gap-4'>
                    <CheckCircleIcon className='w-5 h-5 text-primary-mild' />
                    <Typography className='font-normal'>Max: ${plan.limits.max}</Typography>
                  </li>
                  <li className='flex items-center gap-4'>
                    <CheckCircleIcon className='w-5 h-5 text-primary-mild' />
                    <Typography className='font-normal'>Duration: {plan.duration} days</Typography>
                  </li>
                </ul>
              </CardBody>
              <CardFooter className='mt-6 p-0'>
                <Button
                  className='accent-btn'
                  disabled={loading}
                  ripple={false}
                  fullWidth={true}
                  onClick={() => selectPlan(plan)}>
                  Invest Now
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      {/* Pagination  */}
      <div className='flex justify-between items-center mt-4'>
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className='bg-primary-mild text-text-dark hover:bg-primary-light'>
          Previous
        </Button>
        <Typography variant='small' color='gray'>
          Page {currentPage} of {totalPages} ({plans.length} items)
        </Typography>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className='bg-primary-mild text-text-dark hover:bg-primary-light'>
          Next
        </Button>
      </div>
      {/* Action on selected plan */}
      {selectedPlan && !isloading && (
        <Card
          variant='gradient'
          color='gray'
          className='w-full md:max-w-md mx-auto md:mx-0 p-6 mt-4'>
          <div className='flex justify-between'>
            <Typography variant='h5' className='mb-4'>
              Selected Plan: {selectedPlan.name}
            </Typography>
            <QuestionMarkCircleIcon
              title='Info'
              className='h-7 w-7  hover:scale-110 transition-transform cursor-help'
              onClick={() => setShowPrompt((prev) => !prev)}
            />
          </div>
          {showPrompt && (
            <div className='text-sm text-primary-light py-4'>
              <p>
                Investments run autonomously but must undergo review to ensure compliance with our
                terms of service.
                <br />
                Multiple requests would be overwrite the previous requests.
                <br />
                Once confimed and status set to active duration would start running and expiration
                would be set automatically
              </p>
            </div>
          )}
          <div className='mb-4'>
            <label className='block text-sm font-semibold text-text-light mb-1' htmlFor='amount'>
              Amount ($)
            </label>
            <input
              type='number'
              className='form-input w-full'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              id='amount'
              placeholder=''
              required
              min={selectedPlan?.limits.min}
              max={selectedPlan?.limits.max}
            />
          </div>
          <Button className='accent-btn' onClick={handleAction}>
            Confirm Investment
          </Button>
        </Card>
      )}
    </section>
  );
}
