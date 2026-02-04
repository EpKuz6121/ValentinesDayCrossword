import { useState, useMemo } from "react";
import CrosswordGrid, { type CellData } from "@/components/CrosswordGrid";
import CluesList from "@/components/CluesList";
import SuccessModal from "@/components/SuccessModal";
import FloatingHearts from "@/components/FloatingHearts";
import { Button } from "@/components/ui/button";

interface WordData {
  word: string;
  clue: string;
  x: number;
  y: number;
  dir: "across" | "down";
  number: number;
}

// Configuration - UPDATE THESE COORDINATES based on your crossword generator!
const ROWS = 20;
const COLS = 15;

const WORDS = [
  { word: "BLUFFS", clue: "Where we like to go", x: 7, y: 1, dir: "down", number: 1 },
  { word: "MUFF", clue: "My nickname", x: 2, y: 4, dir: "across", number: 2 },
  { word: "FLOWERS", clue: "What do I always want", x: 9, y: 4, dir: "down", number: 3 },
  { word: "SNOOPY", clue: "My Halloween costume", x: 7, y: 6, dir: "across", number: 4 },
  { word: "YES", clue: "Will you be my Valentine", x: 12, y: 6, dir: "down", number: 5 },
  { word: "CHIPOTLE", clue: "What restaurant do you not like but I love", x: 2, y: 8, dir: "across", number: 6 },
  { word: "HEDGEHOG", clue: "Our matching stuffed animal", x: 3, y: 8, dir: "down", number: 7 },
  { word: "TOWELWARMER", clue: "What I got you for Christmas two years ago", x: 7, y: 8, dir: "down", number: 8 },
  { word: "OSU", clue: "Where I asked you to transfer", x: 11, y: 11, dir: "down", number: 9 },
  { word: "CULVERS", clue: "Where did we meet on our first date", x: 5, y: 12, dir: "across", number: 10 },
  { word: "MAYS", clue: "Your nickname", x: 6, y: 14, dir: "across", number: 11 },
  { word: "BASKETBALL", clue: "What was the first sport we played together", x: 3, y: 17, dir: "across", number: 12 }
];

// Build a direction map for each cell (to know if typing should go down or across)
const buildDirectionMap = (words: WordData[], rows: number, cols: number) => {
  const map: ("across" | "down" | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));
  
  words.forEach((w) => {
    for (let i = 0; i < w.word.length; i++) {
      const r = w.y - 1 + (w.dir === "down" ? i : 0);
      const c = w.x - 1 + (w.dir === "across" ? i : 0);
      
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        // If cell already has a direction (intersection), prefer the first word's direction
        if (!map[r][c]) {
          map[r][c] = w.dir;
        }
      }
    }
  });
  
  return map;
};

const Index = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [cellStatus, setCellStatus] = useState<("correct" | "incorrect" | null)[][]>(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );

  // Build the grid map
  const gridMap = useMemo(() => {
    const map: (CellData | null)[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

    WORDS.forEach((w) => {
      for (let i = 0; i < w.word.length; i++) {
        const r = w.y - 1 + (w.dir === "down" ? i : 0);
        const c = w.x - 1 + (w.dir === "across" ? i : 0);
        
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
          if (!map[r][c]) {
            map[r][c] = { char: w.word[i] };
          }
          if (i === 0) {
            map[r][c]!.number = w.number;
          }
        }
      }
    });

    return map;
  }, []);

  // Build direction map
  const directionMap = useMemo(() => buildDirectionMap(WORDS, ROWS, COLS), []);

  // User inputs
  const [userInputs, setUserInputs] = useState<string[][]>(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(""))
  );

  // Separate clues by direction
  const acrossClues = WORDS.filter((w) => w.dir === "across").sort((a, b) => a.number - b.number);
  const downClues = WORDS.filter((w) => w.dir === "down").sort((a, b) => a.number - b.number);

  const handleInputChange = (row: number, col: number, value: string) => {
    setUserInputs((prev) => {
      const newInputs = prev.map((r) => [...r]);
      newInputs[row][col] = value;
      return newInputs;
    });
    // Clear status when user types
    setCellStatus((prev) => {
      const newStatus = prev.map((r) => [...r]);
      newStatus[row][col] = null;
      return newStatus;
    });
  };

  const checkAnswers = () => {
    let allCorrect = true;
    const newStatus: ("correct" | "incorrect" | null)[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (gridMap[r][c]) {
          const expected = gridMap[r][c]!.char;
          const actual = userInputs[r][c].toUpperCase();
          if (actual === expected) {
            newStatus[r][c] = "correct";
          } else {
            newStatus[r][c] = "incorrect";
            allCorrect = false;
          }
        }
      }
    }

    setCellStatus(newStatus);

    if (allCorrect) {
      setShowSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-romantic relative overflow-hidden">
      <FloatingHearts />
      
      <div className="relative z-10 flex flex-col items-center px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gradient-romantic mb-2">
            ❤️ For My Valentine ❤️
          </h1>
          <p className="text-muted-foreground font-body text-lg">
            A special puzzle just for you
          </p>
        </div>

        {/* Crossword Grid */}
        <div className="mb-8 overflow-x-auto max-w-full">
          <CrosswordGrid
            gridMap={gridMap}
            userInputs={userInputs}
            cellStatus={cellStatus}
            directionMap={directionMap}
            onInputChange={handleInputChange}
          />
        </div>

        {/* Clues */}
        <CluesList acrossClues={acrossClues} downClues={downClues} />

        {/* Check Button */}
        <Button
          onClick={checkAnswers}
          className="mt-8 px-8 py-6 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-romantic"
        >
          Check Answers 💘
        </Button>
      </div>

      {/* Success Modal */}
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
};

export default Index;
