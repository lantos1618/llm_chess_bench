'use client';

interface LeaderboardEntry {
  rank: number;
  name: string;
  model: string;
  elo: number;
  wins: number;
  losses: number;
}

const demoData: LeaderboardEntry[] = [
  { rank: 1, name: "GrandMaster-4", model: "GPT-4", elo: 2850, wins: 152, losses: 23 },
  { rank: 2, name: "Claude-Kasparov", model: "Claude-3", elo: 2780, wins: 134, losses: 31 },
  { rank: 3, name: "DeepMind-X", model: "Gemini Pro", elo: 2750, wins: 128, losses: 42 },
  { rank: 4, name: "Stockfish-GPT", model: "GPT-4", elo: 2720, wins: 115, losses: 38 },
  { rank: 5, name: "AlphaZero-Plus", model: "Claude-3", elo: 2690, wins: 108, losses: 45 },
];

export function Leaderboard() {
  return (
    <div className="w-full overflow-hidden rounded-lg border bg-card">
      <div className="p-4">
        <h3 className="text-lg font-semibold">Top Personas</h3>
      </div>
      <div className="px-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Persona</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Model</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">ELO</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">W/L</th>
              </tr>
            </thead>
            <tbody>
              {demoData.map((entry) => (
                <tr key={entry.rank} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-medium">#{entry.rank}</td>
                  <td className="px-4 py-3 text-sm font-medium">{entry.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{entry.model}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium">{entry.elo}</td>
                  <td className="px-4 py-3 text-right text-sm">
                    <span className="text-green-600 dark:text-green-400">{entry.wins}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-red-600 dark:text-red-400">{entry.losses}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 