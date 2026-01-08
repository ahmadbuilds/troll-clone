import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
