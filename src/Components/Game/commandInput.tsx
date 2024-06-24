import React, { useState } from 'react';

interface MovementInputProps {
    onMovement: (movement: string) => void;
}

const MovementInput: React.FC<MovementInputProps> = ({ onMovement }) => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onMovement(inputValue);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Enter movement (e.g., 5R)"
            />
            <button type="submit">Move</button>
        </form>
    );
};

export default MovementInput;
