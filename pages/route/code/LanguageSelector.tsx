import { LANGUAGE_VERSIONS } from "@/lib/constants";
import React from "react";

const languages = Object.entries(LANGUAGE_VERSIONS);

interface LanguageSelectorProps {
  language: string;
  onSelect: (language: string) => void;
}

const LanguageSelector = ({ language, onSelect }: LanguageSelectorProps) => {
  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.target.value);
  };

  return (
    <form className="max-w-sm ">
      <label
        htmlFor="languages"
        className="block mb-2 text-sm font-medium text-white dark:text-white"
      >
        Select Language
      </label>
      <select
        id="languages"
        value={language}
        onChange={handleSelectionChange}
        className="bg-navbarColors border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option disabled value="">
          Choose a language
        </option>
        {languages.map(([lang]) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </form>
  );
};

export default LanguageSelector;
