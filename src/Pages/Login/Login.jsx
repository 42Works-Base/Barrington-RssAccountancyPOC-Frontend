import React, { useState } from "react";
import "./Login.css";
import "../../index.css";
// import logo from "../../assets/svg-image-1.svg";
import logo from "../../assets/Group 3.png";
import { FcGoogle } from "react-icons/fc";
import { ImFacebook2 } from "react-icons/im";
import { FaEyeSlash } from "react-icons/fa";
import { GrApple } from "react-icons/gr";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Design from "../../Components/Design/Design";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
// import loading from "../../assets/Rolling@1x-1.0s-200px-200px.gif";
import loading from "../../assets/Dual Ring@1x-1.0s-26px-26px.gif";
import { handleLogin } from "../../Services/Onboarding";
const Login = () => {
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState("password");
  const [isbuttonLoading, setIsButtonLoading] = useState(null);
  const [isChecked,setIsChecked]=useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ mode: "all" });

  const submitData = async (data) => {
    setIsButtonLoading(true);
    console.log(data);
    console.log(isChecked);
    try {
      const response=await handleLogin(data,isChecked)
      if (response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("tempToken", user.tempToken);
        // localStorage.setItem("firstName",user.firstName)
        // localStorage.setItem("lastName",user.lastName)
        localStorage.setItem("gender",user.gender)
        toast.dismiss();
        toast.success(response.data.message);
        if (!user.isVerifiedByEmail || !user.isVerifiedByPhone) {
          navigate("/verification");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Login API Error:", error);

      if (error.response) {
        toast.dismiss();
        toast.error(error.response.data.message || "Something went wrong.");
      } else if (error.request) {
        toast.dismiss();
        toast.error("No response from server. Please check your network.");
      } else {
        toast.dismiss();
        toast.error("Error: " + error.message);
      }
    } finally {
      setIsButtonLoading(false);
    }
  };

  axios.defaults.withCredentials = true;
  const handleGoogleLogin=()=>{
    window.open('http://localhost:5070/onboarding/oauth/google', '_self');
  }
  const handleFacebookLogin=()=>{
    window.open('http://localhost:5070/onboarding/oauth/facebook', '_self');
  }
  const handleAppleLogin=()=>{
    window.location.href='https://0d51-14-194-240-98.ngrok-free.app/onboarding/oauth/apple';
  }

  return (
    <div className="login-page-container">
      <div className="login-border-design-div">
        <Design />
      </div>
      <div className="login-container">
        <div className="login-div-container">
          <div className="logo-div">
            <img src={logo} alt="Company Logo" />
          </div>
          <div className="login-title">
            <h1>Sign In</h1>
          </div>
          <div className="login-desc">
            <p>Enter your details below to sign In and get started</p>
          </div>
          <form
            className="login-form-container"
            onSubmit={handleSubmit(submitData)}
            autoComplete="off"
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
                })}
              />
              {errors?.email && (
                <small className="errors-text">{errors.email.message}</small>
              )}
            </div>

            <div className="pass-div login-form-field">
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
            </div>
            <div className="remember-container">
              <div className="remember-div">
                <input type="checkbox" onClick={()=>setIsChecked(!isChecked)} />
                <span>Remember me</span>
              </div>
              <div
                className="login-forgot-pass-div"
                // onClick={() => navigate("/forgot-password")}
                
              >
                Forgot Password?
              </div>
            </div>
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
                  <span>Sign In</span>
                )}
              </button>
            </div>
          </form>
          <div className="login-info-div">
            Already have an account?{" "}
            <span className="signup-link" onClick={() => navigate("/")}>
              Sign Up
            </span>
          </div>
          {/* <div className="social-login-div">
            <p>or continue with</p>
            <div className="social-icons">
           <div className="google-icon" onClick={()=>handleGoogleLogin()}> <FcGoogle size={28} /></div>
           <div className="facebook-icon" onClick={()=>handleFacebookLogin()}><ImFacebook2 size={24} color="#3535e8" /></div>
           <div className="apple-icon" onClick={()=>handleAppleLogin()}><GrApple  size={26}/></div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
