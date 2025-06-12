import { useState } from "react";
import { motion } from "framer-motion";
import "./ImageSlider.css";
import city1 from "../../assets/SpaceCity1.jpg";
import city2 from "../../assets/SpaceCity2.jpeg";
import city3 from "../../assets/SpaceCity3.jpeg";
import planet1 from "../../assets/planet1.png";
import planet2 from "../../assets/planet2.png";
import "./ImageSlider.css"; // Import custom styles

// const ImageSlider = () => {
//   const [positionIndexes, setPositionIndexes] = useState([0, 1, 2, 3, 4]);

//   const handleNext = () => {
//     setPositionIndexes((prevIndexes) => {
//       const updatedIndexes = prevIndexes.map(
//         (prevIndex) => (prevIndex + 1) % 5
//       );
//       return updatedIndexes;
//     });
//   };

//   const handleBack = () => {
//     setPositionIndexes((prevIndexes) => {
//       const updatedIndexes = prevIndexes.map(
//         (prevIndex) => (prevIndex + 4) % 5
//       );

//       return updatedIndexes;
//     });
//   };

//   const images = [city1, city2, city3, planet1, planet2];

//   const positions = ["center", "left1", "left", "right", "right1"];

//   const imageVariants = {
//     center: { x: "0%", scale: 1, zIndex: 5 },
//     left1: { x: "-50%", scale: 0.7, zIndex: 3 },
//     left: { x: "-90%", scale: 0.5, zIndex: 2 },
//     right: { x: "90%", scale: 0.5, zIndex: 1 },
//     right1: { x: "50%", scale: 0.7, zIndex: 3 },
//   };

//   return (
//     <div className="slider-container">
//       {images.map((image, index) => (
//         <motion.img
//           key={index}
//           src={image}
//           alt={`slide-${index}`}
//           className="slider-image"
//           initial="center"
//           animate={positions[positionIndexes[index]]}
//           variants={imageVariants}
//           transition={{ duration: 0.5 }}
//         />
//       ))}
//       <div className="slider-buttons">
//         <button className="slider-button" onClick={handleBack}>
//           Back
//         </button>
//         <button className="slider-button" onClick={handleNext}>
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ImageSlider;

// const ImageSlider = () => {
//     const [positionIndexes, setPositionIndexes] = useState([0, 1, 2, 3, 4]);

//     const handleClick = (e) => {
//       const screenWidth = window.innerWidth;
//       const clickX = e.clientX;

//       if (clickX < screenWidth / 4) {
//         handleBack();
//       } else {
//         handleNext();
//       }
//     };

//     const handleNext = () => {
//       setPositionIndexes((prevIndexes) =>
//         prevIndexes.map((prevIndex) => (prevIndex + 1) % 5)
//       );
//     };

//     const handleBack = () => {
//       setPositionIndexes((prevIndexes) =>
//         prevIndexes.map((prevIndex) => (prevIndex + 4) % 5)
//       );
//     };

//     const images = [city1, city2, city3, planet1, planet2];
//     const positions = ["center", "left1", "left", "right", "right1"];

//     const imageVariants = {
//       center: { x: "0%", scale: 1, zIndex: 5 },
//       left1: { x: "-35%", scale: 0.7, zIndex: 3 },
//       left: { x: "-60%", scale: 0.5, zIndex: 2 },
//       right: { x: "60%", scale: 0.5, zIndex: 1 },
//       right1: { x: "35%", scale: 0.7, zIndex: 3 },
//     };

//     return (
//       <div className="slider-container" onClick={handleClick}>
//         {images.map((image, index) => (
//           <motion.img
//             key={index}
//             src={image}
//             alt={`slide-${index}`}
//             className="slider-image"
//             initial="center"
//             animate={positions[positionIndexes[index]]}
//             variants={imageVariants}
//             transition={{ duration: 0.5 }}
//           />
//         ))}
//       </div>
//     );
//   };

const ImageSlider = () => {
  return (
    <div className="gallery-container">
      <div className="gallery">
        <img src="https://picsum.photos/id/582/400/400" alt="a wolf" />
        <img src="https://picsum.photos/id/1074/400/400" alt="a lioness" />
      </div>
    </div>
  );
};
export default ImageSlider;
