// import React from "react";
// import Header from "../components/header-footer/Header";
// import { Page } from "../components/ui/Page";

// const Layout = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <div>
//       <Header />
//       <Page>{children}</Page>
//     </div>
//   );
// };

// export default Layout;
import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/header-footer/Header"; // adjust path

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // Routes where header should be hidden
  const hideHeaderRoutes = ["/login", "/signup"];

  const hideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header />}
      <main>{children}</main>
    </>
  );
};

export default Layout;
