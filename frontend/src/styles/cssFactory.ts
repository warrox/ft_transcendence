// REGISTER
export const inputCss: string = "@apply w-[250px] text-base border shadow-[1px_1px_3px_rgba(0,0,0,0.1)] p-2.5 rounded-[5px] border-solid border-[#ccc]";


// NAVBAR
export const linkCss: string = "self-center text-2xl font-semibold whitespace-nowrap dark:text-white"

//BUTTON TEST
export const fancyButtonCss: string = `
	@apply relative w-[200px] h-[70px] text-white text-[23px] tracking-[3px] font-semibold 
	overflow-hidden transition-all duration-500 cursor-pointer shadow-md 
	bg-gradient-to-tr from-[#c32c71] to-[#b33771] 
	hover:rotate-[-3deg] hover:scale-[1.1] hover:shadow-lg;
`;

export const fancySpanCss = [
	"absolute block h-[3px] w-full top-0 left-[-100%] bg-gradient-to-r from-transparent to-[#f6e58d] rounded-r-sm animate-span1",
	"absolute block h-full w-[3px] top-[-100%] right-0 bg-gradient-to-b from-transparent to-[#f6e58d] rounded-b-sm animate-span2",
	"absolute block h-[3px] w-full bottom-0 right-[-100%] bg-gradient-to-l from-transparent to-[#f6e58d] rounded-l-sm animate-span3",
	"absolute block h-full w-[3px] bottom-[-100%] left-0 bg-gradient-to-t from-transparent to-[#f6e58d] rounded-t-sm animate-span4"
	];