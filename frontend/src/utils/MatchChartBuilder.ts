// external imports
import type { ChartData } from 'chart.js';

// internal imports
import type { MatchInterface } from '@/interfaces/MatchInterface.js';

const CHART_COLORS = ['#22d3ee', '#a78bfa', '#f472b6', '#facc15', '#4ade80', '#fb923c', '#60a5fa'];

export default class MatchChartBuilder {
  // One slice per team showing how many of the given matches it won.
  public static winsByTeam(matches: MatchInterface[]): ChartData<'doughnut'> {
    const winsPerTeam = new Map<string, number>();

    for (const match of matches) {
      winsPerTeam.set(match.winner.name, (winsPerTeam.get(match.winner.name) ?? 0) + 1);
    }

    const teamNames = [...winsPerTeam.keys()];

    return {
      labels: teamNames,
      datasets: [
        {
          label: 'Wins',
          data: teamNames.map((teamName) => winsPerTeam.get(teamName) ?? 0),
          backgroundColor: teamNames.map(
            (_, index) => CHART_COLORS[index % CHART_COLORS.length] ?? '#22d3ee',
          ),
        },
      ],
    };
  }
}
