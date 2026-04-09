import { useState, useRef, useEffect } from 'react';
import { Sparkles, Mic, ArrowUpRight, User, BarChart, Zap, MoreHorizontal } from 'lucide-react';
import svgPaths from "../../../imports/TransactionsHistory/svg-pq2oaob5wk";

export function AIAssistantPage() {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = (text: string = inputValue) => {
    if (!text.trim()) return;
    console.log('Sending message:', text);
    setInputValue('');
  };

  const handlePromptClick = (text: string) => {
    setInputValue(text);
    // Simulate quickly populating and sending
    setTimeout(() => {
      handleSend(text);
      inputRef.current?.focus();
    }, 300);
  };

  return (
    <div className="flex flex-col h-full bg-[#141414] relative">
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-[832px] mx-auto px-6">
        
        {/* Title area */}
        <div className="flex flex-col items-center justify-center gap-1 w-full text-center mb-12">
          <div className="flex items-center gap-[4px] justify-center mb-1">
            <div className="w-[32px] h-[32px] bg-[#064e3b] rounded-[9.6px] flex items-center justify-center relative overflow-hidden text-white">
               {/* Wealthy Logo SVG */}
               <svg className="w-[19.2px] h-[19.2px] absolute" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <g>
                   <g filter="url(#filter0_ai)">
                     <path d={svgPaths.p23f4d000} fill="currentColor" />
                   </g>
                   <g filter="url(#filter1_ai)">
                     <path d={svgPaths.p22496d80} fill="currentColor" />
                   </g>
                   <path d={svgPaths.p11000980} fill="currentColor" />
                </g>
                <defs>
                   <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="13.6658" id="filter0_ai" width="11.1695" x="14.0305" y="10.3342">
                     <feFlood floodOpacity="0" result="BackgroundImageFix" />
                     <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                     <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                     <feOffset dx="2" />
                     <feGaussianBlur stdDeviation="0.6" />
                     <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                     <feColorMatrix type="matrix" values="0 0 0 0 0.0235294 0 0 0 0 0.305882 0 0 0 0 0.231373 0 0 0 0.07 0" />
                     <feBlend in2="shape" mode="normal" result="effect1_innerShadow" />
                   </filter>
                   <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="13.6462" id="filter1_ai" width="11.5439" x="-1.2" y="0">
                     <feFlood floodOpacity="0" result="BackgroundImageFix" />
                     <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                     <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                     <feOffset dx="-2" />
                     <feGaussianBlur stdDeviation="0.6" />
                     <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                     <feColorMatrix type="matrix" values="0 0 0 0 0.0235294 0 0 0 0 0.305882 0 0 0 0 0.231373 0 0 0 0.07 0" />
                     <feBlend in2="shape" mode="normal" result="effect1_innerShadow" />
                   </filter>
                </defs>
              </svg>
            </div>
            <h2 className="text-[24px] font-medium text-[#e1e4ea] font-['Inter_Tight',sans-serif] leading-[30px]">
              Hi, Alexander
            </h2>
          </div>
          <h1 className="text-[40px] font-medium leading-[50px] font-['Inter_Tight',sans-serif] bg-clip-text text-transparent bg-gradient-to-r from-[#005b55] from-[38%] to-[#28fcae]">
            Ask anything about your money.
          </h1>
        </div>

        {/* Input box */}
        <div className="w-fit bg-[rgba(25,27,31,0.7)] border border-[#2e2f33] rounded-[16px] p-[16px] flex flex-col gap-4">
          <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[16px] flex flex-col items-center shadow-[0_0_0_4px_#2e2f33] min-w-[800px]">
            <div className="flex items-center w-full p-4 gap-4">
              <Sparkles className="w-5 h-5 text-[#717784] shrink-0" />
              <div className="w-[1px] h-[12px] bg-[#2e2f33]"></div>
              <input 
                ref={inputRef}
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }}
                placeholder="Ask a question or make a request..." 
                className="flex-1 bg-transparent border-none outline-none text-[#e1e4ea] placeholder:text-[#717784] font-['Inter_Tight',sans-serif] text-[16px]"
                autoFocus
              />
              <div className="flex items-center gap-2 shrink-0 h-[40px]">
                <button className="flex items-center justify-center w-[40px] h-[40px] rounded-full hover:bg-[rgba(65,63,63,0.3)] text-[#e1e4ea] transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleSend()}
                  className="flex items-center justify-center w-[40px] h-[40px] bg-[rgba(65,63,63,0.5)] border border-[#2e2f33] rounded-[8px] hover:bg-[rgba(65,63,63,0.8)] text-[#e1e4ea] transition-colors"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Pills */}
          <div className="flex items-center gap-2 w-full">
            <button 
              onClick={() => handlePromptClick('Compare food expenses to last month')}
              className="flex items-center justify-center gap-[4px] px-[12px] py-[8px] border border-[#2e2f33] rounded-[8px] bg-transparent hover:bg-[rgba(65,63,63,0.3)] transition-colors text-[#e1e4ea] whitespace-nowrap"
            >
              <User className="w-[20px] h-[20px] text-[#e1e4ea] shrink-0" />
              <span className="font-['Inter_Tight',sans-serif] font-medium text-[14px]">Compare food expenses to last month</span>
            </button>
            <button 
              onClick={() => handlePromptClick('Am I on track for my savings goal?')}
              className="flex items-center justify-center gap-[4px] px-[12px] py-[8px] border border-[#2e2f33] rounded-[8px] bg-transparent hover:bg-[rgba(65,63,63,0.3)] transition-colors text-[#e1e4ea] whitespace-nowrap"
            >
              <BarChart className="w-[20px] h-[20px] text-[#e1e4ea] shrink-0" />
              <span className="font-['Inter_Tight',sans-serif] font-medium text-[14px]">Am I on track for my savings goal?</span>
            </button>
            <button 
              onClick={() => handlePromptClick('Show my biggest liability')}
              className="flex items-center justify-center gap-[4px] px-[12px] py-[8px] border border-[#2e2f33] rounded-[8px] bg-transparent hover:bg-[rgba(65,63,63,0.3)] transition-colors text-[#e1e4ea] whitespace-nowrap"
            >
              <Zap className="w-[20px] h-[20px] text-[#e1e4ea] shrink-0" />
              <span className="font-['Inter_Tight',sans-serif] font-medium text-[14px]">Show my biggest liability</span>
            </button>
            <button className="flex items-center justify-center p-[8px] border border-[#2e2f33] rounded-[8px] bg-transparent hover:bg-[rgba(65,63,63,0.3)] transition-colors text-[#e1e4ea] shrink-0">
              <MoreHorizontal className="w-[20px] h-[20px] text-[#e1e4ea]" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full h-[72px] flex items-center justify-center shrink-0">
        <p className="text-[#717784] font-['Inter_Tight',sans-serif] text-[14px]">
          Wealthy can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
