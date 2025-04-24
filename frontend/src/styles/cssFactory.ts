// REGISTER
export const inputCss: string = "@apply w-[250px] text-base border shadow-[1px_1px_3px_rgba(0,0,0,0.1)] p-2.5 rounded-[5px] border-solid border-[#ccc]";


// NAVBAR
// Dans ton fichier cssFactory.ts
export const linkCss: string = "font-orbitron text-white transition duration-300 ease-in-out self-center text-2xl font-semibold whitespace-nowrap dark:text-white hover:text-yellow-500 relative inline-block after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-yellow-500 after:bottom-0 after:left-0 after:transform after:scale-x-0 after:origin-right after:transition-all after:duration-400 hover:after:scale-x-100";

// export const linkCss = "text-white transition duration-300 ease-in-out";

//BUTTON 
export const loginWrapperCss = "shadow-lg flex items-center justify-center min-h-screen bg-gray-100";
export const loginCardCss = "rounded-xl border-white/30 bg-white/10 border backdrop-blur-md space-y-6 bg-white p-8 rounded-2xl shadow-xl w-full max-w-md";
export const headerCss = "text-center";
export const headerTextCss = "text-2xl font-bold text-gray-800";
export const inputWrapperCss = "flex flex-col space-y-4 self-start ml-16";
export const statusWrapperCss = "text-center text-sm";
export const statusOkCss = "text-green-500";
export const statusKoCss = "text-red-500";

export const fancyButtonCss =
  "group p-5 cursor-pointer relative text-xl font-normal border-0 flex items-center justify-center bg-transparent text-[rgba(239,177,0,1)] h-auto w-[170px] overflow-hidden transition-all duration-100 ml-26";

export const fancyLeftBorderCss =
  "group-hover:w-full absolute left-0 h-full w-5 border-y border-l border-[rgba(239,177,0,1)] transition-all duration-500";

export const disappearingTextCss =
  "font-orbitron group-hover:opacity-0 group-hover:translate-x-[-100%] absolute translate-x-0 transition-all duration-200";

export const appearingTextCss =
  "font-orbitron group-hover:translate-x-0 group-hover:opacity-100 absolute translate-x-full opacity-0 transition-all duration-200";

export const fancyRightBorderCss =
  "group-hover:w-full absolute right-0 h-full w-5 border-y border-r border-[rgba(239,177,0,1)] transition-all duration-500";


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

// Neon text
export const neonTextCss = "font-orbitron text-2xl text-white animate-[glow_1.5s_alternate_infinite]";
