import React from "react";
import "./Design.css";
import "../../index.css";
// const Design = () => {
//   return (
//     <div className="design-div">
//       {/* <h1 className="animated-heading">Welcome to 42Works – Your answer to everything digital!</h1>
//        */}
//       {/* <h2>
//         42 Works
//         <span>42 Works</span>
//         <span>42 Works</span>
//         <span>your answer to everything digital</span>
//       </h2> */}
//       <div id="text-animation-container">
//         Digital solutions for
//         <div id="flip">
//           <div>
//           <div>YOU!</div>
//           </div>
//           <div>
//             <div>Enterprises</div>
//           </div>
//           <div>
            
//             <div>Startups</div>
//           </div>
//         </div>
//       </div>
//       <p>
//         At 42Works, we believe in innovation, creativity, and building digital
//         solutions that make an impact. Join us in shaping the future with
//         technology-driven excellence. Your journey starts here!
//       </p>
//     </div>
//   );
// };
import  { useEffect, useState } from 'react';

// const Design = () => {
//   const fullText = `At 42Works, we believe in innovation, creativity, and building digital
// solutions that make an impact. Join us in shaping the future with
// technology-driven excellence. Your journey starts here!`;

//   const [typedText, setTypedText] = useState('');

//   useEffect(() => {
//     let index = 0;

//     const interval = setInterval(() => {
//       setTypedText(prev => prev + fullText.charAt(index));
//       index++;

//       if (index >= fullText.length) {
//         clearInterval(interval);
//       }
//     }, 30); // adjust speed here (25ms per character)

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="design-div">
//       <div id="text-animation-container">
//         Digital solutions for
//         <div id="flip">
//           <div>
//             <div>YOU!</div>
//           </div>
//           <div>
//             <div>Enterprises</div>
//           </div>
//           <div>
//             <div>Startups</div>
//           </div>
//         </div>
//       </div>
//       <p>{typedText}</p>
//     </div>
//   );
// };



const Design = () => {
//   const fullText = `At 42Works, we believe in innovation, creativity, and building digital
// solutions that make an impact. Join us in shaping the future with
// technology-driven excellence. Your journey starts here!`;
  const fullText = `At RSS Accountancy, we specialize in offering smart, compliant, and cost-effective financial solutions. As a contractor, freelancer, or small business owner, our experienced team puts your accounts in competent hands so you can concentrate on what matters most.
`;

  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setTypedText(prev => prev + fullText.charAt(index));
      index++;

      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false); // Typing done
      }
    }, 30); // Adjust speed here

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="design-div">
      <div className="text-animation-container">
        {/* Digital solutions for */}
        Simplifying Accounting for Modern Professionals
        <div className="flip">
          {/* <div style={{padding:'4px'}}><div>YOU!</div></div>
          <div><div>Enterprises</div></div>
          <div><div className="startup">Startups</div></div> */}
          <div style={{padding:'0px'}}><div>SME Accountants</div></div>
          <div><div>Contractor Accounting</div></div>
          <div><div className="startup">CIS Accounting</div></div>
        </div>
      </div>

      <p className={isTyping ? 'blinking-cursor' : ''}>{typedText}</p>
    </div>
  );
};

export default Design;



