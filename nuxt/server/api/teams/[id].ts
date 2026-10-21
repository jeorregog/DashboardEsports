import { teams } from "../../data/teams";

export default defineEventHandler((event) => {
    const id = getRouterParam(event, 'id')

    const team = teams.find((team) => team.id === id);


    if (!team) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Team not found'
        })
    }

    return team;

});