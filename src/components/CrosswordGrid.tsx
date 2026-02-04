import { useRef, KeyboardEvent } from "react";

export interface CellData {
  char: string;
  number?: number;
}

interface CrosswordGridProps {
  gridMap: (CellData | null)[][];
  userInputs: string[][];
  cellStatus: ("correct" | "incorrect" | null)[][];
  directionMap: ("across" | "down" | null)[][];
  onInputChange: (row: number, col: number, value: string) => void;
}

const CrosswordGrid = ({ gridMap, userInputs, cellStatus, directionMap, onInputChange }: CrosswordGridProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);
  const rows = gridMap.length;
  const cols = gridMap[0]?.length || 0;

  // Initialize refs
  if (inputRefs.current.length !== rows) {
    inputRefs.current = Array(rows).fill(null).map(() => Array(cols).fill(null));
  }

  const findNextCell = (row: number, col: number, direction: "forward" | "backward", cellDir: "across" | "down" | null) => {
    const step = direction === "forward" ? 1 : -1;
    
    // Use the cell's word direction to determine movement
    const isVertical = cellDir === "down";
    
    let r = row + (isVertical ? step : 0);
    let c = col + (isVertical ? 0 : step);

    // First, try to stay in the same word direction
    while (r >= 0 && r < rows && c >= 0 && c < cols) {
      if (gridMap[r][c]) {
        return { row: r, col: c };
      }
      r += isVertical ? step : 0;
      c += isVertical ? 0 : step;
    }
    
    return null;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    const cellDir = directionMap[row][col];
    
    if (e.key === "Backspace" && !userInputs[row][col]) {
      const prev = findNextCell(row, col, "backward", cellDir);
      if (prev) {
        inputRefs.current[prev.row]?.[prev.col]?.focus();
      }
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      let nextRow = row;
      let nextCol = col;

      if (e.key === "ArrowRight") nextCol++;
      else if (e.key === "ArrowLeft") nextCol--;
      else if (e.key === "ArrowUp") nextRow--;
      else if (e.key === "ArrowDown") nextRow++;

      // Find the next valid cell in that direction
      while (nextRow >= 0 && nextRow < rows && nextCol >= 0 && nextCol < cols) {
        if (gridMap[nextRow][nextCol]) {
          inputRefs.current[nextRow]?.[nextCol]?.focus();
          break;
        }
        if (e.key === "ArrowRight") nextCol++;
        else if (e.key === "ArrowLeft") nextCol--;
        else if (e.key === "ArrowUp") nextRow--;
        else if (e.key === "ArrowDown") nextRow++;
      }
    }
  };

  const handleInput = (row: number, col: number, value: string) => {
    const letter = value.slice(-1).toUpperCase();
    onInputChange(row, col, letter);

    if (letter) {
      const cellDir = directionMap[row][col];
      const next = findNextCell(row, col, "forward", cellDir);
      if (next) {
        inputRefs.current[next.row]?.[next.col]?.focus();
      }
    }
  };

  return (
    <div 
      className="inline-grid gap-[2px] bg-foreground/20 p-[2px] rounded-lg shadow-romantic"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(28px, 36px))`,
        gridTemplateRows: `repeat(${rows}, minmax(28px, 36px))`,
      }}
    >
      {gridMap.map((row, r) =>
        row.map((cell, c) => {
          if (!cell) {
            return (
              <div
                key={`${r}-${c}`}
                className="bg-foreground/80 rounded-sm"
              />
            );
          }

          const status = cellStatus[r][c];
          let cellBg = "bg-card";
          if (status === "correct") cellBg = "bg-accent";
          if (status === "incorrect") cellBg = "bg-rose-medium";

          return (
            <div
              key={`${r}-${c}`}
              className={`${cellBg} rounded-sm relative flex items-center justify-center transition-colors duration-300`}
            >
              {cell.number && (
                <span className="absolute top-0.5 left-1 text-[9px] font-semibold text-muted-foreground pointer-events-none">
                  {cell.number}
                </span>
              )}
              <input
                ref={(el) => {
                  if (!inputRefs.current[r]) inputRefs.current[r] = [];
                  inputRefs.current[r][c] = el;
                }}
                type="text"
                maxLength={2}
                value={userInputs[r][c]}
                onChange={(e) => handleInput(r, c, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, r, c)}
                className="w-full h-full bg-transparent text-center font-bold text-lg uppercase outline-none focus:ring-2 focus:ring-primary/50 rounded-sm text-foreground"
                aria-label={`Cell ${r + 1}-${c + 1}${cell.number ? `, clue ${cell.number}` : ""}`}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default CrosswordGrid;
