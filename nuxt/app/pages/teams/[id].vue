<script setup lang="ts">
const ruta = useRoute()
const id = String(ruta.params.id)

// El equipo se pide a la capa servidor de Nuxt (/server/api/teams/:id) durante el SSR
const { data: equipo, error } = await useFetch(`/api/teams/${id}`)

// Muestra la página de error de Nuxt cuando la capa servidor no encuentra el equipo
if (error.value) {
  throw createError({
    status: error.value.status,
    statusText: error.value.statusText,
    fatal: true,
  })
}

useHead({ title: () => equipo.value?.name })
</script>

<template>
  <article v-if="equipo">
    <p class="mb-1">
      <NuxtLink class="text-decoration-none small" to="/teams">← Todos los equipos</NuxtLink>
    </p>
    <h1 class="h2">{{ equipo.name }}</h1>
    <p class="lead mb-2">{{ equipo.country }} · {{ equipo.followers }} seguidores</p>
    <p>{{ equipo.description }}</p>

    <h2 class="h5">Jugadores</h2>
    <ul class="list-group mb-3">
      <li v-for="jugador in equipo.players" :key="jugador" class="list-group-item">{{ jugador }}</li>
    </ul>

    <h2 class="h5">Partidas</h2>
    <p class="mb-0">{{ equipo.matches }}</p>
  </article>
</template>