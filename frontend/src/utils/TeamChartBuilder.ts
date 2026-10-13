// external imports
import type { ChartData } from 'chart.js';

// internal imports
import type { TeamInterface } from '@/interfaces/TeamInterface.js';

export default class TeamChartBuilder {
  // One bar per team showing its followers.
  public static followersByTeam(teams: TeamInterface[]): ChartData<'bar'> {
    return {
      labels: teams.map((team) => team.name),
      datasets: [
        {
          label: 'Followers',
          data: teams.map((team) => team.followers),
          backgroundColor: '#22d3ee',
        },
      ],
    };
  }
}
