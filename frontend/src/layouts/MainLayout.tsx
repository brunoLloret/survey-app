import React, { ReactNode } from "react";
import Header from "../components/base/Header";
import Footer from "../components/base/Footer";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};
export default MainLayout;
