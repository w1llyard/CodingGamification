import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

interface ExecuteCodeResponse {
  run: {
    output: any;
    stdout: string;
    stderr: string;
  };
}

export const executeCode = async (language: string, sourceCode: string): Promise<ExecuteCodeResponse> => {
  const response = await API.post<ExecuteCodeResponse>("/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: sourceCode,
      },
    ],
  });
  return response.data;
};
