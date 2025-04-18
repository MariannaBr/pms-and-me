import React from "react";
import Head from "next/head";
import Hero from "../components/Hero";
import Form from "../components/Form";
import {
  title,
  domain,
  formTitle,
  formTitleTime,
  paragraph,
  survey,
  titlePage,
  urlImg300x200
} from "../lib/defaults";
import { InlineWidget } from "react-calendly";

const Homepage: React.FC = () => {
  return (
    <>
      <Head>
        <title>{titlePage}</title>
        <meta name="description" content={paragraph} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={paragraph} />
        <meta property="og:image" content={urlImg300x200} />
        <meta property="og:url" content={domain} />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="bg-white pb-20">
        <Hero />
        <div id="form-section" className="mx-4 py-6 lg:py-20">
          <h2 className="text-pretty text-xl text-center font-semibold tracking-tight text-gray-900 md:text-3xl ">
            {formTitle}
          </h2>
          <p className="text-pretty text-md text-center text-gray-500 mt-1">
            {formTitleTime}
          </p>
        </div>
        {/* Calendly inline widget begin */}
        <InlineWidget url="https://calendly.com/brezinova-marianna/test-meeting" />
        {/* <div
          class="calendly-inline-widget"
          data-url="https://calendly.com/brezinova-marianna/test-meeting"
          style="min-width:320px;height:700px;"
        ></div>
        <script
          type="text/javascript"
          src="https://assets.calendly.com/assets/external/widget.js"
          async
        ></script> */}

        {/*Calendly inline widget end */}
        <div className="flex mx-4 xl:mx-auto justify-center max-w-7xl px-4 py-10 shadow-2xl shadow-teal-200 rounded-2xl">
          <Form survey={survey} />
        </div>
      </div>
    </>
  );
};

export default Homepage;
