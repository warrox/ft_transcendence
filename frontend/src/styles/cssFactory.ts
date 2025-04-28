// REGISTER PAGE CSS
export const inputCss: string = "@apply w-[250px] text-base border shadow-[1px_1px_3px_rgba(0,0,0,0.1)] p-2.5 rounded-[5px] border-solid border-[#ccc]";

// NAVBAR CSS
export const linkCss: string = "font-orbitron text-white transition duration-300 ease-in-out self-center text-2xl font-semibold whitespace-nowrap dark:text-white hover:text-yellow-500 relative inline-block after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-yellow-500 after:bottom-0 after:left-0 after:transform after:scale-x-0 after:origin-right after:transition-all after:duration-400 hover:after:scale-x-100";

// LOGIN PAGE CSS
export const WrapperCss = "shadow-lg flex items-center justify-center min-h-screen bg-gray-100";
export const loginCardCss = "rounded-xl border-white/30 bg-white/10 border backdrop-blur-md space-y-6 bg-white p-8 rounded-2xl shadow-xl w-full max-w-md";
export const headerCss = "text-center";
export const headerTextCss = "text-2xl font-bold text-gray-800";
export const inputWrapperCss = "flex flex-col space-y-4 self-start ml-16";
export const statusWrapperCss = "text-center text-sm";
export const statusOkCss = "text-green-500";
export const statusKoCss = "text-red-500";

export const fancyButtonCss = "group p-5 cursor-pointer relative text-xl font-normal border-0 flex items-center justify-center bg-transparent text-[rgba(239,177,0,1)] h-auto w-[170px] overflow-hidden transition-all duration-100 ml-26";

export const fancyLeftBorderCss = "group-hover:w-full absolute left-0 h-full w-5 border-y border-l border-[rgba(239,177,0,1)] transition-all duration-500";
export const disappearingTextCss = "font-orbitron group-hover:opacity-0 group-hover:translate-x-[-100%] absolute translate-x-0 transition-all duration-200";
export const appearingTextCss = "font-orbitron group-hover:translate-x-0 group-hover:opacity-100 absolute translate-x-full opacity-0 transition-all duration-200";
export const fancyRightBorderCss = "group-hover:w-full absolute right-0 h-full w-5 border-y border-r border-[rgba(239,177,0,1)] transition-all duration-500";
export const inputScaleCss: string = "transform transition duration-200 ease-in-out hover:scale-105 w-[250px] text-base border shadow-[1px_1px_3px_rgba(0,0,0,0.1)] p-2.5 rounded-[5px] border-solid border-[#ccc] relative z-[10]";
export const backgroundCss: string =  "bg-[radial-gradient(circle_at_center,_#1a1a1a,_#0d0d0d_70%,_#000000)]";

// BACKGROUND ANIMATION AREA
export const areaCss = "w-full h-screen relative overflow-hidden";
export const circlesCss = "absolute top-0 left-0 w-full h-full overflow-hidden z-0";
export const circleBaseCss = "absolute block list-none bg-[rgba(232,177,12,0.88)] rounded-full animate-[moveHorizontal_10s_linear_infinite]";

// Circles with size, position and animation delay
export const circle1Css = `${circleBaseCss} w-[20px] h-[20px] top-[20%] left-[-80px] [animation-delay:0s]`;
export const circle2Css = `${circleBaseCss} w-[20px] h-[20px] top-[30%] left-[-20px] [animation-delay:2s]`;
export const circle3Css = `${circleBaseCss} w-[20px] h-[20px] top-[50%] left-[-20px] [animation-delay:4s]`;
export const circle4Css = `${circleBaseCss} w-[10px] h-[10px] top-[80%] left-[-60px] [animation-delay:0s]`;
export const circle5Css = `${circleBaseCss} w-[20px] h-[20px] top-[25%] left-[-20px] [animation-delay:0s]`;
export const circle6Css = `${circleBaseCss} w-[11px] h-[11px] top-[40%] left-[-110px] [animation-delay:3s]`;
export const circle7Css = `${circleBaseCss} w-[15px] h-[15px] top-[10%] left-[-150px] [animation-delay:7s]`;
export const circle8Css = `${circleBaseCss} w-[20px] h-[20px] top-[60%] left-[-25px] [animation-delay:15s]`;
export const circle9Css = `${circleBaseCss} w-[15px] h-[15px] top-[70%] left-[-15px] [animation-delay:2s]`;
export const circle10Css = `${circleBaseCss} w-[15px] h-[15px] top-[90%] left-[-150px] [animation-delay:0s]`;

// NEON STYLE CSS
export const neonTextCss = "font-orbitron text-2xl text-white animate-[glow_1.5s_alternate_infinite]";

// HOME PAGE CSS
export const cardsContainerCss = `absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-evenly gap-12 w-full max-w-7xl px-10 z-10`;
export const cardNeonHoverCss = ` relative rounded-2xl bg-white p-6 w-[260px] h-[460px] flex flex-col items-center justify-center text-center font-medium text-gray-800 transition duration-300 hover:scale-105 hover:shadow-[0_0_25px_#ffe600] hover:border-[2px] hover:border-yellow-400 hover:bg-white/90 z-10`;
// Parent gère le hover
export const cardFlipCss = `
  w-[920px] h-[520px] perspective-[400px] will-change-transform
  group
`;

// Inner ne gère que la transition et la rotation SANS hover directement
export const cardInnerCss = `
  relative w-full h-full transition-transform duration-400 transform-style-preserve-3d
  group-hover:rotate-y-180
`;


export const cardFaceBaseCss = `absolute w-full h-full backface-hidden rounded-2xl shadow-xl text-center p-6`;

export const cardBackCss = `
  ${cardFaceBaseCss} font-orbitron bg-yellow-400 text-black transform rotate-y-180
  hover:shadow-[0_0_25px_#ffe600] hover:border-[2px] hover:border-yellow-400
  transition-all duration-300
`;
export const cardFrontCss = `
  ${cardFaceBaseCss} font-orbitron bg-gray-800 text-white 
  hover:shadow-[0_0_10px_#ffe600] hover:border-[2px] hover:border-yellow-400
  transition-all duration-300
  flex flex-col items-center justify-center
  text-center
  min-h-[200px]
  pt-4 
  pb-6 
  text-center
`;


export const imageCenter = `
  block 
  max-w-[80%] 
  max-h-[200px] 
  m-auto
  object-contain 
  transition-all duration-300 ease-in-out
`;

export const neonTitleCss = "text-center mb-6 font-orbitron text-2xl text-white animate-[glow_1.5s_alternate_infinite]";

export const neonPulseBtnCss = `
  relative px-6 py-4 text-lg font-semibold text-white bg-black border-2 border-cyan-400
  shadow-[0_0_10px_rgba(0,255,255,0.3)] cursor-pointer overflow-visible transition-all duration-400 z-10
  before:content-[''] before:absolute before:inset-[-4px] before:border-2 before:border-cyan-400 before:rounded-inherit before:animate-[pulseOut_2s_ease-out_infinite] before:opacity-0
  after:content-[''] after:absolute after:inset-[-4px] after:border-2 after:border-cyan-400 after:rounded-inherit after:animate-[pulseOut_2s_ease-out_infinite] after:opacity-0 after:[animation-delay:1s]
`;

export const playButtonDarkCss = `
  bg-black
  text-yellow-400
  font-bold
  px-6
  py-2
  rounded-lg
  border
  border-yellow-400
  shadow-[0_0_10px_rgba(253,224,71,0.6)]
  hover:bg-violet-500
  hover:text-black
  hover:border-violet-400
  hover:shadow-[0_0_20px_rgba(139,92,246,0.9)]
  transition
  duration-300
`;
