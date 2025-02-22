import React from "react";
import {
  FormComponentProps,
  SurveyFormData,
  titleAge,
  titleCancel,
  titleEmail,
  titleName,
  titlePersonal,
  titleSubmit,
  pointCategories
} from "../lib/defaults";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebaseConfig.js";
import { useState, ChangeEvent, FormEvent } from "react";
import ResultPopup from "./ResultPopup";

export default function Form({ survey }: FormComponentProps) {
  const [formData, setFormData] = useState<SurveyFormData>({
    name: "",
    email: "",
    age: "",
    responses: {}
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (
    sectionTitle: string,
    questionId: string,
    value: string,
    points: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      responses: {
        ...prev.responses,
        [sectionTitle]: {
          ...prev.responses[sectionTitle],
          [questionId]: { answer: value, points: points }
        }
      }
    }));
  };

  const [isResultPopupOpen, setIsResultPopupOpen] = useState(false);
  const [flowerType, setflowerType] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "users"), formData);
      const userType = determineUserType(formData.responses);

      setflowerType(userType);

      setIsResultPopupOpen(true);
      setFormData({ name: "", email: "", age: "", responses: {} }); // Reset form
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  const handleResultPopupClose = () => {
    setIsResultPopupOpen(false);
  };

  const determineUserType = (
    responses: Record<
      string,
      Record<string, { answer: string; points: number }>
    >
  ) => {
    let totalPoints = 0;
    Object.values(responses).map((response) => {
      Object.values(response).map((answer) => {
        totalPoints += answer.points;
      });
    });

    const categories = pointCategories();
    if (totalPoints < categories.A) return "A";
    if (totalPoints < categories.B) return "B";
    if (totalPoints < categories.C) return "C";
    return "D";
  };

  return (
    <>
      <ResultPopup
        isOpen={isResultPopupOpen}
        onClose={handleResultPopupClose}
        flowerType={flowerType}
      />
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h3 className="text-base/7 font-semibold text-gray-900">
                {titlePersonal}
              </h3>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-4">
                <label
                  htmlFor="name"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  {titleName}
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-pink-500 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  {titleEmail}
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-pink-500 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="age"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  {titleAge}
                </label>
                <div className="mt-2">
                  <input
                    id="age"
                    name="age"
                    type="text"
                    value={formData.age}
                    onChange={handleChange}
                    className="block w-1/5 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-pink-500 sm:text-sm/6"
                  />
                </div>
              </div>
            </div>
          </div>
          {survey.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3"
            >
              <div>
                <h3 className="text-base/7 font-semibold text-gray-900">
                  {section.title}
                </h3>
              </div>

              <div className="max-w-2xl space-y-10 md:col-span-2">
                {section.questions.map((question) => (
                  <fieldset key={question.id}>
                    <legend className="text-sm/6 font-semibold text-gray-900">
                      {question.question}
                    </legend>
                    <div className="mt-6 space-y-6">
                      {question.answers.map((answer, index) => (
                        <div key={index} className="flex items-center gap-x-3">
                          <input
                            id={`${sectionIndex}-${question.id}-${index}`}
                            name={question.id}
                            type="radio"
                            value={answer.answer}
                            checked={
                              formData.responses[section.title]?.[question.id]
                                ?.answer === answer.answer
                            }
                            onChange={() =>
                              handleRadioChange(
                                section.title,
                                question.id,
                                answer.answer,
                                answer.points
                              )
                            }
                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-pink-600 checked:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                          />
                          <label
                            htmlFor={`${sectionIndex}-${question.id}-${index}`}
                            className="block text-sm/6 font-medium text-gray-900"
                          >
                            {answer.answer}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-6 mb-20 flex items-center justify-end gap-x-6">
            <button
              type="button"
              onClick={() =>
                setFormData({ name: "", email: "", age: "", responses: {} })
              }
              className="text-sm/6 font-semibold text-gray-900"
            >
              {titleCancel}
            </button>
            <button
              type="submit"
              className="rounded-md bg-pink-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
              {titleSubmit}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
