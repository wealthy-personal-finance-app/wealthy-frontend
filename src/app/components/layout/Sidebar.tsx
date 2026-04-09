import svgPaths from "../../../imports/TransactionsHistory/svg-pq2oaob5wk";
import { SquarePen } from 'lucide-react';

export interface SidebarLink {
  id: string;
  label: string;
  icon: 'home' | 'bot' | 'cash-flow' | 'list' | 'target' | 'folder' | 'help' | 'settings';
  href: string;
}

export interface ChatLink {
  id: string;
  label: string;
}

interface SidebarProps {
  activeLink?: string;
  mainLinks: SidebarLink[];
  secondaryLinks?: SidebarLink[];
  bottomLinks?: SidebarLink[];
  chatLinks?: ChatLink[];
  onLinkClick?: (linkId: string) => void;
  onNewChat?: () => void;
}

function SidebarIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'home':
      return (
        <div className="overflow-clip relative shrink-0 size-[20px]">
          <div className="absolute inset-[12.5%_16.25%]">
            <div className="absolute inset-[-5%_-5.56%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 16.5">
                <path d={svgPaths.p2506cf00} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-[12.5%] left-[38.75%] right-[38.75%] top-1/2">
            <div className="absolute inset-[-10%_-16.67%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 9">
                <path d="M0.75 8.25V0.75H5.25V8.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      );
    case 'bot':
      return (
        <div className="overflow-clip relative shrink-0 size-[20px]">
          <div className="absolute bottom-[66.67%] left-[33.33%] right-1/2 top-[16.67%]">
            <div className="absolute inset-[-22.5%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.83333 4.83333">
                <path d="M4.08333 4.08333V0.75H0.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[33.33%_16.67%_16.67%_16.67%]">
            <div className="absolute inset-[-7.5%_-5.63%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8333 11.5">
                <path d={svgPaths.p1fe7ba50} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[58.33%_83.33%_41.67%_8.33%]">
            <div className="absolute inset-[-0.75px_-45%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.16667 1.5">
                <path d="M0.75 0.75H2.41667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[58.33%_8.33%_41.67%_83.33%]">
            <div className="absolute inset-[-0.75px_-45%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.16667 1.5">
                <path d="M0.75 0.75H2.41667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[54.17%_37.5%_37.5%_62.5%]">
            <div className="absolute inset-[-45%_-0.75px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.5 3.16667">
                <path d="M0.75 0.75V2.41667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[54.17%_62.5%_37.5%_37.5%]">
            <div className="absolute inset-[-45%_-0.75px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.5 3.16667">
                <path d="M0.75 0.75V2.41667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      );
    case 'cash-flow':
      return (
        <div className="overflow-clip relative shrink-0 size-[20px]">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[10.4px] left-1/2 top-[calc(50%-0.4px)] w-[12.4px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.5 13">
              <path d={svgPaths.p1942b670} fill="currentColor" />
            </svg>
          </div>
        </div>
      );
    case 'list':
      return (
        <div className="overflow-clip relative shrink-0 size-[20px]">
          <div className="absolute inset-[72.5%_16.25%_27.5%_35%]">
            <div className="absolute inset-[-0.94px_-9.62%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.625 1.875">
                <path d="M0.9375 0.9375H10.6875" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.875" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[72.5%_83.72%_27.5%_16.25%]">
            <div className="absolute inset-[-0.94px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.88167 1.875">
                <path d="M0.9375 0.9375H0.944167" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.875" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-1/2 left-[35%] right-[16.25%] top-1/2">
            <div className="absolute inset-[-0.75px_-7.69%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.25 1.5">
                <path d="M0.75 0.75H10.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-1/2 left-[16.25%] right-[83.72%] top-1/2">
            <div className="absolute inset-[-0.75px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.50667 1.5">
                <path d="M0.75 0.75H0.756667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[27.5%_16.25%_72.5%_35%]">
            <div className="absolute inset-[-0.75px_-7.69%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.25 1.5">
                <path d="M0.75 0.75H10.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[27.5%_83.72%_72.5%_16.25%]">
            <div className="absolute inset-[-0.75px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.50667 1.5">
                <path d="M0.75 0.75H0.756667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      );
    case 'target':
      return (
        <div className="overflow-clip relative shrink-0 size-[20px]">
          <div className="absolute inset-[37.5%]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
              <path d={svgPaths.p3b29e480} fill="currentColor" opacity="0.12" />
            </svg>
          </div>
          <div className="absolute inset-[8.33%]">
            <div className="absolute inset-[-4.5%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1667 18.1667">
                <path d={svgPaths.p1b352380} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      );
    case 'folder':
      return (
        <div className="overflow-clip relative shrink-0 size-[20px]">
          <div className="absolute inset-[16.25%_12.5%]">
            <div className="absolute inset-[-5.56%_-5%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 15">
                <path d={svgPaths.p16b03080} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      );
    case 'help':
      return (
        <div className="overflow-clip relative shrink-0 size-[20px]">
          <div className="absolute inset-[12.5%]">
            <div className="absolute inset-[-5%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 16.5">
                <path d={svgPaths.p37c15d80} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-[31.25%] left-1/2 right-[49.97%] top-[68.75%]">
            <div className="absolute inset-[-0.75px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.50667 1.5">
                <path d="M0.75 0.75H0.756667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[31.23%_39.05%_46.25%_39.09%]">
            <div className="absolute inset-[-16.65%_-17.15%_-16.66%_-17.16%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87271 6.00356">
                <path d={svgPaths.p2fab6600} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      );
    case 'settings':
      return (
        <div className="overflow-clip relative shrink-0 size-[20px]">
          <div className="absolute inset-[38.75%]">
            <div className="absolute inset-[-16.67%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
                <path d={svgPaths.p93ea200} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[8.75%]">
            <div className="absolute inset-[-4.55%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                <path d={svgPaths.p25c32890} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

function WealthyLogo() {
  return (
    <div className="flex gap-[6px] items-center">
      <div className="bg-[#064e3b] overflow-clip relative rounded-[12px] shrink-0 size-[40px]">
        <div className="absolute left-0 overflow-clip size-[40px] top-0">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[24px] top-1/2">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <g>
                <g filter="url(#filter0_i_3_3011)">
                  <path d={svgPaths.p23f4d000} fill="#F5F5F5" />
                </g>
                <g filter="url(#filter1_i_3_3011)">
                  <path d={svgPaths.p22496d80} fill="#F5F5F5" />
                </g>
                <path d={svgPaths.p11000980} fill="#F5F5F5" />
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
        </div>
      </div>
      <p className="text-[20px] leading-[26px] text-white font-medium">
        Wealthy
      </p>
    </div>
  );
}

export function Sidebar({ activeLink, mainLinks, secondaryLinks, bottomLinks, chatLinks, onLinkClick, onNewChat }: SidebarProps) {
  const handleLinkClick = (linkId: string) => {
    if (onLinkClick) {
      onLinkClick(linkId);
    }
  };

  return (
    <div className="bg-[#191b1f] flex flex-col h-full w-[280px]">
      {/* Header */}
      <div className="px-[16px] py-[20px]">
        <WealthyLogo />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between px-[16px] pb-[16px] overflow-y-auto">
        {/* Main Navigation */}
        <div className="flex flex-col gap-[16px]">
          {/* Menu Section */}
          <div className="flex flex-col gap-[8px]">
            <div className="pl-[12px]">
              <p className="caption text-[#99a0ae]">Menu</p>
            </div>
            <div className="flex flex-col gap-[4px]">
              {mainLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`
                    flex items-center gap-[8px] px-[12px] py-[8px] rounded-[8px] w-full text-left transition-colors cursor-pointer
                    ${activeLink === link.id 
                      ? 'bg-[rgba(65,63,63,0.5)] border border-[#2e2f33] text-white' 
                      : 'text-[#717784] hover:bg-[rgba(65,63,63,0.3)]'
                    }
                  `}
                >
                  <SidebarIcon icon={link.icon} />
                  <span className="flex-1 text-system-label">
                    {link.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Section (if provided) */}
          {secondaryLinks && secondaryLinks.length > 0 && (
            <div className="flex flex-col gap-[8px]">
              {secondaryLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className="flex items-center gap-[8px] px-[12px] py-[8px] rounded-[8px] w-full text-left text-[#717784] hover:bg-[rgba(65,63,63,0.3)] transition-colors cursor-pointer"
                >
                  <SidebarIcon icon={link.icon} />
                  <span className="flex-1" style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', lineHeight: '18px' }}>
                    {link.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Separator and Chats Section */}
          {activeLink === 'ai-assistant' && (
            <>
              <div className="h-[1px] bg-[#2e2f33]" />
              <div className="flex flex-col gap-[12px]">
                <button
                  onClick={onNewChat}
                  className="flex items-center gap-[8px] px-[12px] py-[8px] rounded-[8px] w-full text-left text-[#717784] hover:bg-[rgba(65,63,63,0.3)] transition-colors cursor-pointer"
                >
                  <div className="overflow-clip relative shrink-0 size-[20px] flex items-center justify-center">
                    <SquarePen className="w-[18px] h-[18px] text-[#717784]" />
                  </div>
                  <span className="flex-1" style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', lineHeight: '18px' }}>
                    New Chat
                  </span>
                </button>
                <div className="flex flex-col gap-[4px]">
                  <div className="pl-[12px]">
                    <p className="caption text-[#99a0ae] mb-[4px]">Recent Chats</p>
                  </div>
                  <div className="flex flex-col gap-[0px]">
                    {chatLinks?.map((chat) => (
                      <button
                        key={chat.id}
                        className="w-full text-left py-[8px] px-[12px] rounded-[8px] text-[#717784] hover:bg-[rgba(65,63,63,0.3)] transition-colors cursor-pointer"
                      >
                        <p className="font-['Inter_Tight'] text-[14px] leading-[18px] w-[224px] overflow-hidden text-ellipsis whitespace-nowrap">
                          {chat.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Navigation */}
        {bottomLinks && bottomLinks.length > 0 && (
          <div className="flex flex-col gap-[4px] mt-4">
            {bottomLinks.map((link) => (
               <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="flex items-center gap-[8px] px-[12px] py-[8px] rounded-[8px] w-full text-left text-[#717784] hover:bg-[rgba(65,63,63,0.3)] transition-colors cursor-pointer"
              >
                <SidebarIcon icon={link.icon} />
                <span className="flex-1" style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', lineHeight: '18px' }}>
                  {link.label}
                </span>
                {link.icon === 'settings' && (
                  <div className="overflow-clip relative shrink-0 size-[20px]">
                    <div className="absolute inset-[32%_41%]">
                      <div className="absolute inset-[-13.02%_-26.04%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.475 9.075">
                          <path d={svgPaths.p2eec8980} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.875" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}