<script setup lang="ts">
// Teams are requested to the Nuxt server layer (/server/api/teams) during SSR
const { data: teams } = await useFetch('/api/teams')

useHead({ title: 'Teams' })
</script>

<template>
  <div>
    <h1 class="h2 mb-3">Teams</h1>
    <ul class="list-group">
      <li v-for="team in teams" :key="team.id" class="list-group-item position-relative">
        <NuxtLink class="stretched-link text-decoration-none" :to="`/teams/${team.id}`">
          {{ team.name }}
        </NuxtLink>
        <span class="text-body-secondary d-block small">{{ team.country }} · {{ team.followers }} followers</span>
      </li>
    </ul>
  </div>
</template>