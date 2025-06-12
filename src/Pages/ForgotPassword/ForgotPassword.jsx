import React, { useState } from "react";
import "./ForgotPassword.css";
import "../../index.css";
import logo from "../../assets/svg-image-1.svg";
import axios from "axios";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Design from "../../Components/Design/Design";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import loading from "../../assets/Rolling@1x-1.0s-200px-200px.gif";
import { handleForgotPassword } from "../../Services/Onboarding";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState("password");
  const [isbuttonLoading, setIsButtonLoading] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ mode: "all" });

  const submitData = async (data) => {
    console.log(data);
    setIsButtonLoading(true);
    try {
      const response = await handleForgotPassword(
        data
      )
      if (response.data.success) {
        localStorage.setItem("otpToken", response.data.data.otpToken);
         toast.dismiss();
        toast.success(
          response.data.message || "OTP sent to your registerd email"
        );
        navigate("/verify-otp");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      if (error.response) {
        toast.dismiss();
        toast.error(error.response.data.message || "Server Error");
      } else if (error.request) {
         toast.dismiss();
        toast.error(
          "No response from server. Please check your internet connection."
        );
      } else {
        toast.dismiss();
        toast.error("Error: " + error.message);
      }
    }finally {
      setIsButtonLoading(false);
    }
  };
  const validateEmailOrPhone = (value) => {
    const emailRegex = /[A-Za-z0-9\._%+\-]+@[A-Za-z0-9]+\.[A-Za-z]{2,}/;
    const phoneRegex = /^\+?[0-9\s\-()]{7,}$/;
    if (emailRegex.test(value) || phoneRegex.test(value)) {
      return true;
    }
    return "Enter a valid email or a valid  contact number";
  };
  return (
    <div className="forgot-pass-page-container">
      <div className="border-design-div">
        <Design />
      </div>
      <div className="forgot-pass-container">
        <div className="forgot-pass-div-container">
          <div className="forgot-pass-div">
            <img src={logo} alt="Company Logo" />
          </div>
          <div className="forgot-pass-title">
            <h1>Forgot Password</h1>
          </div>
          <div className="forgot-pass-desc">
            <p>
              Enter your email to receive a password reset link
            </p>
          </div>
          <form
            className="forgot-pass-form-container"
            onSubmit={handleSubmit(submitData)}
          >
            <div className="login-email-div login-form-field">
              <input
                type="text"
                placeholder="Email*"
                name="email"
                maxLength={100}
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                  validate: {
                    matchPattern: (v) =>
                      /[A-Za-z0-9\._%+\-]+@[A-Za-z0-9]+\.[A-Za-z]{2,}/.test(
                        v
                      ) || "Please enter a valid email address",
                  },
                  //   validate:validateEmailOrPhone
                })}
              />
              {errors?.email && (
                <small className="errors-text">{errors.email.message}</small>
              )}
            </div>

            {/* <div className="pass-div login-form-field">
              <input
                type={passwordType}
                placeholder="Password*"
                name="password"
                maxLength={100}
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                })}
              />
              {errors?.password && (
                <small className="errors-text">{errors.password.message}</small>
              )}
              {passwordType === "password" ? (
                <FaEyeSlash
                  className="eye-icon pass-hidden"
                  onClick={() => setPasswordType("text")}
                />
              ) : (
                <FaEye
                  className="eye-icon"
                  onClick={() => setPasswordType("password")}
                />
              )}
            </div> */}
            {/* <div className="remember-container">
              <div className="remember-div">
                <input type="radio" />
                <span>Remember me</span>
              </div>
              <div
                className="forgot-pass-div"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </div>
            </div> */}
            <div className="login-btn-div">
              <button
                 disabled={isbuttonLoading?true:false}
                className={`${
                  isbuttonLoading ? "disabled-btn" : ""
                } confirm-btn `}
              >
                {" "}
                {isbuttonLoading ? (
                  <img
                    className="loading-image"
                    src={loading}
                    alt="loading..."
                  />
                ) : (
                  <p>Send</p>
                )}
              </button>
            </div>
          </form>
          {/* <div className="login-info-div">
              Already have an account?{" "}
              <span className="signup-link" onClick={() => navigate("/")}>
                Sign Up
              </span>
            </div> */}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
