'use client';
import React, { useState, useEffect } from 'react';

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Fetch questions from JSON file
    fetch('/questions.json')
      .then((response) => response.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleAnswerSelection = (answer: string) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newSelectedAnswers);
    const isCorrect = answer === questions[currentQuestionIndex].answer;
    setIsAnswerCorrect(isCorrect);
    if (isCorrect) {
      setScore(prevScore => prevScore += 1);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setIsAnswerCorrect(null); // Reset correctness for the next question
  };

  const handleShowResults = () => {
    setShowResults(true);
  };

  return (
    <div className="flex flex-col items-center p-4">
      {!showResults ? (
        questions.length > 0 && (
          <div className="w-full max-w-2xl ">
            <h2 className="text-2xl font-bold mb-4">Question {currentQuestionIndex + 1}</h2>
            <p className="text-lg mb-4">{questions[currentQuestionIndex].question}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  className={`p-2 border rounded ${
                    selectedAnswers[currentQuestionIndex] === option ? 'bg-red-500 text-white' : 'bg-black'
                  }`}
                  onClick={() => handleAnswerSelection(option)}
                  disabled={selectedAnswers[currentQuestionIndex] !== undefined}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mb-4">
              {isAnswerCorrect !== null && (
                <p className={`text-lg ${isAnswerCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {isAnswerCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${questions[currentQuestionIndex].answer}`}
                </p>
              )}
            </div>
            <div className="flex justify-between">
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  className="bg-black text-white p-2 rounded"
                  onClick={handleNextQuestion}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                >
                  Next
                </button>
              ) : (
                <button
                  className="bg-green-500 text-white p-2 rounded"
                  onClick={handleShowResults}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                >
                  Show Results
                </button>
              )}
            </div>
          </div>
        )
      ) : (
        <div className="w-full max-w-2xl bg-black p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Results</h2>
          <p className="text-lg mb-4">Your score: {score} out of {questions.length}</p>
          {questions.map((question, index) => (
            <div key={index} className="mb-4 text-white">
              <p className="text-lg">{question.question}</p>
              <p className="text-sm">Your answer: {selectedAnswers[index]}</p>
              <p className="text-sm">Correct answer: {question.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quiz;
