<script setup lang="ts">
import { findArticleBySlug } from '~/data/articles'

definePageMeta({
  validate: (route) => findArticleBySlug(String(route.params.slug)) !== undefined,
})

const route = useRoute()
const article = computed(() => findArticleBySlug(String(route.params.slug)))

useHead({ title: () => article.value?.title })
</script>

<template>
  <article v-if="article">
    <p class="mb-1">
      <NuxtLink class="text-decoration-none small" to="/blog">← Todos los artículos</NuxtLink>
    </p>
    <h1 class="h2">{{ article.title }}</h1>
    <p class="lead mb-3">{{ article.author }} · {{ formatDate(article.publishedAt) }}</p>
    <p v-for="(paragraph, index) in article.content" :key="index">{{ paragraph }}</p>
  </article>
</template>
