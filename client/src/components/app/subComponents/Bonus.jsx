import { Card } from "@material-tailwind/react";
import useAuth from "../../auth/useAuth";
import { SparklesIcon } from "@heroicons/react/24/solid";

const Bonus = () => {
  const { user } = useAuth();
  return (
    <Card className='dashboard-box flex flex-col' variant='gradient' color='gray'>
      <h2 className='font-semibold text-2xl lg:text-3xl flex flex-col'>
        <SparklesIcon className='h-7 w-7 text-success-dark' />
        {`$${parseFloat(user?.wallet?.totalBonus || "0.00").toLocaleString()}`}
      </h2>
      <p className='text-sm text-primary-light'>Bonus</p>
    </Card>
  );
};

export default Bonus;
