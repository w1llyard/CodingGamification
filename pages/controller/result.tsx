import { useRouter } from 'next/router';

const Result = () => {
  const router = useRouter();
  const { winner } = router.query;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Game Over</h1>
      {winner === "It's a tie!" ? (
        <h2 className="text-2xl mt-4">{"It's a tie!"}</h2>
      ) : (
        <h2 className="text-2xl mt-4">Winner: {winner}</h2>
      )}
      <button
        onClick={() => router.push('/')}
        className="mt-8 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Play Again
      </button>
    </div>
  );
};

export default Result;
