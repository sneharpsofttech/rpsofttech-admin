import React from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "../../pages/Logout";

const Header = () => {
  const location = useLocation();

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
     ${
       location.pathname === path
         ? "underline underline-offset-8 text-blue-600 "
         : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
     }`;

  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between gap-6">
        <div>
        <Link to="/add-blog" className={linkClass("/add-blog")}>
          Add Blog
        </Link>

        <Link to="/blogs" className={linkClass("/blogs")}>
          Blogs
        </Link></div>
        <div>
          <LogoutButton/>
        </div>
      </div>
    </header>
  );
};

export default Header;
