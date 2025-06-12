import React, { useEffect, useRef } from 'react'
import './Popup.css'
import "../../App.css";
import "../../index.css";
import loader from '../../assets/Dual Ball@1x-1.0s-200px-200px.svg'
const Popup = ({children,isPopupOpen,setIsPopupOpen}) => {
    const popupRef=useRef()
    useEffect(()=>{
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
              setIsPopupOpen(false);
            }
          }
      
          if (isPopupOpen) {
            document.addEventListener("mousedown", handleClickOutside);
          }
      
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
    },[isPopupOpen])
  return (
    <div className='popup-container' >
        <div className="popup-div" ref={popupRef}>
            <div className='loading-div'>
            {/* <img src={loader} alt="loading..." /> */}
            </div>
           {children}
        </div>
    </div>
  )
}

export default Popup