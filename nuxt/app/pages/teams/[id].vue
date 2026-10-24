<script setup lang="ts">
const route = useRoute()
const id = String(route.params.id)

// The team is requested to the Nuxt server layer (/server/api/teams/:id) during SSR
const { data: team } = await useFetch(`/api/teams/${id}`)
</script>

<template>
  <article v-if="team">
    <p class="mb-1">
      <NuxtLink class="text-decoration-none small" to="/teams">← Todos los equipos</NuxtLink>
    </p>
    <h1 class="h2">{{ team.name }}</h1>
    <p class="lead mb-2">{{ team.country }} · {{ team.followers }} seguidores</p>
    <p>{{ team.description }}</p>

    <h2 class="h5">Jugadores</h2>
    <ul class="list-group mb-3">
      <li v-for="player in team.players" :key="player" class="list-group-item">{{ player }}</li>
    </ul>

    <h2 class="h5">Partidas</h2>
    <p class="mb-0">{{ team.matches }}</p>
  </article>
</template>