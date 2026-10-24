export type Article = {
  slug: string
  title: string
  author: string
  publishedAt: string
  summary: string
  content: string[]
}

export const articles: Article[] = [
  {
    slug: 'key-metrics-esports-dashboard',
    title: 'The key metrics of an esports dashboard',
    author: 'DashboardEsports Team',
    publishedAt: '2026-09-02',
    summary:
      'Which player, team and match data are worth showing to understand competitive performance.',
    content: [
      'An esports dashboard is not much use if it only piles up numbers. What matters is choosing metrics that answer concrete questions: who is performing best? Which team is growing the most? How is each organization doing in its matchups?',
      'At the player level, wins, role and accumulated earnings give a first picture of a career. At the team level, followers and country of origin help measure reach and influence.',
      'At the match level, the history of matchups between teams reveals rivalries and trends. With these three layers, the dashboard tells a complete story instead of showing isolated data.',
    ],
  },
  {
    slug: 'how-a-professional-esports-team-is-organized',
    title: 'How a professional esports team is organized',
    author: 'DashboardEsports Team',
    publishedAt: '2026-09-16',
    summary:
      'A look at the structure of an organization: players, roles and their relationship with official matches.',
    content: [
      'Behind every professional team there is a clear structure. An organization groups several players, and each player fills a specific role within the roster, such as top laner, support or jungler.',
      'This relationship between teams and players is the basis of a good data model: a team has many players, and a player belongs to only one team at a time. Representing it well avoids inconsistencies when displaying information.',
      'Matches, in turn, connect two teams in the same event. Understanding this organization helps design more useful screens, where navigating from a team to its players or its matches feels natural.',
    ],
  },
  {
    slug: 'visualizing-data-to-make-better-decisions',
    title: 'Visualizing data to make better decisions',
    author: 'DashboardEsports Team',
    publishedAt: '2026-10-01',
    summary:
      'Why charts and filterable tables help analysts and coaches make decisions.',
    content: [
      'Analysts and coaches rarely have time to go through huge spreadsheets. A well-chosen chart makes it possible to compare teams in seconds and spot patterns that a table hides.',
      'Filterable tables complement charts: they let you narrow the information by country, role or team and reach the detail you need at any given moment.',
      'The key is to combine both tools in a simple interface. A useful dashboard does not show everything at once, only what is needed to go from data to decision.',
    ],
  },
]

export function findArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}
