// import React from "react";
// import "./App.css";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import MainLayout from "./layouts/MainLayout";
// import Home from "./components/pages/Home";
// import SurveyEditor from "./components/pages/SurveyEditor";
// import Surveys from "./components/pages/Surveys";
// import About from "./components/pages/About";

// function App() {
//   return (
//     <>
//       <BrowserRouter>
//         <MainLayout>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/survey-editor" element={<SurveyEditor />} />
//             <Route path="/surveys" element={<Surveys />} />
//             <Route path="/about" element={<About />} />
//           </Routes>
//         </MainLayout>
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import SurveyEditor from "./components/pages/SurveyEditor";
import Surveys from "./components/pages/Surveys";
import About from "./components/pages/About";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/survey-editor" element={<SurveyEditor />} />
          <Route path="/surveys" element={<Surveys />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
