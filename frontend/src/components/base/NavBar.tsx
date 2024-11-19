import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <>
      <Link to="/"> Home </Link>
      <Link to="/survey-editor"> Survey editor </Link>
      <Link to="/surveys"> Surveys </Link>
      <Link to="/about"> About Us </Link>
    </>
  );
};
export default NavBar;
