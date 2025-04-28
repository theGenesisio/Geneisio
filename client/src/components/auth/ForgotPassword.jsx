import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoginGraphic, Logo } from "../../assets/utilities";
import FormError from "../app/subComponents/FormError";
import { useNotification } from "../layout/NotificationHelper";
import RequestCodeButton from "../app/subComponents/RequestCodeButton";
import FetchWithAuth from "./api";
import { useNavigate } from "react-router-dom";

const PasswordReset = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [errorMessage, setErrorMessage] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [resetAllowed, setresetAllowed] = useState(false);
  const [user, setuser] = useState(null);
  // Watch the email field value
  const emailValue = watch("email", "");
  const onSubmit = async (data) => {
    setCodeSent(false);
    setuser(null);
    setErrorMessage("");
    setresetAllowed(false);
    try {
      const response = await FetchWithAuth(
        `/auth/check-user/${emailValue || data?.email}`,
        {
          method: "GET",
          credentials: "include",
        },
        "Error finding associated user"
      );
      if (response.failed) {
        const { message, user } = response;
        setErrorMessage(message);
        setuser(user);
        const isRestricted = message === "Password change temporarily restricted";
        setresetAllowed(false);
        addNotification(message, isRestricted ? "warning" : "error");
      } else {
        const { user: sentUser, message, codeSent: code } = response;
        sentUser && setuser(sentUser);
        code && setresetAllowed(true);
        code && setCodeSent(!!code);
        message && addNotification(message);
      }
    } catch (err) {
      addNotification("An error occurred", "error");
      console.error("Fetch error:", err);
    }
  };

  const handleReset = async (data) => {
    try {
      const response = await FetchWithAuth(
        `/auth/reset-password/${user?._id}/${user?.email}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          credentials: "include",
        },
        "Error processing password reset"
      );

      const { failed, message, success } = response;

      if (failed) {
        setErrorMessage(message);
        addNotification(message, "error");
        return;
      }

      if (success) {
        addNotification(message || "Password reset successful", "success");
        navigate("/auth/login");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      addNotification("An error occurred while resetting your password.", "error");
    } finally {
      reset();
    }
  };

  return (
    <div className='flex min-h-screen text-white'>
      {/* Left Image Section - Only visible on large screens */}
      <div className='hidden lg:flex w-1/2 items-center justify-center p-8 bg-primary-default'>
        <div className='relative flex flex-col items-center'>
          <img src={LoginGraphic} alt='Character' className='w-full h-full object-cover' />
        </div>
      </div>

      {/* Right Password Reset Form Section */}
      <div className='flex flex-col w-full lg:w-1/2 items-center justify-center p-8'>
        <div className='max-w-md w-full'>
          <Link to='/' className='flex flex-col items-center lg:items-start gap-4 text-text-light'>
            <img
              src={Logo}
              alt='brand'
              className='h-12 w-12 lg:h-14 lg:w-14 m-0 hover:scale-105 duration-500 delay-100 transition-all'
            />
            <h2 className='text-3xl font-bold mb-6 text-center lg:text-start'>Genesisio</h2>
          </Link>
          {!codeSent ? (
            <p className='text-text-light mb-6 text-center lg:text-start font-semibold'>
              {user && !resetAllowed
                ? user?.fullName
                : !user && !resetAllowed
                ? "Request a reset code"
                : ""}
            </p>
          ) : (
            <p className='text-text-light mb-6 text-center lg:text-start font-semibold'>
              {user?.fullName}
            </p>
          )}
          {codeSent && (
            <p className='text-md text-primary-light mb-2 text-center lg:text-start'>
              A reset code has been sent to your email. Please note that the code will expire in 5
              minutes. Your next password change will be{" "}
              <span className='highlight'>allowed in 21 days</span>. We strongly recommend securely
              backing up your password to avoid potential account restrictions during this period.
            </p>
          )}
          {!resetAllowed && user && (
            <p className='text-md text-primary-light mb-2 text-center lg:text-start'>
              We have located an account associated with the provided email. However, password
              changes are currently restricted, as the last password reset was performed on{" "}
              {user?.lastPasswordChange}
            </p>
          )}
          {codeSent ? (
            <form onSubmit={handleSubmit(handleReset)} className='space-y-4'>
              <div>
                <label
                  className='flex flex-row justify-between text-sm font-medium text-text-light mb-1'
                  htmlFor='code'>
                  <p>Reset Code</p>
                  <RequestCodeButton
                    email={emailValue}
                    codeSent={codeSent}
                    setCodeSent={setCodeSent}
                  />
                </label>
                <input
                  id='code'
                  type='text'
                  className={`form-input w-full ${errors.code ? "border-error-dark" : ""}`}
                  placeholder='Reset code'
                  {...register("code", {
                    required: "Code is required.",
                  })}
                />
                {errors.code && <FormError err={errors.code.message} />}
              </div>
              <div>
                <label
                  className='block text-sm font-medium text-text-light mb-1'
                  htmlFor='new-password'>
                  New Password
                </label>
                <input
                  id='new-password'
                  type='password'
                  className={`form-input w-full ${errors.newPassword ? "border-error-dark" : ""}`}
                  placeholder='Enter your new password'
                  {...register("newPassword", {
                    required: "New password is required.",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long.",
                    },
                  })}
                />
                {errors.newPassword && <FormError err={errors.newPassword.message} />}
              </div>
              <div>
                <label
                  className='block text-sm font-medium text-text-light mb-1'
                  htmlFor='confirm-password'>
                  Confirm New Password
                </label>
                <input
                  id='confirm-password'
                  type='password'
                  className={`form-input w-full ${
                    errors.confirmPassword ? "border-error-dark" : ""
                  }`}
                  placeholder='Confirm your new password'
                  {...register("confirmPassword", {
                    required: "Please confirm your new password.",
                    validate: (value) =>
                      value === watch("newPassword") || "Passwords do not match.",
                  })}
                />
                {errors.confirmPassword && <FormError err={errors.confirmPassword.message} />}
              </div>
              {/* Remember Me & Forgot Password */}
              <div className='flex items-center justify-between'>
                <p className='text-sm text-text-light'>
                  Remember password?
                  <Link to='/auth/login' className='nav-link p-0'>
                    Sign in
                  </Link>
                </p>
                <div className='flex items-center justify-between'>
                  <p className='text-sm text-text-light'>Wrong email?</p>
                  <p onClick={() => setCodeSent(false)} className='nav-link p-0'>
                    Back
                  </p>
                </div>
              </div>
              <button type='submit' className='accent-btn w-full' disabled={isSubmitting}>
                {isSubmitting ? "Reseting..." : "Reset password"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
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
              {/* Remember Me & Forgot Password */}
              <div className='flex items-center justify-between'>
                <p className='text-sm text-text-light'>
                  Remember password?
                  <Link to='/auth/login' className='nav-link p-0'>
                    Sign in
                  </Link>
                </p>
                <p className='text-sm text-text-light'>
                  No account?
                  <Link to='/auth/register' className='nav-link p-0'>
                    Register
                  </Link>
                </p>
              </div>
              <button type='submit' className='accent-btn w-full' disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Request Reset Code"}
              </button>
            </form>
          )}
          <div className='w-full flex justify-center'>
            {errorMessage && <FormError err={errorMessage} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
