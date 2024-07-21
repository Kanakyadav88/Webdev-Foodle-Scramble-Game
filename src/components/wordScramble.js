import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import './word.css';

import let_5 from './word list/let_5';
import let_6 from './word list/let_6';
import let_7 from './word list/let_7';
import let_8 from './word list/let_8';
import let_9 from './word list/let_9';
import let_10 from './word list/let_10';
// import { type } from '@testing-library/user-event/dist/type';

const WordScramble = () => {
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
        const storedMaxScore = localStorage.getItem('maxScore');
        const storedMaxLevel = localStorage.getItem('maxLevel');
        if (storedMaxScore) setMaxScore(parseInt(storedMaxScore, 10));
        if (storedMaxLevel) setMaxLevel(parseInt(storedMaxLevel, 10));
    }, []);

    useEffect(() => {
        localStorage.setItem('maxScore', maxScore);
        localStorage.setItem('maxLevel', maxLevel);
    }, [maxScore, maxLevel]);

    const getWordList = () => {
        const allWords = [...let_5, ...let_6, ...let_7, ...let_8, ...let_9, ...let_10];
        return allWords;
    };

    // const getWordList = (level) => {
    //     switch (level) {
    //         case 1:
    //             return let_5;
    //         case 2:
    //             return let_6;
    //         case 3:
    //             return let_7;
    //         case 4:
    //             return let_8;
    //         case 5:
    //             return let_9;
    //         case 6:
    //             return let_10;
    //         default:
    //             const allWords = [...let_5, ...let_6, ...let_7, ...let_8, ...let_9, ...let_10];
    //             return allWords;
    //     }
    // };

    const selectWord = async () => {
        const words = getWordList(level);
        const radIndex = Math.floor(Math.random() * words.length);
        return words[radIndex].trim().toUpperCase();
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value.toUpperCase());
    };

    const handleClick = async (e) => {
        e.preventDefault();

        if (inputValue !== "") {
            if (correctWord === inputValue) {
                setMessage('Correct Answer!');
                setClassName('message bg-green-400');
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
                const word = await selectWord();
                setCorrectWord(word);
                setScrambledWord(constructScrambledWord(word));

            } else {
                setMessage('Wrong Answer!');
                setClassName('message bg-red-400');
                setInputValue('');
            }
        } else {
            setMessage('Write a Word!');
            setClassName('message bg-yellow-400');
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

    const handleStartGame = async (e) => {
        e.preventDefault();
        setIsPlayOn(true);
        setInputValue('');
        setMessage('');
        setScore(0); // Reset score when starting a new game
        setNumSwaps(1); // Reset swaps
        setLevel(1); // Reset level

        const word = await selectWord();
        if (word) {
            setCorrectWord(word);
            setScrambledWord(constructScrambledWord(word));
        }
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
            clearMessage = setTimeout(() => setMessage(''), 2500); // Extended timeout to 2.5 seconds
        }
        return () => {
            if (clearMessage) {
                clearTimeout(clearMessage);
            }
        };
    }, [message]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleClick(e);
        }
    };

    return (
        <form onSubmit={handleClick}>
            <div className='flex flex-col w-screen h-screen items-center justify-center p-0 sm:p-5'>
                <div className='relative flex flex-col h-[50%] w-[100%] sm:h-[40%] sm:w-[100%] bg-gray-300 items-center justify-evenly'>
                    {Boolean(message) && (
                        <div className='absolute top-20 left-10 sm:top-10 sm:left-9 p-1 text-white flex items-center justify-center animate-fade-in-out'>
                            <p className={`message ${className} flex items-center justify-center`}>
                                {message === 'Correct Answer!' && <FaCheckCircle className="mr-2" />}
                                {message === 'Wrong Answer!' && <FaTimesCircle className="mr-2" />}
                                {message === 'Write a Word!' && <FaExclamationTriangle className="mr-2" />}
                                {message}
                            </p>
                        </div>
                    )}
                    <div className='flex flex-col items-center justify-center'>
                    <div className="mb-4 flex justify-between w-full">
                        <div className='score-container'>
                            <div className='flex flex-col items-center'>
                                <p className='text-lg text-orange-500 mb-1 font-bold'>Score</p>
                                <p className='text-2xl text-orange-500 font-bold'>{score}</p>
                            </div>
                            <div className='flex flex-col items-center'>
                                <p className='text-lg text-orange-500 mb-1 font-bold'>Max Score</p>
                                <p className='text-2xl text-orange-500 font-bold'>{maxScore}</p>
                            </div>
                        </div>
                        <div className='level-container'>
                            <div className='flex flex-col items-center'>
                                <p className='text-lg text-orange-500 mb-1 font-bold'>Level</p>
                                <p className='text-2xl text-orange-500 font-bold'>{level}</p>
                            </div>
                            <div className='flex flex-col items-center'>
                                <p className='text-lg text-orange-500 mb-1 font-bold'>Max Level</p>
                                <p className='text-2xl text-orange-500 font-bold'>{maxLevel}</p>
                            </div>
                        </div>
                            {isPlayOn && (
                                <div className='btn-container'>
                                    <button className='btn' onClick={handleResetScramble}> Scramble </button>
                                    <button className='btn' type="submit"> Submit </button>
                                    {/* <button className='btn' onClick={type="submit"}> Submit </button> */}
                                </div>
                               )}
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
                                <div className='w-full flex justify-between items-center mb-10 mt-5'>
                                    <input className='input' type='text' onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder='Guess the word' value={inputValue} />
                                </div>
                            </>
                        ) : (
                            <div className='w-full flex text-white'>
                                <button className='btn' onClick={handleStartGame}>Start Game</button>
                            </div>
                        )}
                        {isPlayOn && (
                            <div className='w-full flex text-center items-center justify-center text-white mt-4'>
                                <button className='btn' onClick={handleStartGame}> New Game </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default WordScramble;
