import { useForm } from "react-hook-form";
import { LoginGraphic, Logo } from "../../assets/utilities";
import FormError from "../app/subComponents/FormError";
// import { isValidPassword } from "./authHelpers";
import { useNotification } from "../layout/NotificationHelper";
import FetchWithAuth from "./api";
import useAuth from "./useAuth";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const { addNotification } = useNotification();
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Handler for form submission
  const onSubmit = async (data) => {
    const response = await FetchWithAuth(
      `/auth/login`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      "Login failed"
    );
    let loginState = false;
    if (response.failed) {
      addNotification(response.message, "error");
      setTimeout(() => {
        return addNotification(response.failed, "error");
      }, 1000);
    }
    try {
      const { user, accessToken, refreshToken, message } = response;
      loginState = accessToken && updateUser(user, accessToken, refreshToken);
      accessToken && addNotification(message, "success");
    } finally {
      loginState && navigate("/app/dashboard");
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

      {/* Right Login Form Section */}
      <div className='flex flex-col w-full lg:w-1/2 items-center justify-center p-8'>
        <div className='max-w-md w-full'>
          <Link to='/' className='flex flex-col items-center lg:items-start gap-4 text-text-light'>
            <img
              src={Logo}
              alt='brand'
              className='lg:h-20 lg:w-20 m-0 hover:scale-105 duration-500 delay-100 transition-all w-20 h-20 object-cover'
            />
            <h2 className='text-3xl font-bold mb-6 text-center lg:text-start'>Genesisio</h2>
          </Link>
          <p className='text-text-light mb-6 text-center lg:text-start'>
            Please sign-in to your account.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                    message: "Password must be at least 6 characters long.",
                  },
                  // validate: (value) => isValidPassword(value),
                  maxLength: { value: 40, message: "Password must be at most 40 characters long." },
                })}
              />
              {errors.password && <FormError err={errors.password.message} />}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className='flex items-center justify-between mb-6'>
              <Link to='/auth/forgot-password' className='nav-link p-0'>
                Forgot Password?
              </Link>
              <p className='text-sm text-text-light'>
                No account?
                <Link to='/auth/register' className='nav-link p-0'>
                  Register
                </Link>
              </p>
            </div>

            <button type='submit' className='accent-btn  w-full' disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
