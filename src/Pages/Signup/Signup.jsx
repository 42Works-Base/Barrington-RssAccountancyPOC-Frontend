import React, { useEffect, useState } from "react";
import "./Signup.css";
import "../../index.css";
// import logo from "../../assets/svg-image-1.svg";
import logo from "../../assets/Group 3.png";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
  GetState,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaCalendar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import Design from "../../Components/Design/Design";
import "react-phone-number-input/style.css";
import PhoneInput, {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
import axios from "axios";
import { toast } from "react-toastify";
// import loading from "../../assets/Rolling@1x-1.0s-200px-200px.gif";
import loading from "../../assets/Dual Ring@1x-1.0s-26px-26px.gif";
import { Tooltip } from "react-tooltip";
import { RxCross2 } from "react-icons/rx";
import { MdCheck } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { ImFacebook2 } from "react-icons/im";
import { GrApple } from "react-icons/gr";
import ImageSlider from "../../Components/ImageSlider/ImageSlider";

import { GetCountries } from "react-country-state-city";
const VITE_API_URL = import.meta.env.VITE_API_URL;
const Signup = () => {
  const [country, setCountry] = useState(null);
  const [countriesList, setCountriesList] = useState([]);
  const [countryName,setCountryName]=useState(null)
  const [stateList, setStateList] = useState([]);
  const [currentState, setCurrentState] = useState(null);
  const [currentStateName,setCurrentStateName]=useState(null)
  const [currentCity, setCurrentCity] = useState(null);
  const [startDate, setStartDate] = useState();
  const [isPasswordShowing, setIsPasswordShowing] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [cPasswordType, setCPasswordType] = useState("password");
  const [value, setValue] = useState();
  const [middleName, setMiddleName] = useState("");
  const [address2, setAddress2] = useState("");
  const [gender, setGender] = useState("");
  const [isbuttonLoading, setIsButtonLoading] = useState(null);
  const [isUpperLowerCase, setIsUpperLowercase] = useState(false);
  const [isNumberOrSymbol, setIsNumberOrSymbol] = useState(false);
  const [isEightCharacters, setIsEightCharacters] = useState(false);
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const [isPassIconHover, setIsPassIconHover] = useState(false);
  const [isToolTipOpen, setIsTooltipOpen] = useState(false);

  const navigate = useNavigate();
  const {
    register,
    control,
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

  axios.defaults.withCredentials = true;

  const handleGoogleLogin = () => {
    window.open("http://localhost:5070/onboarding/oauth/google", "_self");
  };
  const handleFacebookLogin = () => {
    window.open("http://localhost:5070/onboarding/oauth/facebook", "_self");
  };
  const handleAppleLogin = () => {
    window.location.href =
      "https://0d51-14-194-240-98.ngrok-free.app/onboarding/oauth/apple";
  };

  // const handleAppleLogin = () => {
  //   const authWindow = window.open(
  //     'https://9b5b-2401-4900-1c6a-46cb-547c-eff2-88cb-ab96.ngrok-free.app/onboarding/oauth/apple',
  //     '_blank',
  //     'width=500,height=600'
  //   );

  //   window.addEventListener('message', function receiveMessage(event) {
  //     if (event.origin !== 'https://9b5b-2401-4900-1c6a-46cb-547c-eff2-88cb-ab96.ngrok-free.app') return;

  //     if (event.data === 'auth-success') {
  //       // 🔁 Now call your /me endpoint or similar to get logged-in user
  //       window.location.href = '/dashboard';
  //     }
  //   });
  // };

  const submitData = async (data) => {
    console.log("data", data);
    console.log("gender", gender);
    // localStorage.setItem("gender", gender);
    console.log("middleName", middleName);
    console.log("address2", address2);
    console.log("country", country);
    console.log("currentState", currentState);
    setIsButtonLoading(true);
    try {
      const response = await axios.post(
        `${VITE_API_URL}/onboarding/auth/register`,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          gender: gender,
          phoneNumber: data.phoneNumber,
          email: data.email,
          addressLine1: data.address1,
          addressLine2: address2,
          country: countryName,
          state: currentStateName,
          city: data.city,
          zipCode: data.zipcode,
          password: data.password,
        }
      );
      console.log(response);
      console.log(response.data);
      console.log(response.data.success);
      if (response.data.success) {
        console.log(response.data.message || "Registered successfully!");
        toast.dismiss();
        toast.success(response.data.message || "Registered successfully!");
        localStorage.setItem("tempToken", response.data.data.tempToken);
        navigate("/verification");
      }
    } catch (error) {
      console.error("Registration failed:", error);

      if (error.response) {
        // API responded with a status other than 2xx
        toast.dismiss();
        toast.error(error.response.data.message || "Registration error");
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
      setIsButtonLoading(false);
    }
  };

  function onCountryChange(e) {
  const countryId = e.target.value;
  setCountry(countryId);

  // get the displayed text of the selected <option>
  const countryName = e.target.options[e.target.selectedIndex].text;
  console.log("selected country name", countryName);
  setCountryName(countryName);
}
console.log("countryyy",country)
console.log("countryyy Name",countryName)

function onStateChange(e) {
  const stateId = e.target.value;
  setCurrentState(stateId);

  // grab the displayed text of the selected <option>
  const stateName = e.target.options[e.target.selectedIndex].text;
  console.log("selected state name", stateName);
  setCurrentStateName(stateName);
}
console.log("stateee",currentState)
console.log("Stateee Name",currentStateName)
  useEffect(() => {
    GetCountries().then((_countries) => {
      setCountriesList(_countries);
      console.log("_countries", _countries);
    });
  }, []);
  useEffect(() => {
    if (country)
      GetState(parseInt(country)).then((result) => {
        setStateList(result);
      });
  }, [country]);

  console.log("countriesList", countriesList);

  return (
    <div className="signup-page-container">
      <div className="border-design-div">
        <Design />
        {/* <ImageSlider/> */}
      </div>
      <div className="signup-container">
        <div className="signup-div-container">
          <div className="logo-div">
            <img src={logo} alt="Company Logo" />
          </div>
          <div className="signup-title">
            <h1>Sign up</h1>
          </div>
          <div className="signup-desc">
            <p>Enter your details below to sign up and get started</p>
          </div>
          <form
            autoComplete="off"
            className="signup-form-container"
            onSubmit={handleSubmit(submitData)}
          >
            <div className="name-div">
              <div className="firstName-div name-field">
                <input
                  type="text"
                  placeholder="First Name*"
                  name="firstName"
                  maxLength={30}
                  onInput={(e) => {
                    const value = e.target.value;
                    e.target.value = value.replace(/[^a-zA-Z0-9\-'\s]/g, "");
                  }}
                  {...register("firstName", {
                    required: {
                      value: true,
                      message: "First Name is required",
                    },
                  })}
                />
                {errors?.firstName && (
                  <small className="errors-text">
                    {errors.firstName.message}
                  </small>
                )}
              </div>
              {/* <div className="middleName-div name-field">
                <input
                  type="text"
                  placeholder="Middle Name"
                  name="middleName"
                  maxLength={30}
                  onInput={(e) => {
                    const value = e.target.value;
                    e.target.value = value.replace(/[^a-zA-Z0-9\-'\s]/g, "");
                  }}
                  value={middleName}
                  onChange={(e)=>setMiddleName(e.target.value)}
                />
              </div> */}
              <div className="lastName-div name-field">
                <input
                  type="text"
                  placeholder="Last Name*"
                  name="lastName"
                  maxLength={30}
                  onInput={(e) => {
                    const value = e.target.value;
                    e.target.value = value.replace(/[^a-zA-Z0-9\-'\s]/g, "");
                  }}
                  {...register("lastName", {
                    required: {
                      value: true,
                      message: "Last Name is required",
                    },
                  })}
                />
                {errors?.lastName && (
                  <small className="errors-text">
                    {errors.lastName.message}
                  </small>
                )}
              </div>
              <div className="gender-div name-field">
                <select
                  name="gender"
                  id="gender"
                  onChange={(e) => setGender(e.target.value)}
                  defaultValue=""
                  className={`custom-select ${
                    gender === "" ? "placeholder" : "selected"
                  }`}
                >
                  <option value="" disabled>
                    Gender*
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </div>
            </div>
            <div className="contact-email-div">
              <div className="contact-div ">
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Phone number is required",
                    validate: (value) =>
                      isPossiblePhoneNumber(value || "") ||
                      "Please enter a valid phone number",
                    // validate: (value) =>
                    //   isValidPhoneNumber(value || "") ||
                    //   "Enter a valid phone number",
                  }}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      autoComplete="off"
                      // international
                      international={false}
                      initialValueFormat="national"
                      defaultCountry="US"
                      countryCallingCodeEditable={false}
                      placeholder="Phone Number*"
                      // className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                  )}
                />
                {errors?.phoneNumber && (
                  <small className="errors-text">
                    {errors.phoneNumber.message}
                  </small>
                )}
                {/* <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="US"
                  placeholder="Enter phone number"
                  value={value}
                  onChange={setValue}
                /> */}
                {/* <input
                  type="text"
                  placeholder="Phone Number*"
                  name="phone-number"
                  {...register("contact", {
                    required: {
                      value: true,
                      message: "Contact Number is required",
                    },
                  })}
                />
                {errors?.contact && (
                  <small className="errors-text">
                    {errors.contact.message}
                  </small>
                )} */}
              </div>
              <div className="email-div form-field">
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
                  })}
                />
                {errors?.email && (
                  <small className="errors-text">{errors.email.message}</small>
                )}
              </div>
            </div>
            <div className="address-div">
              <div className="add1-div form-field">
                <input
                  type="text"
                  placeholder="Address Line 1*"
                  name="address-1"
                  maxLength={200}
                  {...register("address1", {
                    required: {
                      value: true,
                      message: "Address is required",
                    },
                  })}
                />
                {errors?.address1 && (
                  <small className="errors-text">
                    {errors.address1.message}
                  </small>
                )}
              </div>
              <div className="add2-div form-field">
                <input
                  type="text"
                  placeholder="Address Line 2"
                  name="addressLine2"
                  maxLength={200}
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </div>
            </div>
            <div className="country-state-div">
              <div className="country-div ">
                {/* <Controller
                  name="country"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Please select a country" }}
                  render={({ field }) => (
                    <CountrySelect
                      containerClassName="form-group"
                      inputClassName="country-input"
                      // onChange={field.onChange}
                      onChange={(_country) => setCountry(_country)}
                      onTextChange={(_txt) => console.log(_txt)}
                      placeHolder="Select Country*"
                      showFlag={false}
                    />
                  )}
                />
                {errors?.country && (
                  <small className="errors-text">
                    {errors.country.message}
                  </small>
                )} */}
                <select
                  onChange={(e) => onCountryChange(e)}
                  value={country}
                >
                  <option value={""}>-- Select Country --</option>
                  {countriesList.map((_country) => (
                    <option key={_country.id} value={_country.id}>
                      {_country.name}
                    </option>
                  ))}
                </select>
                {/* <CountrySelect
                  containerClassName="form-group"
                  inputClassName="country-input"
                  onChange={(_country) => {
                    console.log("testa", _country);
                    setCountry(_country);
                  }}
                  onTextChange={(_txt) => {
                    console.log("_resfaefasd", _txt);
                    setCountry(_txt.target.value);
                  }}
                  placeHolder="Select Country*"
                  showFlag={false}
                /> */}
              </div>
              <div className="state-div ">
                {/* <Controller
                  name="state"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please select a state",
                  }}
                  render={({ field }) => (
                    <StateSelect
                      countryid={country?.id}
                      containerClassName="form-group"
                      inputClassName="state-input"
                      // onChange={field.onChange}
                      onChange={(_state) => setCurrentState(_state)}
                      onTextChange={(_txt) => console.log(_txt)}
                      defaultValue={field.value}
                      placeHolder="Select State*"
                    />
                  )}
                />
                {errors?.country && (
                  <small className="errors-text">
                    {errors.country.message}
                  </small>
                )} */}
                {/* <StateSelect
                  countryid={country?.id}
                  containerClassName="form-group"
                  inputClassName="state-input"
                  onChange={(_state) => setCurrentState(_state)}
                  onTextChange={(_txt) => console.log(_txt)}
                  defaultValue={currentState}
                  placeHolder="Select State*"
                /> */}
                <select
                  onChange={(e) => onStateChange(e)}
                  value={currentState}
                >
                  <option value={""}>-- Select State --</option>
                  {stateList.map((_state) => (
                    <option key={_state.id} value={_state.id}>
                      {_state.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="city-zipcode-div">
              <div className="city-div">
                <input
                  type="text"
                  placeholder="City*"
                  name="city"
                  maxLength={100}
                  {...register("city", {
                    required: {
                      value: true,
                      message: "City is required",
                    },
                  })}
                />
                {errors?.city && (
                  <small className="errors-text">{errors.city.message}</small>
                )}
              </div>
              <div className="pincode-div ">
                <input
                  type="text"
                  placeholder="Zipcode*"
                  name="zipcode"
                  maxLength={18}
                  {...register("zipcode", {
                    required: {
                      value: true,
                      message: "ZipCode is required",
                    },
                  })}
                />
                {errors?.zipcode && (
                  <small className="errors-text">
                    {errors.zipcode.message}
                  </small>
                )}
              </div>
            </div>
            {/* <div className="dob-gender-div">
            <div className="dob-div form-field">
 
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} placeholderText="Date Of Birth" />
              <FaCalendar className="calendar-icon " color="#a4a4a4"/>
            </div>
            <div className="gender-div form-field">
 
              <select
                name="gender"
                id="gender"
 
                defaultValue=""
              >
                <option value="" disabled>
                  Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>
          </div> */}
            <div className="pass-cpass-div">
              {/* <div className="pass-div form-field">
                <input
                  type={passwordType}
                  placeholder="Password*"
                  name="password"
                  maxLength={20}
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
                        : "pass-error-text"
                    }`}
                  >
                    {errors.password.message}
                  </small>
                )}
                {passwordType === "password" ? (
                  <FaEyeSlash
                  data-tooltip-id="password-tooltip"
                    className="eye-icon pass-hidden"
                    onClick={() => setPasswordType("text")}
                  />
                ) : (
                  <FaEye
                    className="eye-icon"
                    onClick={() => setPasswordType("password")}
                  />
                )}
                  <Tooltip
                  id={"password-tooltip"}
                  variant="info"
                  content={
                    <div>
                      <p style={{ color: "black", fontSize: "12px" }}>
                        Your password needs to:
                      </p>
                      {!isUpperLowerCase && (
                        <p style={{ color: "red", fontSize: "12px" }}>
                          <RxCross2 /> Include both lower and upper case
                          characters.
                        </p>
                      )}
                      {isUpperLowerCase && (
                        <p style={{ color: "black", fontSize: "12px" }}>
                          <MdCheck style={{ color: "green" }} /> Include both
                          lower and upper case characters.
                        </p>
                      )}
                      {!isNumberOrSymbol && (
                        <p style={{ color: "red", fontSize: "12px" }}>
                          <RxCross2 /> Include atleast one number or symbol.
                        </p>
                      )}
                      {isNumberOrSymbol && (
                        <p style={{ color: "black", fontSize: "12px" }}>
                          <MdCheck style={{ color: "green" }} /> Include atleast one number or symbol.
                        </p>
                      )}
                      {!isEightCharacters && (
                        <p style={{ color: "red", fontSize: "12px" }}>
                          <RxCross2 /> Be atleast 8 characters long
                        </p>
                      )}
                      {isEightCharacters && (
                        <p style={{ color: "black", fontSize: "12px" }}>
                          <MdCheck style={{ color: "green" }}/> Be atleast 8 characters long
                        </p>
                      )}
                    </div>
                  }
                  place={"right"}
                  opacity={1}
                  clickable={false}
                  style={{ zIndex: "1", backgroundColor: "rgb(211, 215, 218)" }}
                  isOpen={isToolTipOpen}
                />
              </div> */}
              <div className="pass-div form-field">
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
                  <small className="errors-text">
                    {errors.password.message}
                  </small>
                )}
                {!isPasswordShowing && (
                  <FaEyeSlash
                    data-tooltip-id="password-tooltip"
                    size={16}
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
                    size={16}
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
                          <RxCross2 style={{ marginBottom: "-2px" }} /> Be
                          atleast 8 characters long
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
                />
              </div>
              <div className="cpass-div form-field">
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
                      value === getValues("password") ||
                      "Password do not match",
                  })}
                />
                {errors?.cPassword && (
                  <small className="errors-text">
                    {errors.cPassword.message}
                  </small>
                )}
                {cPasswordType === "password" ? (
                  <FaEyeSlash
                    size={16}
                    className="eye-icon pass-hidden"
                    onClick={() => setCPasswordType("text")}
                  />
                ) : (
                  <FaEye
                    size={16}
                    className="eye-icon"
                    onClick={() => setCPasswordType("password")}
                  />
                )}
              </div>
            </div>

            <div className="signup-btn-div">
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
                  <span>Sign up </span>
                )}
              </button>
            </div>
          </form>
          <div className="signup-info-div">
            Already have an account?{" "}
            <span className="login-link" onClick={() => navigate("/login")}>
              Sign In
            </span>
          </div>
          {/* <div className="social-login-div">
            <p>or continue with</p>
            <div className="social-icons">
              <div className="google-icon" onClick={() => handleGoogleLogin()}>
                {" "}
                <FcGoogle size={28} />
              </div>
              <div
                className="facebook-icon"
                onClick={() => handleFacebookLogin()}
              >
                <ImFacebook2 size={24} color="#3535e8" />
              </div>
              <div className="apple-icon" onClick={() => handleAppleLogin()}>
                <GrApple size={26} />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Signup;