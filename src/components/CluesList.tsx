interface ClueData {
  number: number;
  clue: string;
  word: string;
}

interface CluesListProps {
  acrossClues: ClueData[];
  downClues: ClueData[];
}

const CluesList = ({ acrossClues, downClues }: CluesListProps) => {
  return (
    <div className="bg-card rounded-xl shadow-romantic p-6 max-w-2xl w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-serif text-xl font-semibold text-primary border-b-2 border-primary pb-2 mb-4">
            Across
          </h3>
          <ul className="space-y-3">
            {acrossClues.map((clue) => (
              <li key={`across-${clue.number}`} className="text-sm font-body">
                <span className="font-bold text-primary">{clue.number}.</span>{" "}
                <span className="text-foreground">{clue.clue}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-xl font-semibold text-primary border-b-2 border-primary pb-2 mb-4">
            Down
          </h3>
          <ul className="space-y-3">
            {downClues.map((clue) => (
              <li key={`down-${clue.number}`} className="text-sm font-body">
                <span className="font-bold text-primary">{clue.number}.</span>{" "}
                <span className="text-foreground">{clue.clue}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CluesList;
