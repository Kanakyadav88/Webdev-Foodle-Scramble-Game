import './App.css';
import './index.css';
import WordScramble from "./components/wordScramble.js";

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1 className="text-2xl md:text-4xl"> Food Scrambler  </h1>
      </header>
      <main className="word-scramble">
        <WordScramble />
      </main>
      <footer className="footer">
        {/* <p>&copy; 2024 Word Scramble Game</p> */}
      </footer>
    </div>
  );
}

export default App;
