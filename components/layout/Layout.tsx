import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '../partial/Footer';
import Header from '../partial/Header';
import Sidebar from '../partial/Sidebar';

export default function Layout({ children }) {
  const router = useRouter();
  const [container, setContainer] = useState(() => {
    // Initialize state from localStorage
    return typeof localStorage !== 'undefined' && localStorage.getItem('container') === 'true';
  });
  const [miniSidebar, setMiniSidebar] = useState(() => {
    return typeof localStorage !== 'undefined' && localStorage.getItem('miniSidebar') === 'true';
  });

  useEffect(() => {
    // Update the container class based on state
    const containerElements = document.querySelectorAll('.container, .container-fluid');
    containerElements.forEach(el => {
      if (container) {
        el.classList.add('container');
        el.classList.remove('container-fluid');
      } else {
        el.classList.add('container-fluid');
        el.classList.remove('container');
      }
    });

    // Update mini sidebar class on the body (and persist)
    document.body.classList.toggle('mini-sidebar', miniSidebar);
    localStorage.setItem('miniSidebar', miniSidebar ? 'true' : 'false');
    localStorage.setItem('container', container ? 'true' : 'false');
  }, [container, miniSidebar, router.pathname]); // Update on container/mini state or pageUrl change

  const containerToggle = () => {
    setContainer(prev => !prev);
  };

  const toggleMiniSidebar = () => {
    setMiniSidebar(prev => !prev);
  };

  const [mobileNav, setMobileNav] = useState(false);
  const toggleMobileNav = () => setMobileNav(prev => !prev);

  const [note, setNote] = useState(false);
  const toggleNote = () => setNote(prev => !prev);

  const [chat, setChat] = useState(false);
  const toggleChat = () => setChat(prev => !prev);

  return (
    <div className={`admin-wrapper overflow-hidden ${miniSidebar ? 'mini-sidebar' : ''}`}>
      <div className="flex h-svh relative">
        <div
          className={`sidebar ${miniSidebar ? 'w-[80px]' : 'sm:w-[240px]'} !border-e-[4px] border-solid border-white ${miniSidebar ? '!min-w-[80px]' : 'sm:min-w-[240px]'} px-2 py-4 overflow-y-scroll flex flex-col custom-scrollbar xl:static fixed xl:h-screen md:h-[calc(100vh-74px)] h:[calc(100vh-64px)] md:top-[74px] top-[64px] z-[51] bg-body-color xl:shadow-none transition-all duration-300 ${mobileNav ? 'shadow-shadow-lg left-0' : '-left-full'} ${miniSidebar ? 'mini-sidebar' : ''}`}
        >
          <Sidebar
            mobileNav={mobileNav}
            setMobileNav={setMobileNav}
            toggleMiniSidebar={toggleMiniSidebar}
            miniSidebar={miniSidebar}
            note={note}
            toggleNote={toggleNote}
            chat={chat}
            toggleChat={toggleChat}
          />
        </div>
        <div className="main flex-1 flex flex-col overflow-auto custom-scrollbar bg-body-color">
          <Header
            toggleMobileNav={toggleMobileNav}
            mobileNav={mobileNav}
            toggleNote={toggleNote}
            toggleChat={toggleChat}
            containerToggle={containerToggle}
            container={container}
          />
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
}
