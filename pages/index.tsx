import React from "react";
import Hero from "../components/Hero";
import Form from "../components/Form";
import { survey } from "../lib/defaults";

const Homepage: React.FC = () => {
  return (
    <div className="bg-white ">
      <Hero />
      <div className="flex mx-auto justify-center max-w-7xl mb-20 px-8 xl:px-0 py-10 shadow-2xl shadow-teal-200 rounded-2xl">
        <Form survey={survey} />
      </div>
    </div>
  );
};

export default Homepage;
