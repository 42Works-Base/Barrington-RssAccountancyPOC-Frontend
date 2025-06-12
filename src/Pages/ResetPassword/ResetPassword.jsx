import React, { useState } from "react";
import "./ResetPassword.css";
import "../../index.css";
import logo from "../../assets/svg-image-1.svg";

import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Design from "../../Components/Design/Design";
import { useForm } from "react-hook-form";
import axios from "axios";
import loading from "../../assets/Rolling@1x-1.0s-200px-200px.gif";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { RxCross2 } from "react-icons/rx";
import { MdCheck } from "react-icons/md";
import { handleResetPassword } from "../../Services/Onboarding";
const ResetPassword = () => {
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState("password");
  const [cPasswordType, setCPasswordType] = useState("password");
  const [isPasswordShowing, setIsPasswordShowing] = useState(false);
  const [isbuttonLoading, setIsButtonLoading] = useState(null);
  const [isUpperLowerCase, setIsUpperLowercase] = useState(false);
  const [isNumberOrSymbol, setIsNumberOrSymbol] = useState(false);
  const [isEightCharacters, setIsEightCharacters] = useState(false);
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const [isPassIconHover, setIsPassIconHover] = useState(false);
  const [isToolTipOpen, setIsTooltipOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ mode: "all" });

  const handleInput = (e) => {
    console.log("qwertyu", e.target.value);
    const value = e.target.value;
    // setPassword(value)
    setIsUpperLowercase(/[a-z]/.test(value) && /[A-Z]/.test(value));
    setIsNumberOrSymbol(/[\d\W]/.test(value));
    setIsEightCharacters(value.length >= 8);
  };

  const submitData = async (data) => {
    console.log(data);
    setIsButtonLoading(true);

    try {
      const response = await handleResetPassword(data);
      if (response.data.success) {
        toast.dismiss();
        toast.success(response.data.message);
        localStorage.removeItem("resetToken");
        navigate("/login");
      }
    } catch (error) {
      console.error("Reset Password Error:", error);

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
    }
  };

  return (
    <div className="reset-page-container">
      <div className="border-design-div">
        <Design />
      </div>
      <div className="reset-container">
        <div className="reset-div-container">
          <div className="logo-div">
            <img src={logo} alt="Company Logo" />
          </div>
          <div className="reset-title">
            <h1>Reset Password</h1>
          </div>
          <div className="reset-desc">
            <p>Enter your details below to sign In and get started</p>
          </div>
          <form
            className="reset-form-container"
            onSubmit={handleSubmit(submitData)}
          >
            {/* <div className="pass-div reset-form-field">
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

                  validate: {
                    matchPattern: (v) =>
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d!@#$%^&.*]).{8,20}$/.test(
                        v
                      ) ||
                      "Password must be atleast 8 characters long and must contain at least one uppercase letter, one lowercase letter, and one special character or number",
                  },
                })}
              />
              {errors?.password && (
                <small
                  className={`${
                    errors.password.message === "Password is required"
                      ? "errors-text"
                      : "reset-pass-error-text"
                  }`}
                >
                  {errors.password.message}
                </small>
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
            <div className="pass-div reset-form-field">
              <input
                type={passwordType}
                placeholder="Password*"
                // className={`${styles.inputs} ${styles.passInput} ${styles.pass}`}
                name="password"
                onInput={handleInput}
                onFocus={() => {
                  setIsPasswordFocus(true);
                  setIsTooltipOpen(true);
                }}
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                  onBlur: () => {
                    setIsPasswordFocus(false);
                    if (!isPassIconHover) {
                      setIsTooltipOpen(false);
                    } else {
                    }
                  },
                })}
              />
              {errors?.password && (
                <small className="errors-text">{errors.password.message}</small>
              )}
              {!isPasswordShowing && (
                <FaEyeSlash
                  data-tooltip-id="password-tooltip"
                  size={18}
                  className="eye-icon pass-hidden"
                  onClick={() => {
                    setIsPasswordShowing(true);
                    setPasswordType("text");
                  }}
                  onMouseEnter={() => {
                    setIsPassIconHover(true);
                    setIsTooltipOpen(true);
                  }}
                  onMouseLeave={() => {
                    setIsPassIconHover(false);
                    if (!isPasswordFocus) {
                      setIsTooltipOpen(false);
                    }
                  }}
                />
              )}
              {isPasswordShowing && (
                <FaEye
                  size={18}
                  className="eye-icon"
                  style={{ color: "#204a36" }}
                  onClick={() => {
                    setIsPasswordShowing(false);
                    setPasswordType("password");
                  }}
                />
              )}
              <Tooltip
                id={"password-tooltip"}
                variant="info"
                content={
                  <div>
                    <p
                      style={{
                        color: "black",
                        fontSize: "10px",
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}
                    >
                      Your password needs to:
                    </p>
                    {!isUpperLowerCase && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "9px",
                          marginBottom: "4px",
                        }}
                      >
                        <RxCross2 style={{ marginBottom: "-2px" }} /> Include
                        both lower and upper case characters.
                      </p>
                    )}
                    {isUpperLowerCase && (
                      <p
                        style={{
                          color: "black",
                          fontSize: "9px",
                          marginBottom: "4px",
                        }}
                      >
                        <MdCheck
                          style={{ color: "green", marginBottom: "-2px" }}
                        />{" "}
                        Include both lower and upper case characters.
                      </p>
                    )}
                    {!isNumberOrSymbol && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "9px",
                          marginBottom: "4px",
                        }}
                      >
                        <RxCross2 style={{ marginBottom: "-2px" }} /> Include
                        atleast one number or symbol.
                      </p>
                    )}
                    {isNumberOrSymbol && (
                      <p
                        style={{
                          color: "black",
                          fontSize: "9px",
                          marginBottom: "4px",
                        }}
                      >
                        <MdCheck
                          style={{ color: "green", marginBottom: "-2px" }}
                        />{" "}
                        Include atleast one number or symbol.
                      </p>
                    )}
                    {!isEightCharacters && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "9px",
                          marginBottom: "4px",
                        }}
                      >
                        <RxCross2 style={{ marginBottom: "-2px" }} /> Be atleast
                        8 characters long
                      </p>
                    )}
                    {isEightCharacters && (
                      <p
                        style={{
                          color: "black",
                          fontSize: "9px",
                          marginBottom: "4px",
                        }}
                      >
                        <MdCheck
                          style={{ color: "green", marginBottom: "-2px" }}
                        />{" "}
                        Be atleast 8 characters long
                      </p>
                    )}
                  </div>
                }
                place={"top"}
                opacity={1}
                clickable={false}
                style={{
                  zIndex: "1",
                  backgroundColor: "#f2f2df",
                  borderRadius: "6px",
                }}
                isOpen={isToolTipOpen}
                // isOpen={true}
              />
            </div>
            <div className="cpass-div reset-form-field">
              <input
                type={cPasswordType}
                placeholder="Confirm Password*"
                name="cPassword"
                {...register("cPassword", {
                  required: {
                    value: true,
                    message: "Confirm Password is required",
                  },
                  validate: (value) =>
                    value === getValues("password") || "Password do not match",
                })}
              />
              {errors?.cPassword && (
                <small className="errors-text">
                  {errors.cPassword.message}
                </small>
              )}
              {cPasswordType === "password" ? (
                <FaEyeSlash
                  className="eye-icon pass-hidden"
                  onClick={() => setCPasswordType("text")}
                />
              ) : (
                <FaEye
                  className="eye-icon"
                  onClick={() => setCPasswordType("password")}
                />
              )}
            </div>
            <div className="reset-btn-div">
              <button
                disabled={isbuttonLoading ? true : false}
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
                  <p>reset Password</p>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
