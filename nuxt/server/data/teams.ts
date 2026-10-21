export type Team = {
    id: string
    name: string
    country: string
    followers: number
    players: string[]
    matches: string
    description: string
}

export const teams: Team[] = [
    {
        id: "1",
        name: "T1",
        country: "South Korea",
        followers: 1337,
        players: ["Faker", "Zeus", "Oner", "Corejj", "Keria"],
        matches: "T1 - GEN.G",
        description:
            "T1 is a South Korean professional gaming organization based in Seoul, South Korea. It owns a roster of players for the multiplayer game League of Legends.",
    },
    {
        id: "2",
        name: "GEN.G",
        country: "South Korea",
        followers: 1337,
        players: ["Ruler", "Peyz", "Canyon", "Bengi", "Rekkles"],
        matches: "T1 - GEN.G",
        description:
            "Gen.G is a South Korean professional esports organization based in Seoul. The organization has multiple teams competing in different games.",
    },
    {
        id: "3",
        name: "TL",
        country: "United States",
        followers: 1337,
        players: ["Josedeodo", "Nejik", "Aphromoo", "Svenskeren", "Biofrost"],
        matches: "TL - C9",
        description:
            "Team Liquid is a professional esports organization based in New York City, United States. It owns multiple teams competing in different games.",
    },
    {
        id: "4",
        name: "C9",
        country: "United States",
        followers: 1337,
        players: ["Pobelter", "Hudson", "Jensen", "BrokenBlade", "Vulcan"],
        matches: "TL - C9",
        description:
            "Cloud9 is an American professional esports organization headquartered in Los Angeles, California. The organization has multiple teams competing in different games.",
    }
]
