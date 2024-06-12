import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import './word.css'; // Ensure this path is correct

const WORDS = [
    "kiwi",
    "PineApple",
    "Apple",
    "NodeJs",
    "Developer",
    "Fruit",
    "Induction",
    "peanut",
    "Vegetable",
    "Potato",
    "Peas",
    "spices",
    "utensil",
    "plate",
    "chips",
    "garlic",
    "ginger",
    "Foodle"
];

function WordScramble() {
    const [correctWord, setCorrectWord] = useState('');
    const [scrambledWord, setScrambledWord] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [isPlayOn, setIsPlayOn] = useState(false);
    const [message, setMessage] = useState('');
    const [className, setClassName] = useState('');
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [numSwaps, setNumSwaps] = useState(1);
    const [maxLevel, setMaxLevel] = useState(0);
    const [maxScore, setMaxScore] = useState(0);

    useEffect(() => {
        // Reset max score and level when the component mounts
        localStorage.setItem('maxScore', 0);
        localStorage.setItem('maxLevel', 0);
    }, []);

    const selectWord = () => {
        const radIndex = Math.floor(Math.random() * WORDS.length);
        return WORDS[radIndex];
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value.toUpperCase());
    };

    const handleClick = (e) => {
        e.preventDefault();

        if (inputValue !== "") {
            if (correctWord === inputValue) {
                setMessage('Correct Answer!');
                setClassName('bg-green-400');
                const newScore = score + 1;
                setScore(newScore);

                if (newScore > maxScore) {
                    setMaxScore(newScore);
                    localStorage.setItem('maxScore', newScore);
                }

                if (newScore % 10 === 0) {
                    const newLevel = level + 1;
                    setLevel(newLevel);
                    setNumSwaps(numSwaps + 1);
                }

                if (level > maxLevel) {
                    setMaxLevel(level);
                    localStorage.setItem('maxLevel', level);
                }

                setInputValue('');
                const word = selectWord();
                setCorrectWord(word.toUpperCase());
                setScrambledWord(constructScrambledWord(word));

            } else {
                setMessage('Wrong Answer!');
                setClassName('bg-red-400');
                setInputValue('');
            }
        } else {
            setMessage('Write a Word!');
            setClassName('bg-yellow-400');
        }
    };

    const constructScrambledWord = (word) => {
        const shuffledArray = word.split('');
        for (let i = 0; i < numSwaps; i++) {
            const idx1 = Math.floor(Math.random() * shuffledArray.length);
            const idx2 = Math.floor(Math.random() * shuffledArray.length);
            [shuffledArray[idx1], shuffledArray[idx2]] = [shuffledArray[idx2], shuffledArray[idx1]];
        }
        return shuffledArray.join('');
    };

    const handleStartGame = (e) => {
        e.preventDefault();
        setIsPlayOn(true);
        setInputValue('');
        setMessage('');
        setScore(0); // Reset score when starting a new game
        setNumSwaps(1); // Reset swaps
        setLevel(1); // Reset level
        const word = selectWord();
        setCorrectWord(word.toUpperCase());
        setScrambledWord(constructScrambledWord(word));
    };

    const handleResetScramble = (e) => {
        e.preventDefault();
        setInputValue('');
        setMessage('');
        setScrambledWord(constructScrambledWord(correctWord));
    };

    useEffect(() => {
        let clearMessage;
        if (message) {
            clearMessage = setTimeout(() => setMessage(''), 800);
        }
        return () => {
            if (clearMessage) {
                clearTimeout(clearMessage);
            }
        };
    }, [message]);

    return (
        <form>
            <div className='flex flex-col w-screen h-screen items-center justify-center p-0 sm:p-5'>
                <div className='relative flex flex-col h-[50%] w-[100%] sm:h-[40%] sm:w-[100%] bg-gray-300 items-center justify-evenly'>
                    {Boolean(message) && (
                        <div className='absolute top-20 left-10 sm:top-10 sm:left-9 p-1 text-white flex items-center justify-center'>
                            <p className={`message ${className} flex items-center justify-center`}>
                                {message === 'Correct Answer!' && <FaCheckCircle className="mr-2" />}
                                {message === 'Wrong Answer!' && <FaTimesCircle className="mr-2" />}
                                {message === 'Write a Word!' && <FaExclamationTriangle className="mr-2" />}
                                {message}
                            </p>
                        </div>
                    )}
                    <h1 className='w-full bg-#023047 text-white flex items-center mt-[-65px] h-[2rem] justify-center text-lg border uppercase tracking-widest'>Word Scramble</h1>
                    <div className='flex flex-col items-center justify-center'>
                        <div className="mb-4">
                            <p className='text-2xl text-#fb8500 mb-2 font-bold'>Score: {score}</p>
                            <p className='text-lg text-#fb8500 mb-2 font-bold'>Level: {level}</p>
                            <p className='text-md text-#fb8500 mb-2'>Max Score: {maxScore}</p>
                            <p className='text-md text-#fb8500 mb-2'>Max Level: {maxLevel}</p>
                        </div>
                        {isPlayOn ? (
                            <>
                                <div className="flex flex-col align-center justify-center items-center">
                                    <div className='grid-container guess-grid'>
                                        {correctWord.split("").map((el, i) => (
                                            <div key={`${el}_${i}`} className='grid-item'>
                                                {inputValue[i]}
                                            </div>
                                        ))}
                                    </div>
                                    <div className='grid-container scrambled-grid'>
                                        {scrambledWord.split("").map((el, i) => (
                                            <div key={`${el}_${i}`} className='grid-item'>
                                                {el}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='mb-10 mt-5'>
                                    <input className='input' type='text' onChange={handleInputChange} placeholder='Guess the word' value={inputValue} />
                                    <input className='btn ml-2' onClick={handleClick} type="submit" value="Enter" />
                                </div>
                                <div className='w-full flex text-center items-center justify-center text-white mt-4'>
                                    <button className='btn' onClick={handleResetScramble}>Reset Scramble</button>
                                </div>
                            </>
                        ) : (
                            <div className='w-full flex text-white'>
                                <button className='btn' onClick={handleStartGame}>Start Game</button>
                            </div>
                        )}
                        {isPlayOn && (
                            <div className='w-full flex text-center items-center justify-center text-white mt-4'>
                                <button className='btn' onClick={handleStartGame}>New Game</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}

export default WordScramble;
