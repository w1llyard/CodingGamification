import { GetServerSideProps } from 'next';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import io, { Socket } from 'socket.io-client';
import CodeEditor from './code/CodeEditor';
import Output from './code/Output';
import { editor as monacoEditor } from 'monaco-editor';
import { Problem } from '@/lib/types';

let socket: Socket;

const codingProblems: Problem[] = [
  {
    "problem": "Write a function that returns the sum of two numbers.",
    "test_cases": [["2, 2\n", "4"], ["3, 6\n", "9"], ["4, 4\n", "8"]]
  },
  {
    "problem": "Write a function that checks if a string is a palindrome.",
    "test_cases": [["'madam'\n", "True"], ["'hello'\n", "False"], ["'racecar'\n", "True"]]
  },
  {
    "problem": "Write a function that returns the factorial of a number.",
    "test_cases": [["3\n", "6"], ["5\n", "120"], ["0\n", "1"]]
  },
  {
    "problem": "Write a function that returns the Fibonacci sequence up to n.",
    "test_cases": [["5\n", "0 1 1 2 3"], ["7\n", "0 1 1 2 3 5 8"]]
  },
  {
    "problem": "Write a function that finds the greatest common divisor (GCD) of two numbers.",
    "test_cases": [["48, 18\n", "6"], ["56, 98\n", "14"], ["101, 103\n", "1"]]
  }
];

const generateProblems = (): Problem[] => {
  return codingProblems.sort(() => 0.5 - Math.random()).slice(0, 3);
};

interface MultiplayerProps {
  initialProblems: Problem[];
}

const Multiplayer = ({ initialProblems }: MultiplayerProps) => {
  const router = useRouter();
  const { roomId, username } = router.query;
  const [players, setPlayers] = useState<string[]>([]);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [problems, setProblems] = useState(initialProblems);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(initialProblems[0]);
  const [timer, setTimer] = useState(60);
  const [round, setRound] = useState(1);
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [testResults, setTestResults] = useState<string | null>(null);
  const [output, setOutput] = useState<string[]>([]);
  const editorRef = useRef<monacoEditor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    socket = io('http://localhost:5000');
    socket.emit('join', { room_id: roomId, user: username });

    socket.on('update', (data) => {
      setPlayers(data.players);
      setScores(data.scores);
    });

    socket.on('new_round', (data) => {
      setCurrentProblem(problems[data.round - 1]);
      setTimer(data.timer);
      setRound(data.round);
      setMessage('');
      setTestResults(null);
    });

    socket.on('timer', (data) => {
      setTimer(data.timer);
      if (data.timer === 0) {
        setMessage('Time\'s up!');
      }
    });

    socket.on('game_end', (data) => {
      setMessage(`Game Over! Winner: ${data.winner}`);
      router.push(`/result?winner=${data.winner}`);
    });

    socket.on('test_results', (data) => {
      setTestResults(`Passed ${data.passed_tests} out of ${data.total_tests} tests.`);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, username, problems, round]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 ">
      <h1 className="text-3xl">Room ID: {roomId}</h1>
      <h2 className="text-2xl">Round: {round}</h2>
      <h2 className="text-2xl">Time Left: {timer}</h2>
      <div className="flex flex-row">
        <div className="p-4">
          <h2 className="text-2xl">Players</h2>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{player} - Score: {scores[player]}</li>
            ))}
          </ul>
        </div>
        <div className="p-4">
          <CodeEditor
            editorRef={editorRef}
            value={''}
            setValue={() => {}}
            language={language}
            setLanguage={setLanguage}
          />
          <h2 className="text-2xl">Problem</h2>
          {currentProblem && <p>{currentProblem.problem}</p>}
          {message && <p className="mt-4 text-xl">{message}</p>}
          {testResults && <p className="mt-4 text-xl">{testResults}</p>}
          {currentProblem && (
            <Output
              editorRef={editorRef}
              language={language}
              setOutput={setOutput}
              output={output}
              problem={currentProblem}
              roomId={roomId as string}
              username={username as string}
              socket={socket}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const initialProblems = generateProblems();
  return {
    props: {
      initialProblems,
    },
  };
};

export default Multiplayer;
