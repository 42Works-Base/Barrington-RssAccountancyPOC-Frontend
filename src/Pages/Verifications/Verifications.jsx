import React, { useEffect, useRef, useState } from "react";
import "./Verifications.css";
import "../../index.css";
// import logo from "../../assets/svg-image-1.svg";
import logo from "../../assets/Group 3.png";
const VITE_API_URL = import.meta.env.VITE_API_URL;
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Design from "../../Components/Design/Design";
import { useForm } from "react-hook-form";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { FaExclamation } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { handleEmailResendOtp, handleVerifyPhone, handleVerifyEmailOtp, handleSMSResendOtp } from "../../Services/Onboarding";
const Verifications = ({ length = 6 }) => {
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState("password");
  const [resendTimer, setResendTimer] = useState(0);
  const [resendTimerForPhone, setResendTimerForPhone] = useState(0);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [EmailOtp, setEmailOtp] = useState(Array(length).fill(""));
  const EmailInputs = useRef([]);
  const [isEmailOtpComplete, setIsEmailOtpComplete] = useState(false);
  const [phoneOtp, setphoneOtp] = useState(Array(length).fill(""));
  const phoneInputs = useRef([]);
  const [isPhoneOtpComplete, setIsPhoneOtpComplete] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [phoneLoading, setphoneLoading] = useState(false);
  const {
    register,

    formState: { errors },
    getValues,
  } = useForm({ mode: "all" });

  const submitData = (data) => {
    console.log(data);
    if (!isEmailVerified) {
      console.log("verify email first")
      return
    }
    if (!isPhoneVerified) {
      console.log("verify phone first")
      return;
    }
    localStorage.removeItem("tempToken");
    navigate("/login");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(EmailOtp, phoneOtp);
    if (!isEmailVerified) {
      toast.error("Please verify your email first")
      return;
    }
    if (!isPhoneVerified) {
      toast.error("Please verify your phone number first")
      return;
    }
    localStorage.removeItem("tempToken");
    navigate("/login");
  };

  const handleVerifyEmail = async () => {
    if (!isEmailOtpComplete || emailLoading) return;
    setEmailLoading(true);

    const Otp = EmailOtp.join("").trim();
    console.log(Otp);
    try {
      const response = await handleVerifyEmailOtp(Otp)
      if (response.data.success) {
        console.log(response.data.message);
        toast.dismiss();
        toast.success(response.data.message);
        setIsEmailVerified(true);
      }
    } catch (error) {
      console.error("Verification  failed:", error);
      if (error.response) {
        // API responded with a status other than 2xx
        toast.dismiss();
        toast.error(error.response.data.message || "Verification error");
      } else if (error.request) {
        // Request made but no response
        toast.dismiss();
        toast.error("No response from server. Please try again.");
      } else {
        // Something else caused the error
        toast.dismiss();
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setEmailLoading(false);
      // setEmailOtp(Array(length).fill(""));
    }
  };
  const handleVerifyPhoneNumber = async () => {
    if (!isPhoneOtpComplete || phoneLoading) return;
    console.log("first");
    setphoneLoading(true);
    const Otp = phoneOtp.join("").trim();
    console.log(Otp);
    try {
      const response = await handleVerifyPhone(Otp)
      if (response.data.success) {
        console.log(response.data.message);
        toast.dismiss();
        toast.success(response.data.message);
        setIsPhoneVerified(true);
      }
    } catch (error) {
      console.error("Verification  failed:", error);
      if (error.response) {
        toast.dismiss();
        toast.error(error.response.data.message || "Verification error");
      } else if (error.request) {
        toast.dismiss();
        toast.error("No response from server. Please try again.");
      } else {
        toast.dismiss();
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setphoneLoading(false);
      // setphoneOtp(Array(length).fill(""));
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    console.log("OTP resent");

    try {
      const response = await handleEmailResendOtp()
      // axios.post(
      //   "http://localhost:5070/onboarding/auth/resendEmailCode",
      //   {
      //     tempToken: tempToken,
      //   }
      // );
      if (response.data.success) {
        console.log(response.data.message);
        toast.dismiss();
        toast.success(
          response.data.message || "OTP has been sent to your mail"
        );
        setResendTimer(59);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      if (error.response) {
        const errMsg = error.response.data.message || "Server error occurred";
        toast.dismiss();
        toast.error(errMsg);
      } else if (error.request) {
        toast.dismiss();
        toast.error("No response from server. Please try again later.");
      } else {
        toast.dismiss();
        toast.error("Something went wrong. Please try again.");
      }
    }
  };
  const handlePhoneResendOTP = async () => {
    if (resendTimerForPhone > 0) return;
    console.log("OTP resent");
    try {
     
      const response = await handleSMSResendOtp()
      // axios.post(
      //   "http://localhost:5070/onboarding/auth/resendSMSCode",
      //   {
      //     tempToken: tempToken,
      //   }
      // );
      if (response.data.success) {
        console.log(response.data.message);
        toast.dismiss();
        toast.success(
          response.data.message ||
            "OTP has been sent to your registerd Phone number"
        );
        setResendTimerForPhone(59);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      if (error.response) {
        const errMsg = error.response.data.message || "Server error occurred";
        toast.dismiss();
        toast.error(errMsg);
      } else if (error.request) {
        toast.dismiss();
        toast.error("No response from server. Please try again later.");
      } else {
        toast.dismiss();
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  useEffect(() => {
    let timer;
    if (resendTimerForPhone > 0) {
      timer = setInterval(() => {
        setResendTimerForPhone((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimerForPhone]);

  const fetchChecks = async () => {
    const tempToken = localStorage.getItem("tempToken");
    const response = await axios.post(
      `${VITE_API_URL}/onboarding/auth/verifyChecks`,
      {
        tempToken: tempToken,
      }
    );
    console.log("response", response);
    if (response.data.success) {
      if (response.data.data.isVerifiedByEmail) {
        setIsEmailVerified(true);
      } else {
        setIsEmailVerified(false);
      }

      if (response.data.data.isVerifiedByPhone) {
        setIsPhoneVerified(true);
      } else {
        setIsPhoneVerified(false);
      }
    }
  };

  useEffect(() => {
    fetchChecks();
  }, []);
  const handleEmailChange = (e, index) => {
    const { value } = e.target;

    // Only allow single digit input
    if (value.match(/^\d$/)) {
      const newOtp = [...EmailOtp];
      newOtp[index] = value;
      setEmailOtp(newOtp);

      // Move focus to the next input
      if (index < length - 1) {
        EmailInputs.current[index + 1].focus();
      } else if (value === "") {
        const newOtp = [...EmailOtp];
        newOtp[index] = "";
        setEmailOtp(newOtp);
      }
    }

    // Move focus to previous input on backspace
    if (value === "" && index > 0) {
      EmailInputs.current[index - 1].focus();
    }
  };
  const handleEmailKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...EmailOtp];

      if (EmailOtp[index] !== "") {
        // Clear the current input
        newOtp[index] = "";
        setEmailOtp(newOtp);
      } else if (index > 0) {
        // Move focus to previous input and clear it
        newOtp[index - 1] = "";
        setEmailOtp(newOtp);
        EmailInputs.current[index - 1].focus();
      }
    }
  };
  const handlePhoneChange = (e, index) => {
    const { value } = e.target;

    // Only allow single digit input
    if (value.match(/^\d$/)) {
      const newOtp = [...phoneOtp];
      newOtp[index] = value;
      setphoneOtp(newOtp);

      // Move focus to the next input
      if (index < length - 1) {
        phoneInputs.current[index + 1].focus();
      } else if (value === "") {
        const newOtp = [...phoneOtp];
        newOtp[index] = "";
        setphoneOtp(newOtp);
      }
    }

    // Move focus to previous input on backspace
    if (value === "" && index > 0) {
      phoneInputs.current[index - 1].focus();
    }
  };
  const handlePhoneKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...phoneOtp];

      if (phoneOtp[index] !== "") {
        // Clear the current input
        newOtp[index] = "";
        setphoneOtp(newOtp);
      } else if (index > 0) {
        // Move focus to previous input and clear it
        newOtp[index - 1] = "";
        setphoneOtp(newOtp);
        phoneInputs.current[index - 1].focus();
      }
    }
  };

  useEffect(() => {
    const isComplete = EmailOtp.every(
      (digit) => digit !== "" && digit.match(/^\d$/)
    );
    setIsEmailOtpComplete(isComplete);
  }, [EmailOtp]);
  useEffect(() => {
    const isComplete = phoneOtp.every(
      (digit) => digit !== "" && digit.match(/^\d$/)
    );
    setIsPhoneOtpComplete(isComplete);
  }, [phoneOtp]);

  return (
    <div className="verify-page-container">
      <div className="border-design-div">
        <Design />
      </div>
      <div className="verify-container">
        <div className="verify-div-container">
          <div className="logo-div">
            <img src={logo} alt="Company Logo" />
          </div>
          <div className="verify-title">
            <h1>Verify Your account</h1>
          </div>
          <div className="verify-desc">
            <p>
              Verification codes has been sent to your registered email Id and
              phone number
            </p>
          </div>
          <form
            className="verify-form-container"
            onSubmit={(e) => handleSubmit(e)}
          >
            {/* <div className="verify-email-div verify-form-field">
              <input
                type="text"
                placeholder="Enter verification code"
                name="verifyEmail"
                maxLength={6}
                {...register("verifyEmail", {
                  required: {
                    value: true,
                    message: "Email verification code is required",
                  },
                })}
              />
              <div className="email-icon">
                <MdEmail size={20} />
              </div>
              <button
                type="button"
                className="verify-btn"
                disabled={isEmailVerified?true:false}
                onClick={() => handleVerifyEmail()}
                style={{
                  backgroundColor: isEmailVerified?"green":"#2a8897",
                  cursor:isEmailVerified?"not-allowed":'pointer'
                }}
              >
                {isEmailVerified?"Verified":"Verify"}
              </button>
              {errors?.verifyEmail && (
                <small className="verify-errors-text">
                  {errors.verifyEmail.message}
                </small>
              )}
            </div> */}

            <div className="otp-email-div verify-form-field">
              <div className="email-icon">
                <MdEmail size={20} />
              </div>
              {EmailOtp.map((_, index) => (
                <input
                  key={index}
                  className="verifications-otp-box-input"
                  type="text"
                  maxLength="1"
                  value={EmailOtp[index]}
                  onChange={(e) => handleEmailChange(e, index)}
                  onKeyDown={(e) => handleEmailKeyDown(e, index)}
                  ref={(el) => (EmailInputs.current[index] = el)}
                />
              ))}

              <button
                className={`exclamation-icon ${
                  isEmailOtpComplete ? "enabled" : "disabled"
                }`}
                disabled={!emailLoading && isEmailOtpComplete && !isEmailVerified ? false : true}
                onClick={
                  !emailLoading && isEmailOtpComplete ? handleVerifyEmail : null
                }
                style={{
                  cursor: isEmailOtpComplete && !isEmailVerified? "pointer" : "not-allowed",
                  opacity: isEmailOtpComplete ? 1 : 0.5,
                   backgroundColor:isEmailVerified?"#6a9b6a":"#9b9a9a"
                }}
              >
                <FaCheck />
              </button>
            </div>

            <div className="resend-otp-div">
              Didn't receive?{" "}
              <span
                onClick={handleResendOTP}
                style={{
                  color: resendTimer > 0 ? "#999" : "blue",
                  cursor: resendTimer > 0 ? "not-allowed" : "pointer",
                  textDecoration: resendTimer > 0 ? "none" : "underline",
                }}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
              </span>
            </div>

            {/* <div className="verify-phone-div verify-form-field">
              <input
                type="text"
                placeholder="Enter verification code"
                name="verifyPhone"
                maxLength={6}
                {...register("verifyPhone", {
                  required: {
                    value: true,
                    message: "Phone number verification code is required",
                  },
                })}
              />
              <div className="email-icon">
                <FaPhoneAlt size={20} />
              </div>
              <button
                type="button"
                className="verify-btn"
                disabled={isPhoneVerified?true:false}
                onClick={() => handleVerifyPhoneNumber()}
                style={{
                  backgroundColor:isPhoneVerified?"green":"#2a8897",
                  cursor:isPhoneVerified?"not-allowed":'pointer'
                }}
              >
                {isPhoneVerified?"Verified":"Verify"}
              </button>
              {errors?.verifyPhone && (
                <small className="verify-errors-text">
                  {errors.verifyPhone.message}
                </small>
              )}
            </div> */}

            <div className="otp-email-div verify-form-field">
              <div className="email-icon">
                <FaPhoneAlt size={20} />
              </div>
              {phoneOtp.map((_, index) => (
                <input
                  key={index}
                  className="verifications-otp-box-input"
                  type="text"
                  maxLength="1"
                  value={phoneOtp[index]}
                  onChange={(e) => handlePhoneChange(e, index)}
                  onKeyDown={(e) => handlePhoneKeyDown(e, index)}
                  ref={(el) => (phoneInputs.current[index] = el)}
                />
              ))}
              <button
                className={`exclamation-icon ${
                  isPhoneOtpComplete ? "enabled" : "disabled"
                }`}
                disabled={!phoneLoading && isPhoneOtpComplete && !isPhoneVerified  ? false : true}
                onClick={
                  !phoneLoading && isPhoneOtpComplete
                    ? handleVerifyPhoneNumber
                    : null
                }
                style={{
                  cursor: isPhoneOtpComplete && !isPhoneVerified ? "pointer" : "not-allowed",
                  opacity: isPhoneOtpComplete ? 1 : 0.5,
                  backgroundColor:isPhoneVerified?"#6a9b6a":"#9b9a9a"

                }}
              >
                <FaCheck />
                {/* <FaExclamation /> */}
              </button>
            </div>

            {/* <div className="resend-otp-div">
              Didn't receive?<span>Resend</span>{" "}
            </div> */}
            <div className="resend-otp-div">
              Didn't receive?{" "}
              <span
                onClick={handlePhoneResendOTP}
                style={{
                  color: resendTimerForPhone > 0 ? "#999" : "blue",
                  cursor: resendTimerForPhone > 0 ? "not-allowed" : "pointer",
                  textDecoration:
                    resendTimerForPhone > 0 ? "none" : "underline",
                }}
              >
                {resendTimerForPhone > 0
                  ? `Resend in ${resendTimerForPhone}s`
                  : "Resend"}
              </span>
            </div>
            <div className="verify-btn-div">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Verifications;
