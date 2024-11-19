// Here, see surveys, take survey, see results, go back to surveys

import React from "react";
import List from "../base/List";
import MainLayout from "../../layouts/MainLayout";

const Surveys = () => {
  return (
    <>
      <MainLayout>
        <div>
          <h1> All surveys! </h1>
          <List />
        </div>
      </MainLayout>
    </>
  );
};
export default Surveys;
