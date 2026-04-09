import { ReactNode } from 'react';
import { Sidebar, SidebarLink, ChatLink } from './Sidebar';
import { Topbar, User } from './Topbar';

interface MainLayoutProps {
  children: ReactNode;
  user: User;
  sidebarLinks: {
    main: SidebarLink[];
    secondary?: SidebarLink[];
    bottom?: SidebarLink[];
  };
  chatLinks?: ChatLink[];
  activeSidebarLink?: string;
  onSidebarLinkClick?: (linkId: string) => void;
  onAddTransaction?: () => void;
  onUserMenuClick?: () => void;
  onNewChat?: () => void;
}

export function MainLayout({
  children,
  user,
  sidebarLinks,
  chatLinks,
  activeSidebarLink,
  onSidebarLinkClick,
  onAddTransaction,
  onUserMenuClick,
  onNewChat,
}: MainLayoutProps) {
  return (
    <div className="flex h-screen w-screen bg-[#191b1f] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        mainLinks={sidebarLinks.main}
        secondaryLinks={sidebarLinks.secondary}
        bottomLinks={sidebarLinks.bottom}
        chatLinks={chatLinks}
        activeLink={activeSidebarLink}
        onLinkClick={onSidebarLinkClick}
        onNewChat={onNewChat}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden p-[8px]">
        {/* Inner Frame */}
        <div className="flex-1 bg-[#141414] border border-[#2e2f33] rounded-[12px] flex flex-col overflow-hidden relative">
          {/* Topbar */}
          <Topbar
            user={user}
            onAddTransaction={onAddTransaction}
            onUserMenuClick={onUserMenuClick}
          />
          
          {/* Content */}
          <main className="flex-1 overflow-auto relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}