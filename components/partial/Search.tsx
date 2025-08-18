import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
export default function Search() {
  // search bar open
  const [searchBar, setSearchBar] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const toggleSearchBar = () => {
    setSearchBar(true);
  };
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
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [searchBar]);

  return (
    <div ref={searchRef} className="px-4 md:block hidden searchBar">
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter your search key word"
        onClick={toggleSearchBar}
        className={`w-full py-[6px] px-[12px] bg-card-color rounded-md border border-border-color focus:outline-0 ${
          searchBar ? "z-[5] " : ""
        }`}
      />
      <div
        className={`bg-card-color border border-dashed border-border-color text-font-color xl:absolute fixed xl:left-[23px] left-[20px] xl:top-[115px] top-[190px] z-[5] xl:w-[50%] w-[calc(100%-60px)] rounded-xl p-6 transition-all duration-300 origin-top ${
          searchBar
            ? "opacity-1 visible scale-y-100"
            : "opacity-0 invisible scale-y-0"
        }`}
      >
        <p className="text-font-color-100 text-[14px]/[20px] mb-3 uppercase">
          RECENT SEARCHES
        </p>
        <div className="flex gap-2 mb-6 overflow-x-auto ">
          <Link
            href="#"
            className="inline-block p-2 text-white font-semibold bg-danger text-[12px]/[1] rounded-md"
          >
            HRMS Admin
          </Link>
          <Link
            href="#"
            className="inline-block p-2 text-black font-semibold bg-warning text-[12px]/[1] rounded-md"
          >
            Hospital Admin
          </Link>
          <Link
            href="#"
            className="inline-block p-2 text-white font-semibold bg-success text-[12px]/[1] rounded-md"
          >
            Project
          </Link>
          <Link
            href="#"
            className="inline-block p-2 text-white font-semibold bg-info text-[12px]/[1] rounded-md"
          >
            Social App
          </Link>
          <Link
            href="#"
            className="inline-block p-2 text-white font-semibold bg-blue text-[12px]/[1] rounded-md"
          >
            University Admin
          </Link>
        </div>
        <p className="text-font-color-100 text-[14px]/[20px] mb-3 uppercase">
          SUGGESTIONS
        </p>
        <div className="flex flex-col border border-border-color rounded-xl overflow-hidden">
          <Link
            href="#"
            className="py-10 px-15 border-b border-dashed border-border-color transition hover:bg-primary-10"
          >
            <div className="font-bold mb-5">Cras justo odio</div>
            <p className="text-[14px]/[20px] text-font-color-100">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </Link>
          <Link
            href="#"
            className="py-10 px-15 border-b border-dashed border-border-color transition hover:bg-primary-10"
          >
            <div className="font-bold mb-5">Date Range Picker</div>
            <p className="text-[14px]/[20px] text-font-color-100">
              There are many variations of passages of Lorem Ipsum available
            </p>
          </Link>
          <Link
            href="#"
            className="py-10 px-15 border-b border-dashed border-border-color transition hover:bg-primary-10"
          >
            <div className="font-bold mb-5">Image Input</div>
            <p className="text-[14px]/[20px] text-font-color-100">
              It is a long established fact that a reader will be distracted
            </p>
          </Link>
          <Link
            href="#"
            className="py-10 px-15 border-b border-dashed border-border-color transition hover:bg-primary-10"
          >
            <div className="font-bold mb-5">DataTables for jQuery</div>
            <p className="text-[14px]/[20px] text-font-color-100">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </Link>
          <Link href="#" className="py-10 px-15 transition hover:bg-primary-10">
            <div className="font-bold mb-5">Development Setup</div>
            <p className="text-[14px]/[20px] text-font-color-100">
              Contrary to popular belief, Lorem Ipsum is not simply random text.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
