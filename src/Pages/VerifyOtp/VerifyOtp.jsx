import React, { useEffect, useRef, useState } from "react";
import "./VerifyOtp.css";
import "../../index.css";
import logo from "../../assets/svg-image-1.svg";
import { useNavigate } from "react-router-dom";
import Design from "../../Components/Design/Design";
import axios from "axios";
import { toast } from "react-toastify";
import loading from "../../assets/Rolling@1x-1.0s-200px-200px.gif";
import { handleResendOtp, handleVerifyOtp } from "../../Services/Onboarding";

const Verifyotp = ({ length = 6 }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputs = useRef([]);
  const [isbuttonLoading, setIsButtonLoading] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsButtonLoading(true);
    // const Otp=otp.join().replaceAll(",","")
    const Otp = otp.join("").trim();

    try {
      const response = await handleVerifyOtp(Otp);
  
      if (response.data.success) {
        localStorage.setItem("resetToken", response.data.data.resetToken);
        toast.dismiss();
        toast.success(response.data.message);
        localStorage.removeItem("otpToken");
        navigate("/reset-password");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);

      if (error.response) {
        toast.dismiss();
        toast.error(
          error.response.data.message || "Server responded with an error"
        );
      } else if (error.request) {
        toast.dismiss();
        toast.error(
          "No response from server. Please check your internet connection."
        );
      } else {
        toast.dismiss();
        toast.error("Error: " + error.message);
      }
    } finally {
      setIsButtonLoading(false);
      setOtp(Array(length).fill(""));
    }

    // add the toast here to notify user that verification is successful
  };
  const handleChange = (e, index) => {
    const { value } = e.target;

    // Only allow single digit input
    if (value.match(/^\d$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input
      if (index < length - 1) {
        inputs.current[index + 1].focus();
      } else if (value === "") {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }

    // Move focus to previous input on backspace
    if (value === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index] !== "") {
        // Clear the current input
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move focus to previous input and clear it
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputs.current[index - 1].focus();
      }
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    console.log("OTP resent");

    try {
    
      const response = await handleResendOtp()
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

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  return (
    <div className="otp-page-container">
      <div className="border-design-div">
        <Design />
      </div>
      <div className="otp-container">
        <div className="otp-div-container">
          <div className="otp-div">
            <img src={logo} alt="Company Logo" />
          </div>
          <div className="otp-title">
            <h1>Verify OTP</h1>
          </div>
          <div className="otp-desc">
            <p>
              {" "}
              A verification code has been sent to you. Please check your inbox
              and enter the code below to verify your account
            </p>
          </div>
          <form className="otp-form" onSubmit={(e) => handleSubmit(e)}>
            <div className="otp-email-div">
              {otp.map((_, index) => (
                <input
                  key={index}
                  className="otp-box-input"
                  type="text"
                  maxLength="1"
                  value={otp[index]}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputs.current[index] = el)}
                />
              ))}
            </div>
            {/* <div className="verify-otp-div">
              Didn't receive?<span>Resend</span>{" "}
            </div> */}
            <div className="verify-otp-div">
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
            <button
              disabled={isbuttonLoading ? true : false}
              className={`${
                isbuttonLoading ? "disabled-btn" : ""
              } confirm-btn `}
            >
              {" "}
              {isbuttonLoading ? (
                <img className="loading-image" src={loading} alt="loading..." />
              ) : (
                <p>Verify</p>
              )}
            </button>
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

export default Verifyotp;
