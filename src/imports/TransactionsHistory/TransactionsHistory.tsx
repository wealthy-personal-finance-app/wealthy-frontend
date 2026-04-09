import svgPaths from "./svg-pq2oaob5wk";
import imgImage from "./3bf6d91fffb576176d4a0070882aa4c6d17189e7.png";

function Layer() {
  return (
    <div className="absolute contents inset-0" data-name="Layer 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Group">
          <g filter="url(#filter0_i_3_3011)" id="Vector">
            <path d={svgPaths.p23f4d000} fill="var(--fill-0, #F5F5F5)" />
          </g>
          <g filter="url(#filter1_i_3_3011)" id="Vector_2">
            <path d={svgPaths.p22496d80} fill="var(--fill-0, #F5F5F5)" />
          </g>
          <path d={svgPaths.p11000980} fill="var(--fill-0, #F5F5F5)" id="Vector_3" />
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="13.6658" id="filter0_i_3_3011" width="11.1695" x="14.0305" y="10.3342">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dx="2" />
            <feGaussianBlur stdDeviation="0.6" />
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.0235294 0 0 0 0 0.305882 0 0 0 0 0.231373 0 0 0 0.07 0" />
            <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_3011" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="13.6462" id="filter1_i_3_3011" width="11.5439" x="-1.2" y="0">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dx="-2" />
            <feGaussianBlur stdDeviation="0.6" />
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.0235294 0 0 0 0 0.305882 0 0 0 0 0.231373 0 0 0 0.07 0" />
            <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_3011" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

function Asset() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[24px] top-1/2" data-name="Asset 1 1">
      <Layer />
    </div>
  );
}

function TemplateForExport() {
  return (
    <div className="absolute left-0 overflow-clip size-[40px] top-0" data-name="TEMPLATE FOR EXPORT">
      <Asset />
    </div>
  );
}

function IconPreview48Px() {
  return (
    <div className="bg-[#064e3b] overflow-clip relative rounded-[12px] shrink-0 size-[40px]" data-name="Icon preview 48 px">
      <TemplateForExport />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <IconPreview48Px />
      <p className="font-['Inter_Tight:SemiBold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">Wealthy</p>
    </div>
  );
}

function HeaderCardSidebar() {
  return (
    <div className="content-stretch flex items-center justify-between overflow-clip py-[12px] relative rounded-[10px] shrink-0 w-[248px]" data-name="Header Card [Sidebar] [1.0]">
      <Frame8 />
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="sidebar">
        <div className="absolute inset-[16.25%]" data-name="Icon">
          <div className="absolute inset-[-5.56%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
              <path d={svgPaths.p366a3f00} id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[16.25%_61.25%_16.25%_38.75%]" data-name="Icon">
          <div className="absolute inset-[-5.56%_-0.75px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.5 15">
              <path d="M0.75 0.75V14.25" id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarHeaderSidebar() {
  return (
    <div className="relative shrink-0 w-full" data-name="Sidebar Header [Sidebar] [1.0]">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[12px] items-center justify-center px-[12px] py-[8px] relative w-full">
          <HeaderCardSidebar />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-start pl-[12px] relative shrink-0">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#99a0ae] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Menu</p>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[248px]" data-name="Navigation">
      <div className="relative rounded-[8px] shrink-0 w-full" data-name="menu">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="home">
              <div className="absolute inset-[12.5%_16.25%]" data-name="Icon">
                <div className="absolute inset-[-5%_-5.56%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 16.5">
                    <path d={svgPaths.p2506cf00} id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-[12.5%] left-[38.75%] right-[38.75%] top-1/2" data-name="Icon">
                <div className="absolute inset-[-10%_-16.67%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 9">
                    <path d="M0.75 8.25V0.75H5.25V8.25" id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="flex-[1_0_0] font-['Inter_Tight:Medium',sans-serif] leading-[18px] min-h-px min-w-px not-italic relative text-[#717784] text-[14px]">Dashboard</p>
          </div>
        </div>
      </div>
      <div className="relative rounded-[8px] shrink-0 w-full" data-name="menu">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="bot">
              <div className="absolute bottom-[66.67%] left-[33.33%] right-1/2 top-[16.67%]" data-name="Vector">
                <div className="absolute inset-[-22.5%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.83333 4.83333">
                    <path d="M4.08333 4.08333V0.75H0.75" id="Vector" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-[33.33%_16.67%_16.67%_16.67%]" data-name="Vector">
                <div className="absolute inset-[-7.5%_-5.63%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8333 11.5">
                    <path d={svgPaths.p1fe7ba50} id="Vector" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-[58.33%_83.33%_41.67%_8.33%]" data-name="Vector">
                <div className="absolute inset-[-0.75px_-45%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.16667 1.5">
                    <path d="M0.75 0.75H2.41667" id="Vector" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-[58.33%_8.33%_41.67%_83.33%]" data-name="Vector">
                <div className="absolute inset-[-0.75px_-45%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.16667 1.5">
                    <path d="M0.75 0.75H2.41667" id="Vector" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-[54.17%_37.5%_37.5%_62.5%]" data-name="Vector">
                <div className="absolute inset-[-45%_-0.75px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.5 3.16667">
                    <path d="M0.75 0.75V2.41667" id="Vector" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-[54.17%_62.5%_37.5%_37.5%]" data-name="Vector">
                <div className="absolute inset-[-45%_-0.75px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.5 3.16667">
                    <path d="M0.75 0.75V2.41667" id="Vector" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="flex-[1_0_0] font-['Inter_Tight:Regular',sans-serif] leading-[18px] min-h-px min-w-px not-italic relative text-[#717784] text-[14px]">AI Assistant</p>
          </div>
        </div>
      </div>
      <div className="relative rounded-[8px] shrink-0 w-full" data-name="menu">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="cash-flow">
              <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[10.4px] left-1/2 top-[calc(50%-0.4px)] w-[12.4px]" data-name="Shape">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.5 13">
                  <path d={svgPaths.p1942b670} fill="var(--fill-0, #717784)" id="Shape" />
                </svg>
              </div>
            </div>
            <p className="flex-[1_0_0] font-['Inter_Tight:Regular',sans-serif] leading-[18px] min-h-px min-w-px not-italic relative text-[#717784] text-[14px]">Cash Flow</p>
          </div>
        </div>
      </div>
      <div className="bg-[rgba(65,63,63,0.5)] relative rounded-[8px] shrink-0 w-full" data-name="menu">
        <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="list">
              <div className="absolute inset-[72.5%_16.25%_27.5%_35%]" data-name="Icon">
                <div className="absolute inset-[-0.94px_-9.62%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.625 1.875">
                    <path d="M0.9375 0.9375H10.6875" id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.875" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-[72.5%_83.72%_27.5%_16.25%]" data-name="Icon">
                <div className="absolute inset-[-0.94px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.88167 1.875">
                    <path d="M0.9375 0.9375H0.944167" id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.875" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-1/2 left-[35%] right-[16.25%] top-1/2" data-name="Icon">
                <div className="absolute inset-[-0.75px_-7.69%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.25 1.5">
                    <path d="M0.75 0.75H10.5" id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-1/2 left-[16.25%] right-[83.72%] top-1/2" data-name="Icon">
                <div className="absolute inset-[-0.75px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.50667 1.5">
                    <path d="M0.75 0.75H0.756667" id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-[27.5%_16.25%_72.5%_35%]" data-name="Icon">
                <div className="absolute inset-[-0.75px_-7.69%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.25 1.5">
                    <path d="M0.75 0.75H10.5" id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-[27.5%_83.72%_72.5%_16.25%]" data-name="Icon">
                <div className="absolute inset-[-0.75px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.50667 1.5">
                    <path d="M0.75 0.75H0.756667" id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="flex-[1_0_0] font-['Inter_Tight:Medium',sans-serif] leading-[18px] min-h-px min-w-px not-italic relative text-[14px] text-white">Transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Menu() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Menu">
      <Frame1 />
      <Navigation />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <div className="relative rounded-[8px] shrink-0 w-full" data-name="menu">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="target-03">
              <div className="absolute inset-[37.5%]" data-name="Fill">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
                  <path d={svgPaths.p3b29e480} fill="var(--fill-0, #717784)" id="Fill" opacity="0.12" />
                </svg>
              </div>
              <div className="absolute inset-[8.33%]" data-name="Icon">
                <div className="absolute inset-[-4.5%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1667 18.1667">
                    <path d={svgPaths.p1b352380} id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="flex-[1_0_0] font-['Inter_Tight:Regular',sans-serif] leading-[18px] min-h-px min-w-px not-italic relative text-[#717784] text-[14px]">{`Goals & Habits`}</p>
          </div>
        </div>
      </div>
      <div className="relative rounded-[8px] shrink-0 w-full" data-name="menu">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="folder">
              <div className="absolute inset-[16.25%_12.5%]" data-name="Icon">
                <div className="absolute inset-[-5.56%_-5%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 15">
                    <path d={svgPaths.p16b03080} id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="flex-[1_0_0] font-['Inter_Tight:Regular',sans-serif] leading-[18px] min-h-px min-w-px not-italic relative text-[#717784] text-[14px]">Advanced Planning</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Menu />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 248 1">
            <line id="Line 24" stroke="var(--stroke-0, #2E2F33)" x2="248" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame9 />
    </div>
  );
}

function Navigation1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[248px]" data-name="Navigation">
      <div className="relative rounded-[8px] shrink-0 w-full" data-name="menu">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="help-circle">
              <div className="absolute inset-[12.5%]" data-name="Icon">
                <div className="absolute inset-[-5%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 16.5">
                    <path d={svgPaths.p37c15d80} id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-[31.25%] left-1/2 right-[49.97%] top-[68.75%]" data-name="Icon">
                <div className="absolute inset-[-0.75px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.50667 1.5">
                    <path d="M0.75 0.75H0.756667" id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-[31.23%_39.05%_46.25%_39.09%]" data-name="Icon">
                <div className="absolute inset-[-16.65%_-17.15%_-16.66%_-17.16%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87271 6.00356">
                    <path d={svgPaths.p2fab6600} id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="flex-[1_0_0] font-['Inter_Tight:Regular',sans-serif] leading-[18px] min-h-px min-w-px not-italic relative text-[#717784] text-[14px]">Help Center</p>
          </div>
        </div>
      </div>
      <div className="relative rounded-[8px] shrink-0 w-full" data-name="menu">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="settings">
              <div className="absolute inset-[38.75%]" data-name="Icon">
                <div className="absolute inset-[-16.67%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
                    <path d={svgPaths.p93ea200} id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-[8.75%]" data-name="Icon">
                <div className="absolute inset-[-4.55%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                    <path d={svgPaths.p25c32890} id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="flex-[1_0_0] font-['Inter_Tight:Regular',sans-serif] leading-[18px] min-h-px min-w-px not-italic relative text-[#717784] text-[14px]">Settings</p>
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron-right">
              <div className="absolute inset-[32%_41%]" data-name="Icon">
                <div className="absolute inset-[-13.02%_-26.04%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.475 9.075">
                    <path d={svgPaths.p2eec8980} id="Icon" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.875" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Content">
      <div className="content-stretch flex flex-col items-start justify-between pb-[16px] px-[16px] relative size-full">
        <Frame12 />
        <Navigation1 />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-h-px min-w-px relative w-full">
      <SidebarHeaderSidebar />
      <Content />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="content-stretch flex flex-col h-[1024px] items-start overflow-clip relative shrink-0 w-[280px]" data-name="Sidebar">
      <Frame />
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex items-center justify-center px-[4px] relative shrink-0" data-name="Text">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">
        <p className="leading-[24px]">Button</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[11px] text-white whitespace-nowrap" style={{ fontFeatureSettings: "'cv09', 'ss11', 'calt' 0, 'liga' 0" }}>
        Alexander Jhoe
      </p>
      <div className="bg-[#047857] content-stretch flex h-[12px] items-center justify-center overflow-clip px-[5px] py-[2px] relative rounded-[999px] shrink-0" data-name="Badge [1.0]">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[8px] text-white tracking-[0.16px] uppercase whitespace-nowrap" style={{ fontFeatureSettings: "'cv09', 'ss11', 'calt' 0, 'liga' 0" }}>
          Free
        </p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start justify-center relative shrink-0" data-name="Text">
      <Frame2 />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717784] text-[10px] whitespace-nowrap" style={{ fontFeatureSettings: "'cv09', 'ss11', 'calt' 0, 'liga' 0" }}>
        alexanderjhoe@mail.com
      </p>
    </div>
  );
}

function Buttons() {
  return (
    <div className="bg-[#1f2220] h-[40px] relative rounded-[8px] shrink-0" data-name="Buttons [1.0]">
      <div className="content-stretch flex gap-[8px] h-full items-center justify-center overflow-clip p-[6px] relative rounded-[inherit]">
        <div className="relative shrink-0 size-[24px]" data-name="Avatar">
          <div className="absolute inset-0 rounded-[999px]" data-name="Image">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[999px] size-full" src={imgImage} />
          </div>
        </div>
        <Text1 />
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="chevron-down">
          <div className="absolute inset-[41%_32%]" data-name="Icon">
            <div className="absolute inset-[-20.83%_-10.42%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.96 4.08">
                <path d="M0.6 0.6L3.48 3.48L6.36 0.6" id="Icon" stroke="var(--stroke-0, #525866)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_2px_8px_-4px_rgba(10,13,20,0.2)]" />
    </div>
  );
}

function Topbar() {
  return (
    <div className="bg-[#191b1f] relative shrink-0 w-full" data-name="topbar">
      <div aria-hidden="true" className="absolute border-[#2e2f33] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative w-full">
          <div className="bg-[#065f46] relative rounded-[8px] shrink-0" data-name="Button">
            <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[12px] py-[8px] relative rounded-[inherit]">
              <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron-left">
                <div className="absolute inset-[32%_41%]" data-name="Icon">
                  <div className="absolute inset-[-10.42%_-20.83%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.1 8.7">
                      <path d={svgPaths.p19f1a00} id="Icon" stroke="var(--stroke-0, #0E121B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </div>
              <Text />
              <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron-right">
                <div className="absolute inset-[32%_41%]" data-name="Icon">
                  <div className="absolute inset-[-10.42%_-20.83%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.1 8.7">
                      <path d={svgPaths.pc4f9900} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
          </div>
          <Buttons />
        </div>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Heading 1">
      <p className="font-['Inter_Tight:Medium',sans-serif] leading-[26px] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">Transactions</p>
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start p-[32px] relative w-full">
        <Heading />
        <div className="bg-[#191b1f] content-stretch flex gap-[4px] items-start p-[4px] relative rounded-[12px] shrink-0" data-name="Switch Toggle">
          <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[12px]" />
          <div className="bg-[rgba(65,63,63,0.5)] content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[4px] relative rounded-[8px] shadow-[0px_1px_6px_0px_rgba(14,18,27,0.08)] shrink-0" data-name="↳ 🏷️ Switch 1">
            <div className="relative shrink-0 size-[20px]" data-name="expense">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                <g id="vuesax/linear/transaction-minus">
                  <path d={svgPaths.p2e356bf0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d="M7.70833 8.33333H12.2917" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <g id="Vector_3" opacity="0" />
                </g>
              </svg>
            </div>
            <p className="font-['Inter_Tight:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">History</p>
          </div>
          <div className="content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[4px] relative rounded-[8px] shrink-0" data-name="↳ 🏷️ Switch 2">
            <div className="relative shrink-0 size-[20px]" data-name="income">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                <g id="vuesax/linear/wallet-add">
                  <path d={svgPaths.p1d1c7000} id="Vector" stroke="var(--stroke-0, #99A0AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <g id="Group">
                    <path d={svgPaths.p23348f00} id="Vector_2" stroke="var(--stroke-0, #99A0AE)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" />
                    <g id="Group_2">
                      <path d="M5.40977 15.8162H2.92643" id="Vector_3" stroke="var(--stroke-0, #99A0AE)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" />
                      <path d="M4.16667 14.5996V17.0913" id="Vector_4" stroke="var(--stroke-0, #99A0AE)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" />
                    </g>
                  </g>
                  <g id="Vector_5" opacity="0" />
                  <path d={svgPaths.p17a78000} id="Vector_6" stroke="var(--stroke-0, #99A0AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p224b1a80} id="Vector_7" stroke="var(--stroke-0, #99A0AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </g>
              </svg>
            </div>
            <p className="font-['Inter_Tight:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#717784] text-[16px] text-center whitespace-nowrap">Autopilot</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Buttons1() {
  return (
    <div className="bg-[#141414] flex-[1_0_0] h-[40px] min-h-px min-w-px relative rounded-[8px]" data-name="Buttons [1.0]">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[8px] relative size-full">
          <div className="overflow-clip relative shrink-0 size-[20px]" data-name="search">
            <div className="absolute inset-[16.25%]" data-name="Icon">
              <div className="absolute inset-[-5.56%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.9999 15">
                  <path d={svgPaths.p31d7be00} id="Icon" stroke="var(--stroke-0, #99A0AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#99a0ae] text-[14px] w-[1040px]">
            <p className="leading-[18px]">Search merchants...</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_2px_8px_-4px_rgba(10,13,20,0.2)]" />
    </div>
  );
}

function RadioLabel() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Radio Label [1.0]">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="filter">
        <div className="absolute inset-[16.25%_12.5%]" data-name="Icon">
          <div className="absolute inset-[-5.56%_-5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 15">
              <path d={svgPaths.p3416db00} id="Icon" stroke="var(--stroke-0, #99A0AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#191b1f] content-stretch flex flex-col items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0 w-[52px]">
      <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <RadioLabel />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
      <Buttons1 />
      <Frame6 />
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Title">
      <p className="font-['Inter_Tight:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">All</p>
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-name="Text">
      <Title />
    </div>
  );
}

function RadioLabel1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[18px] items-center relative shrink-0 w-full" data-name="Radio Label [1.0]">
      <div className="flex flex-row items-center self-stretch">
        <Text2 />
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#065f46] content-stretch flex flex-col items-start px-[16px] py-[8px] relative rounded-[16px] shrink-0 w-[47px]">
      <RadioLabel1 />
    </div>
  );
}

function Title1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Title">
      <p className="font-['Inter_Tight:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#717784] text-[14px] whitespace-nowrap">Income</p>
    </div>
  );
}

function Text3() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-name="Text">
      <Title1 />
    </div>
  );
}

function RadioLabel2() {
  return (
    <div className="content-stretch flex gap-[8px] h-[18px] items-center relative shrink-0 w-full" data-name="Radio Label [1.0]">
      <div className="flex flex-row items-center self-stretch">
        <Text3 />
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#191b1f] content-stretch flex flex-col items-start px-[16px] py-[8px] relative rounded-[16px] shrink-0 w-[77px]">
      <RadioLabel2 />
    </div>
  );
}

function Title2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Title">
      <p className="font-['Inter_Tight:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#717784] text-[14px] whitespace-nowrap">Expenses</p>
    </div>
  );
}

function Text4() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-name="Text">
      <Title2 />
    </div>
  );
}

function RadioLabel3() {
  return (
    <div className="content-stretch flex gap-[8px] h-[18px] items-center relative shrink-0 w-full" data-name="Radio Label [1.0]">
      <div className="flex flex-row items-center self-stretch">
        <Text4 />
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[#191b1f] content-stretch flex flex-col items-start px-[16px] py-[8px] relative rounded-[16px] shrink-0 w-[91px]">
      <RadioLabel3 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <Frame3 />
      <Frame7 />
      <Frame4 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[106.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Frame10 />
      <Frame11 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter_Tight:SemiBold',sans-serif] leading-[18px] left-[8px] not-italic text-[#717784] text-[14px] top-0 whitespace-nowrap">Today, April 6</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[rgba(65,63,63,0.5)] relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[10px] px-[10px] relative size-full">
        <div className="relative shrink-0 size-[20px]" data-name="coffee-02">
          <div className="absolute inset-[43.75%_8.33%_27.08%_70.83%]" data-name="Vector">
            <div className="absolute inset-[-12.86%_-18%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.66669 7.33346">
                <path d={svgPaths.p110cfc80} id="Vector" stroke="var(--stroke-0, #99A0AE)" strokeLinecap="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-[10.42%] left-[8.33%] right-1/4 top-[35.42%]" data-name="Vector">
            <div className="absolute inset-[-6.92%_-5.63%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8335 12.3333">
                <path d={svgPaths.p1e455580} id="Vector" stroke="var(--stroke-0, #99A0AE)" strokeLinecap="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[10.42%_41.66%_77.08%_29.17%]" data-name="Vector">
            <div className="absolute inset-[-30%_-12.86%_-30%_-12.85%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.33444 4.0001">
                <path d={svgPaths.p3e915880} id="Vector" stroke="var(--stroke-0, #99A0AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="flex-[938.438_0_0] h-[39px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start not-italic relative size-full whitespace-nowrap">
        <p className="font-['Inter_Tight:Medium',sans-serif] leading-[18px] relative shrink-0 text-[14px] text-white">Starbucks Coffee</p>
        <p className="font-['Inter_Tight:Regular',sans-serif] leading-[16px] relative shrink-0 text-[#94a3b8] text-[12px]">{`Food & Dining • Restaurants`}</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[6px] size-[18px] top-[6px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3f4e600} id="Vector" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p2aca4e80} id="Vector_2" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p10b1cef0} id="Vector_3" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function TransactionRow() {
  return (
    <div className="bg-[#191b1f] relative rounded-[10px] shrink-0 w-full" data-name="TransactionRow">
      <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[17px] py-[13px] relative w-full">
          <Container6 />
          <Container7 />
          <p className="font-['Inter_Tight:SemiBold',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#df1c41] text-[14px] whitespace-nowrap">-LKR 1,250</p>
          <Button />
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-[rgba(65,63,63,0.5)] relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[10px] px-[10px] relative size-full">
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="shopping-cart-03">
          <div className="absolute inset-[20.83%_8.61%_41.67%_17.45%]" data-name="Fill">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7887 7.5">
              <path d={svgPaths.pfd2b000} fill="var(--fill-0, #99A0AE)" id="Fill" opacity="0.12" />
            </svg>
          </div>
          <div className="absolute inset-[8.33%_8.61%_8.33%_8.33%]" data-name="Icon">
            <div className="absolute inset-[-4.5%_-4.52%_-4.5%_-4.51%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1116 18.1667">
                <path d={svgPaths.p3b930080} id="Icon" stroke="var(--stroke-0, #99A0AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="flex-[938.438_0_0] h-[39px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start not-italic relative size-full whitespace-nowrap">
        <p className="font-['Inter_Tight:Medium',sans-serif] leading-[18px] relative shrink-0 text-[14px] text-white">Amazon.com</p>
        <p className="font-['Inter_Tight:Regular',sans-serif] leading-[16px] relative shrink-0 text-[#94a3b8] text-[12px]">Shopping • Online Shopping</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[6px] size-[18px] top-[6px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3f4e600} id="Vector" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p2aca4e80} id="Vector_2" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p10b1cef0} id="Vector_3" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function TransactionRow1() {
  return (
    <div className="bg-[#191b1f] relative rounded-[10px] shrink-0 w-full" data-name="TransactionRow">
      <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[17px] py-[13px] relative w-full">
          <Container8 />
          <Container9 />
          <p className="font-['Inter_Tight:SemiBold',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#df1c41] text-[14px] whitespace-nowrap">-LKR 8,500</p>
          <Button1 />
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[rgba(65,63,63,0.5)] relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[10px] px-[10px] relative size-full">
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="shopping-cart-03">
          <div className="absolute inset-[20.83%_8.61%_41.67%_17.45%]" data-name="Fill">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
              <g id="Fill" opacity="0.12" />
            </svg>
          </div>
          <div className="absolute inset-[8.33%_8.61%_8.33%_8.33%]" data-name="Icon">
            <div className="absolute inset-[-4.5%_-4.52%_-4.5%_-4.51%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1116 18.1667">
                <path d={svgPaths.p3b930080} id="Icon" stroke="var(--stroke-0, #99A0AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="flex-[938.438_0_0] h-[39px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start not-italic relative size-full whitespace-nowrap">
        <p className="font-['Inter_Tight:Medium',sans-serif] leading-[18px] relative shrink-0 text-[14px] text-white">Monthly Salary</p>
        <p className="font-['Inter_Tight:Regular',sans-serif] leading-[16px] relative shrink-0 text-[#94a3b8] text-[12px]">Income • Salary</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[6px] size-[18px] top-[6px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3f4e600} id="Vector" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p2aca4e80} id="Vector_2" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p10b1cef0} id="Vector_3" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function TransactionRow2() {
  return (
    <div className="bg-[#191b1f] relative rounded-[10px] shrink-0 w-full" data-name="TransactionRow">
      <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[17px] py-[13px] relative w-full">
          <Container10 />
          <Container11 />
          <p className="font-['Inter_Tight:SemiBold',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#40c4aa] text-[14px] whitespace-nowrap">+LKR 125,000</p>
          <Button2 />
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Container">
      <TransactionRow />
      <TransactionRow1 />
      <TransactionRow2 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Container5 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter_Tight:SemiBold',sans-serif] leading-[18px] left-[8px] not-italic text-[#717784] text-[14px] top-0 whitespace-nowrap">Yesterday, April 5</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-[rgba(65,63,63,0.5)] relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[10px] px-[10px] relative size-full">
        <div className="relative shrink-0 size-[20px]" data-name="coffee-02">
          <div className="absolute inset-[43.75%_8.33%_27.08%_70.83%]" data-name="Vector">
            <div className="absolute inset-[-12.86%_-18%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.66669 7.33346">
                <path d={svgPaths.p110cfc80} id="Vector" stroke="var(--stroke-0, #99A0AE)" strokeLinecap="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-[10.42%] left-[8.33%] right-1/4 top-[35.42%]" data-name="Vector">
            <div className="absolute inset-[-6.92%_-5.63%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8335 12.3333">
                <path d={svgPaths.p1e455580} id="Vector" stroke="var(--stroke-0, #99A0AE)" strokeLinecap="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[10.42%_41.66%_77.08%_29.17%]" data-name="Vector">
            <div className="absolute inset-[-30%_-12.86%_-30%_-12.85%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.33444 4.0001">
                <path d={svgPaths.p3e915880} id="Vector" stroke="var(--stroke-0, #99A0AE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="flex-[938.438_0_0] h-[39px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start not-italic relative size-full whitespace-nowrap">
        <p className="font-['Inter_Tight:Medium',sans-serif] leading-[18px] relative shrink-0 text-[14px] text-white">Uber</p>
        <p className="font-['Inter_Tight:Regular',sans-serif] leading-[16px] relative shrink-0 text-[#94a3b8] text-[12px]">Transportation • Ride Share</p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[6px] size-[18px] top-[6px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3f4e600} id="Vector" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p2aca4e80} id="Vector_2" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p10b1cef0} id="Vector_3" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function TransactionRow3() {
  return (
    <div className="bg-[#191b1f] relative rounded-[10px] shrink-0 w-full" data-name="TransactionRow">
      <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[17px] py-[13px] relative w-full">
          <Container14 />
          <Container15 />
          <p className="font-['Inter_Tight:SemiBold',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#df1c41] text-[14px] whitespace-nowrap">-LKR 750</p>
          <Button3 />
        </div>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[11.35%_10%_11.22%_8.68%]" data-name="Group">
      <div className="absolute inset-[-1.61%_-2.17%_-1.62%_-2.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.9726 15.9846">
          <g id="Group">
            <path d={svgPaths.p377cbb00} fill="var(--fill-0, #99A0AE)" id="Vector" stroke="var(--stroke-0, #99A0AE)" strokeWidth="0.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[11.35%_10%_11.22%_8.68%]" data-name="Group">
      <Group2 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[11.35%_10%_11.22%_8.68%]" data-name="Group">
      <Group1 />
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-[rgba(65,63,63,0.5)] relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[10px] px-[10px] relative size-full">
        <div className="relative shrink-0 size-[20px]" data-name="House">
          <Group />
        </div>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="flex-[938.438_0_0] h-[39px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start not-italic relative size-full whitespace-nowrap">
        <p className="font-['Inter_Tight:Medium',sans-serif] leading-[18px] relative shrink-0 text-[14px] text-white">Monthly Rent Payment</p>
        <p className="font-['Inter_Tight:Regular',sans-serif] leading-[16px] relative shrink-0 text-[#94a3b8] text-[12px]">Housing • Rent</p>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[6px] size-[18px] top-[6px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3f4e600} id="Vector" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p2aca4e80} id="Vector_2" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p10b1cef0} id="Vector_3" stroke="var(--stroke-0, #717784)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function TransactionRow4() {
  return (
    <div className="bg-[#191b1f] relative rounded-[10px] shrink-0 w-full" data-name="TransactionRow">
      <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[17px] py-[13px] relative w-full">
          <Container16 />
          <Container17 />
          <p className="font-['Inter_Tight:SemiBold',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#df1c41] text-[14px] whitespace-nowrap">-LKR 45,000</p>
          <Button4 />
        </div>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Container">
      <TransactionRow3 />
      <TransactionRow4 />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Container13 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Container">
      <Container4 />
      <Container12 />
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start px-[32px] relative w-full">
          <Container2 />
          <Container3 />
        </div>
      </div>
    </div>
  );
}

function TransactionsPage() {
  return (
    <div className="bg-[#141414] content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px overflow-clip relative w-full" data-name="TransactionsPage">
      <Container />
      <Container1 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#141414] h-[1008px] relative rounded-[12px] shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Topbar />
        <TransactionsPage />
      </div>
      <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-[-1px] pointer-events-none rounded-[13px]" />
    </div>
  );
}

function MainContent() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Main Content">
      <div className="content-stretch flex flex-col items-start p-[8px] relative w-full">
        <Frame5 />
      </div>
    </div>
  );
}

export default function TransactionsHistory() {
  return (
    <div className="bg-[#191b1f] content-stretch flex items-center justify-between relative size-full" data-name="Transactions-History">
      <Sidebar />
      <MainContent />
    </div>
  );
}