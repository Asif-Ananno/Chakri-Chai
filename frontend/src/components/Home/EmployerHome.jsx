import React from "react";
import { useContext } from "react";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import PopularCategories from "./PopularCategories";
import PopularCompanies from "./PopularCompanies";

const EmployerHome = () => {
  const { isAuthorized, setIsAuthorized } = useContext(Context);

  // Redirect to login page if user is not authorized
  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }
 

  return (
    <>
      <section className="homePage page">
        <HeroSection />
        <HowItWorks />
        <PopularCategories />
        <PopularCompanies />
      </section>
    </>
  );
};

export default EmployerHome
