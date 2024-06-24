"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Create = () => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [roomUrl, setRoomUrl] = useState('');
  const router = useRouter();

  const createGame = async () => {
    try {
      const response = await axios.post('http://localhost:5000/start');
      const { room_id } = response.data;
      const url = `http://localhost:3000/route/${room_id}?username=${username}`;
      setRoomId(room_id);
      setRoomUrl(url);
      router.push(url);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const joinGame = () => {
    const url = `http://localhost:3000/route/${roomId}?username=${username}`;
    router.push(url);
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
  <div className="h-32 rounded-lg">
  <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mt-4 p-2 border rounded"
      />
  </div>
  <div className="h-32 rounded-lg">

  <div className="mt-4">

        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="ml-4 p-2 border rounded"
        />
        <div className="flex my-5 gap-5">
        <button onClick={joinGame} className="ml-4 px-4 py-2 bg-green-500 text-white rounded">
          Join Game
        </button>
        <button onClick={createGame} className="px-4 py-2 bg-blue-500 text-white rounded">
          Create Game
        </button>
        </div>

      </div>
  </div>
</div>

    </div>
  );
};

export default Create;
