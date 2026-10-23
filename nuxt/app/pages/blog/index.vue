<script setup lang="ts">
import { articles } from '~/data/articles'

useHead({ title: 'Blog' })
</script>

<template>
  <div>
    <h1 class="h2 mb-3">Blog</h1>
    <ul class="list-group">
      <li v-for="article in articles" :key="article.slug" class="list-group-item position-relative">
        <NuxtLink class="stretched-link text-decoration-none" :to="`/blog/${article.slug}`">
          {{ article.title }}
        </NuxtLink>
        <span class="text-body-secondary d-block small">
          {{ article.author }} · {{ formatDate(article.publishedAt) }}
        </span>
      </li>
    </ul>
  </div>
</template>
