<script setup lang="ts">
// Los equipos se piden a la capa servidor de Nuxt (/server/api/teams) durante el SSR
const { data: equipos } = await useFetch('/api/teams')

useHead({ title: 'Equipos' })
</script>

<template>
  <div>
    <h1 class="h2 mb-3">Equipos</h1>
    <ul class="list-group">
      <li v-for="equipo in equipos" :key="equipo.id" class="list-group-item position-relative">
        <NuxtLink class="stretched-link text-decoration-none" :to="`/teams/${equipo.id}`">
          {{ equipo.name }}
        </NuxtLink>
        <span class="text-body-secondary d-block small">{{ equipo.country }} · {{ equipo.followers }} seguidores</span>
      </li>
    </ul>
  </div>
</template>