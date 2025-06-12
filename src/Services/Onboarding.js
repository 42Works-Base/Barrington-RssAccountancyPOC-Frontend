import { toast } from "react-toastify";
import axios from "axios";
const VITE_API_URL = import.meta.env.VITE_API_URL;
console.log(VITE_API_URL)

export const handleLogin=async(data,isChecked)=>{
    console.log(data)
    try {
        const response=await axios.post(`${VITE_API_URL}/onboarding/auth/login`,{
            loginID: data.email,
            password: data.password,
            rememberMe:isChecked
          }, {
            withCredentials: true
          })
          if(response.data.success){
              return response
          }
    } catch (error) {
          console.error("Login API Error:", error);
          throw error;
        } 
   
}


export const handleForgotPassword=async(data)=>{
    console.log(data)
    try {
        const response=await axios.post(`${VITE_API_URL}/onboarding/auth/forgotPassword`,{
            loginID: data.email,
          })
          if(response.data.success){
              return response
          }
    } catch (error) {
          console.error("Login API Error:", error);
          throw error;
        } 
   
}


export const handleVerifyOtp=async(Otp)=>{
    const otpToken = localStorage.getItem("otpToken");
    if (!otpToken) {
      toast.dismiss();
      toast.error("Token not found");
      return;
    }
    try {
        const response=await axios.post(`${VITE_API_URL}/onboarding/auth/verifyOTP`,{
            otpToken: otpToken,
            otp: Otp,
          })
          if(response.data.success){
              return response
          }
    } catch (error) {
          console.error("Login API Error:", error);
          throw error;
        } 
   
}

export const handleResendOtp=async()=>{
    const otpToken = localStorage.getItem("otpToken");
    if (!otpToken) {
      console.error("Token not found");
      toast.dismiss();
      toast.error("Token not found");
      return;
    }
    try {
        const response=await axios.post(`${VITE_API_URL}/onboarding/auth/resendOTP`,{
            otpToken: otpToken,
          })
          if(response.data.success){
              return response
          }
    } catch (error) {
          console.error("Login API Error:", error);
          throw error;
        } 
   
}

export const handleResetPassword=async(data)=>{
    const resetToken = localStorage.getItem("resetToken");
    if (!resetToken) {
      toast.dismiss();
      toast.error(
        "Token not found. Please try the forgot password process again."
      );
      return;
    }
    try {
        const response=await axios.post(`${VITE_API_URL}/onboarding/auth/resetPassword`,{
            resetToken: resetToken,
          newPassword: data.password,
          confirmPassword: data.cPassword,
          })
          if(response.data.success){
              return response
          }
    } catch (error) {
          console.error("Login API Error:", error);
          throw error;
        } 
   
}

export const handleVerifyEmailOtp=async(Otp)=>{
    const tempToken = localStorage.getItem("tempToken");
    if (!tempToken) {
      toast.dismiss();
      toast.error("Token not found");
      return;
    }
    try {
        const response=await axios.post(`${VITE_API_URL}/onboarding/auth/verifyEmail`,{
            tempToken: tempToken,
          verifyCode: Otp,
          })
          if(response.data.success){
              return response
          }
    } catch (error) {
          console.error("Login API Error:", error);
          throw error;
        } 
   
}

export const handleVerifyPhone=async(Otp)=>{
    const tempToken = localStorage.getItem("tempToken");
    if (!tempToken) {
      toast.dismiss();
      toast.error("Token not found");
      return;
    }
    try {
        const response=await axios.post(`${VITE_API_URL}/onboarding/auth/verifyPhone`,{
            tempToken: tempToken,
          verifyCodeSMS: Otp,
          })
          if(response.data.success){
              return response
          }
    } catch (error) {
          console.error("Login API Error:", error);
          throw error;
        } 
   
}
export const handleEmailResendOtp=async()=>{
    const tempToken = localStorage.getItem("tempToken");
    if (!tempToken) {
      toast.dismiss();
      toast.error("Token not found");
      return;
    }
    try {
        const response=await axios.post(`${VITE_API_URL}/onboarding/auth/resendEmailCode`,{
            tempToken: tempToken,
          })
          if(response.data.success){
              return response
          }
    } catch (error) {
          console.error("Login API Error:", error);
          throw error;
        } 
   
}

export const handleSMSResendOtp=async()=>{
    const tempToken = localStorage.getItem("tempToken");
    if (!tempToken) {
      toast.dismiss();
      toast.error("Token not found");
      return;
    }
    try {
        const response=await axios.post(`${VITE_API_URL}/onboarding/auth/resendSMSCode`,{
            tempToken: tempToken,
          })
          if(response.data.success){
              return response
          }
    } catch (error) {
          console.error("Login API Error:", error);
          throw error;
        } 
   
}



// export const getBankStatements = async (from, to) => {
//   let url = `${VITE_API_URL}/api/bank-statements`;
//   if (from && to) {
//     const fromStr = from.toISOString();
//     const toStr = to.toISOString();
//     url += `?from=${fromStr}&to=${toStr}`;
//   }
//   try {
//     const response = await axios.get(url);
//     return response.data;
//     // if(response.data.success){
//     //     return response
//     // }
//   } catch (error) {
//     console.error("Error:", error);
//     throw error;
//   }
// };

export const getBankStatements = async (from, to) => {
  const access_token = localStorage.getItem('access_token'); // Get the access token from localStorage

  if (!access_token) {
    throw new Error('Access token is missing.');
  }

  const url = `${VITE_API_URL}/api/bank-statements`;

  // Prepare the request body
  const requestBody = {
    access_token,   // Access token from localStorage
    from: from ? from.toISOString() : undefined, // Convert `from` to ISO string if it exists
    to: to ? to.toISOString() : undefined        // Convert `to` to ISO string if it exists
  };

  try {
    const response = await axios.post(url, requestBody);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};


export const getBankStatementsCategory = async (from, to) => {
  const access_token = localStorage.getItem('access_token'); // Get the access token from localStorage

  if (!access_token) {
    throw new Error('Access token is missing.');
  }

  const url = `${VITE_API_URL}/api/bank-statements-categorize`;

  // Prepare the request body
  const requestBody = {
    access_token,   // Access token from localStorage
    from: from ? from.toISOString() : undefined, // Convert `from` to ISO string if it exists
    to: to ? to.toISOString() : undefined        // Convert `to` to ISO string if it exists
  };

  try {
    const response = await axios.post(url, requestBody);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};


export const getTransactionById = async (data) => {
  try {
    const response = await axios.post(
      `${VITE_API_URL}/api/get-bank-statement`, data
    );
    if (response.data.success) {
      return response;
    }
  } catch (error) {
    console.error("Login API Error:", error);
    throw error;
  }
};

export const getTransactionByIds = async (data) => {
  try {
    const response = await axios.post(
      `${VITE_API_URL}/api/get-bank-statements`, data
    );
    if (response.data.success) {
      return response;
    }
  } catch (error) {
    console.error("Login API Error:", error);
    throw error;
  }
};

export const updateTransaction = async (data) => {
  try {
    const response = await axios.post(
      `${VITE_API_URL}/api/update-transaction`, data
    );
    if (response.data.success) {
      return response;
    }
  } catch (error) {
    console.error("Login API Error:", error);
    throw error;
  }
};