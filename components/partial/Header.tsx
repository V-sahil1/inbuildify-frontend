import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  IconMoonStars,
  IconLayoutGrid,
  IconUser,
  IconArrowBigLeftFilled,
  IconPlus,
} from '@tabler/icons-react';
import { profile_av } from '../../public/images';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { logoutThunk } from '@redux/feature/auth/authThunk';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import SystemRoutes from '@lib/constants/Routes';
import ConfirmationModal from '../common/ConfirmationModal';
import { persister, RootState } from '@redux/feature/store';
import { logout } from '@redux/feature/auth/authSlice';
import { themeContext } from 'contexts/ThemeContext';
import { createMenuGridItems, gridMenuItems, gridMenuItems2 } from 'data/headerMenuConstants';
import { CreateFormModal } from '../common/Models/CreateFormModel';
import leadCreateFields from '../formFields/LeadCreateFields';
import { JobCreationModal } from '../common/Models/JobModal';
import { CreateTaskModal } from '../common/Models/CreatetaskModel';
import { CreateAppointmentModal } from '../common/Models/createAppointementModel';

export default function Header({
  toggleMobileNav,
  mobileNav,
  toggleNote,
  toggleChat,
  containerToggle,
  container,
}: {
  toggleMobileNav: () => void;
  mobileNav: boolean;
  toggleNote: () => void;
  toggleChat: () => void;
  containerToggle: () => void;
  container: boolean;
}) {
  // mini sidebar
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [miniSidebar, setMiniSidebar] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [isGridDropdownOpen, setIsGridDropdownOpen] = useState(false);
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const gridDropdownRef = useRef<HTMLDivElement>(null);
  const createDropdownRef = useRef<HTMLDivElement>(null);
  const [isLogoutLoading, setIsLogoutLoading] = useState<boolean>(false);
  const [createMenuOpen, setCreateMenuOpen] = useState<string>('');
  const leadfields = leadCreateFields({
    isEmailDisable: false,
  });
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    const sidebarElement = document.querySelector('.admin-wrapper');
    if (sidebarElement) {
      if (miniSidebar) {
        sidebarElement.classList.add('mini-sidebar');
      } else {
        sidebarElement.classList.remove('mini-sidebar');
      }
    }
  }, [miniSidebar]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (gridDropdownRef.current && !gridDropdownRef.current.contains(event.target as Node)) {
        setIsGridDropdownOpen(false);
      }

      if (createDropdownRef.current && !createDropdownRef.current.contains(event.target as Node)) {
        setIsCreateDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleGridDropdown = () => {
    setIsGridDropdownOpen(!isGridDropdownOpen);
  };

  const toggleCreateDropdown = () => {
    setIsCreateDropdownOpen(!isCreateDropdownOpen);
  };
  // light dark mode
  const { toggleTheme } = useContext(themeContext);
  const toggleDarkMode = () => {
    toggleTheme();
  };

  // page header setting
  const [headerFix, setHeaderFix] = useState(true);

  // search bar open
  const [searchBar, setSearchBar] = useState<boolean>(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setSearchBar(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [searchBar]);

  const handleSignOut = async () => {
    try {
      setIsLogoutLoading(true);
      const response = await dispatch(logoutThunk()).unwrap();
      message.success(response);
      dispatch(logout());
      persister.purge();
      router.push(SystemRoutes.LOGIN);
      setIsLogoutModalOpen(false);
    } catch (e) {
      message.error(e);
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const handleJobSubmit = () => {
    setCreateMenuOpen('');
  };

  const handleTaskSubmit = () => {
    setCreateMenuOpen('');
  };
  const renderCreateModal = () => {
    switch (createMenuOpen) {
      case 'lead':
        return (
          <CreateFormModal
            title="Lead"
            open={true}
            loading={false}
            onCancel={() => setCreateMenuOpen('')}
            onSubmit={() => {}}
            fields={leadfields}
          />
        );
      case 'job':
        return (
          <JobCreationModal
            open={true}
            isEditing={false}
            initialValues={undefined}
            onClose={() => setCreateMenuOpen('')}
            onSubmit={handleJobSubmit}
          />
        );
      case 'task':
        return (
          <CreateTaskModal
            open={true}
            onClose={() => setCreateMenuOpen('')}
            title="Create Task"
            loading={false}
            onSubmit={handleTaskSubmit}
            initialData={undefined}
          />
        );
      case 'appointment':
        return (
          <CreateAppointmentModal
            open={true}
            onClose={() => setCreateMenuOpen('')}
            title="Create Appointment"
            loading={false}
            onSubmit={handleTaskSubmit}
            initialData={undefined}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        className={`md:py-4 md:px-6 sm:p-3 py-3 border-b-4 border-card-color bg-body-color ${
          headerFix ? 'sticky top-0 z-[11] xl:shadow-none shadow-lg' : ''
        }`}
      >
        <div className="container-fluid flex items-center">
          <div className="flex items-center gap-3 sm:pe-4 pe-2">
            <button
              onClick={() => router.back()}
              className="sm:flex hidden items-center justify-center w-[36px] h-[36px] min-w-[36px] text-primary bg-primary-10 rounded-full"
            >
              <IconArrowBigLeftFilled
                className={`transition-all ${
                  miniSidebar ? 'rotate-180 rtl:rotate-0' : 'rotate-0 rtl:rotate-180'
                }`}
              />
            </button>
            {/* <Link href="/"> 
              <Image src="/company-light.webp" alt="logo" width={100} height={100} />
         </Link>   */}
          </div>
          <div className="relative px-4 flex-1 md:block hidden">{/* <TopMenuBar /> */}</div>
          <div className="flex items-center ms-auto">
            <div className="relative" ref={createDropdownRef}>
              <button
                onClick={toggleCreateDropdown}
                className="md:py-2 md:px-3 p-2 hover:bg-primary-10 transition-all duration-300"
              >
                <IconPlus className="stroke-[1.5] xl:w-[24px] xl:h-[24px] w-[20px] h-[20px]" />
              </button>
              {isCreateDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-100">
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                      CREATE
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {createMenuGridItems.map(item => (
                        <button
                          key={item.id}
                          onClick={() => setCreateMenuOpen(item?.key)}
                          className="flex flex-col items-center justify-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-md"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="relative" ref={gridDropdownRef}>
              <button
                onClick={toggleGridDropdown}
                className="md:py-2 md:px-3 p-2 hover:bg-primary-10 transition-all duration-300"
              >
                <IconLayoutGrid className="stroke-[1.5] xl:w-[24px] xl:h-[24px] w-[20px] h-[20px]" />
              </button>

              {isGridDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[500px] bg-white rounded-md shadow-lg overflow-hidden z-50">
                  <div className="max-h-[70vh] flex flex-col">
                    {/* First Section */}
                    <div className="p-3 border-b border-gray-200">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-2">
                        Quick Links
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {gridMenuItems.map(item => (
                          <Link
                            key={item.id}
                            href={item.href}
                            className="flex items-center px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            {item.icon}
                            <span className="ml-2">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Second Section */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-3">
                        {/* this functionality need to add dont remove the code */}

                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-2">
                          Administration
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          {gridMenuItems2.map(item => (
                            <Link
                              key={item.id}
                              href={item.href}
                              className="flex items-center px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              {item.icon}
                              <span className="ml-2">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={toggleDarkMode}
              className="md:py-2 md:px-3 p-2 hover:bg-primary-10 transition-all duration-300"
            >
              <IconMoonStars className="stroke-[1.5] xl:w-[24px] xl:h-[24px] w-[20px] h-[20px]" />
            </button>
            <div className="relative group flex">
              <button className="md:px-3 px-2">
                <Image
                  src={profile_av}
                  alt="profile"
                  width="36"
                  height="36"
                  className="w-[36px] h-[36px] min-w-[36px] bg-white shadow-shadow-lg p-1 rounded-full saturate-50 transition-all hover:filter-none"
                />
              </button>
              <div className="bg-card-color text-font-color rounded-xl overflow-hidden md:w-[240px] w-[calc(100%-30px)] shadow-shadow-lg md:absolute fixed md:right-0 right-15 md:top-full top-[55px] origin-top-right z-[1] opacity-0 invisible scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:scale-100">
                <div className="p-4 border-b border-border-color">
                  <div className="font-semibold">{user?.name}</div>
                  <div className="text-font-color-100 truncate">{user?.email}</div>
                </div>
                <div className="p-1 m-1 custom-scrollbar overflow-auto max-h-[calc(80svh-163px)]">
                  <Link
                    href={SystemRoutes.MY_PROFILE}
                    className="py-2 px-4 flex items-center gap-3"
                  >
                    <IconUser className="w-[16px] h-[16px]" />
                    My Profile
                  </Link>
                  {/* <Link href={SystemRoutes.SETTING} className="py-2 px-4 flex items-center gap-3">
                    <IconSettings className="w-[16px] h-[16px]" />
                    Settings
                  </Link> */}
                </div>
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="bg-secondary uppercase text-[14px]/[20px] text-white py-5 px-10 text-center w-full inline-block"
                >
                  Sign Out
                </button>
              </div>
            </div>
            {/* <button
              onClick={toggleThemeSetting}
              className="md:py-2 md:px-3 p-2 hover:bg-primary-10 transition-all duration-300"
            >
              <IconSettings className="stroke-[1.5] xl:w-[24px] xl:h-[24px] w-[20px] h-[20px]" />
            </button> */}
            <button
              className={`md:py-2 md:px-3 p-2 hover:bg-primary-10 transition-all duration-300 xl:hidden hamburger-menu ${
                mobileNav ? 'opened' : ''
              }`}
              onClick={toggleMobileNav}
            >
              <svg width="20" height="20" viewBox="0 0 100 100">
                <path
                  className="line line1"
                  d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
                />
                <path className="line line2" d="M 20,50 H 80" />
                <path
                  className="line line3"
                  d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {createMenuOpen ? renderCreateModal() : null}
      {isLogoutModalOpen && (
        <ConfirmationModal
          open={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleSignOut}
          // title="Logout"
          message="Are you sure you want to logout?"
          type="warning"
          confirmText="Logout"
          cancelText="Cancel"
          loading={isLogoutLoading}
          maxWidth="sm"
        />
      )}
    </>
  );
}
