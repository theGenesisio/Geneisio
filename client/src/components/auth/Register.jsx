import { useForm } from "react-hook-form";
import { Logo } from "../../assets/utilities";
import FormError from "../app/subComponents/FormError";
// import { isValidPassword } from "./authHelpers";
import { useNotification } from "../layout/NotificationHelper";
import FetchWithAuth from "./api";
import { Link, useNavigate } from "react-router-dom";
import CountrySelect from "../app/subComponents/CountrySelect";
// import CurrencySelect from "../app/subComponents/CurrencySelect";

const Registration = () => {
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    // getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // Handler for form submission
  const onSubmit = async (data) => {
    const response = await FetchWithAuth(
      `/auth/register`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      "Registration failed"
    );
    console.log(data);
    if (response.failed) {
      addNotification(response.message, "error");
    } else {
      addNotification(response.message, "success");
      navigate("/auth/login");
    }
  };

  return (
    <div className='flex min-h-screen text-white'>
      {/* Left Image Section - Only visible on large screens */}
      <div className='hidden lg:flex w-1/2 items-center justify-center bg-primary-default p-8'>
        <div className='relative flex flex-col items-center'>
          <img src={Logo} alt='brand' className='w-full h-full object-cover' />
        </div>
      </div>

      {/* Right Registration Form Section */}
      <div className='flex flex-col w-full lg:w-1/2 items-center justify-center p-8'>
        <div className='max-w-md w-full'>
          <Link
            to='/'
            className='flex flex-col items-center lg:items-start gap-4 text-text-light mb-6'>
            <img
              src={Logo}
              alt='brand'
              className='m-0 hover:scale-105 duration-500 delay-100 transition-all w-20 h-20 object-cover'
            />
            <h2 className='text-2xl font-bold text-center lg:text-start hidden lg:block'>
              Welcome to Genesisio
            </h2>
          </Link>
          <p className='text-text-light mb-6 text-center lg:text-start'>
            Please create your account.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name Input */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-text-light mb-1' htmlFor='fullName'>
                Full Name
              </label>
              <input
                id='fullName'
                type='text'
                className={`form-input w-full ${errors.fullName ? "border-error-dark" : ""}`}
                placeholder='Enter your full name'
                {...register("fullName", { required: "Full name is required." })}
              />
              {errors.fullName && <FormError err={errors.fullName.message} />}
            </div>

            {/* Email Input */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-text-light mb-1' htmlFor='email'>
                Email
              </label>
              <input
                id='email'
                type='email'
                className={`form-input w-full ${errors.email ? "border-error-dark" : ""}`}
                placeholder='Enter your email'
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address.",
                  },
                })}
              />
              {errors.email && <FormError err={errors.email.message} />}
            </div>

            {/* Phone Number Input */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-text-light mb-1' htmlFor='phone'>
                Phone Number
              </label>
              <input
                id='phone'
                type='tel'
                className={`form-input w-full ${errors.phone ? "border-error-dark" : ""}`}
                placeholder='Enter your phone number'
                {...register("phone", {
                  required: "Phone number is required.",
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/, // Supports international numbers
                    message: "Invalid phone number format.",
                  },
                })}
              />
              {errors.phone && <FormError err={errors.phone.message} />}
            </div>

            {/* Gender Select */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-text-light mb-1' htmlFor='gender'>
                Gender
              </label>
              <select
                id='gender'
                className={`form-input w-full ${errors.gender ? "border-error-dark" : ""}`}
                {...register("gender", { required: "Gender is required." })}>
                <option value=''>Select gender</option>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='other'>Other</option>
              </select>
              {errors.gender && <FormError err={errors.gender.message} />}
            </div>

            {/* Country Select */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-text-light mb-1' htmlFor='country'>
                Country
              </label>
              <CountrySelect register={register} errors={errors} />
              {errors.country && <FormError err={errors.country.message} />}
            </div>

            {/* Password Input */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-text-light mb-1' htmlFor='password'>
                Password
              </label>
              <input
                id='password'
                type='password'
                className={`form-input w-full ${errors.password ? "border-error-dark" : ""}`}
                placeholder='Enter your password'
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long.",
                  },
                  // validate: (value) => isValidPassword(value),
                  maxLength: { value: 40, message: "Password must be at most 40 characters long." },
                })}
              />
              {errors.password && <FormError err={errors.password.message} />}
            </div>

            {/* Confirm Password Input */}
            <div className='mb-4'>
              <label
                className='block text-sm font-medium text-text-light mb-1'
                htmlFor='confirmPassword'>
                Confirm Password
              </label>
              <input
                id='confirmPassword'
                type='password'
                className={`form-input w-full ${errors.confirmPassword ? "border-error-dark" : ""}`}
                placeholder='Confirm your password'
                {...register("confirmPassword", {
                  required: "Confirm Password is required.",
                  // validate: (value) => value === getValues("password") || "Passwords must match.",
                  validate: (value) => value === watch("password") || "Passwords do not match.",
                })}
              />
              {errors.confirmPassword && <FormError err={errors.confirmPassword.message} />}
            </div>

            {/* Referral Code Input */}
            <div className='mb-4'>
              <label
                className='block text-sm font-medium text-text-light mb-1'
                htmlFor='referralCode'>
                Referral Code (Optional)
              </label>
              <input
                id='referralCode'
                type='text'
                className={`form-input w-full ${errors.referralCode ? "border-error-dark" : ""}`}
                placeholder='Enter referral code (optional)'
                {...register("referralCode")}
              />
            </div>

            {/* Terms and Conditions */}
            <div className='mb-4 flex items-center'>
              <input
                id='terms'
                type='checkbox'
                className='check-box'
                {...register("terms", { required: "You must agree to the terms and conditions." })}
              />
              <label htmlFor='terms' className='text-sm text-text-light'>
                I agree to the
                <Link to='/terms' className='nav-link'>
                  Terms and Conditions
                </Link>
              </label>
            </div>
            {errors.terms && <FormError err={errors.terms.message} />}

            {/* Submit Button */}
            <button type='submit' className='accent-btn w-full' disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Sign In Link */}
          <p className='text-center mt-4 text-sm text-text-light'>
            Already have an account?
            <Link to='/auth/login' className='nav-link'>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
