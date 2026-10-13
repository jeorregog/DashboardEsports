<script setup lang="ts">
// external imports
import { Chart, registerables } from 'chart.js';
import type { ChartData, ChartType } from 'chart.js';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

Chart.register(...registerables);

// ChartPanel: reusable Chart.js wrapper. The parent decides what to draw (type + chartData);
// this component only knows how to render and refresh a chart.
const props = defineProps<{
  title: string;
  type: ChartType;
  chartData: ChartData;
}>();

const canvasElement = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

function renderChart() {
  if (!canvasElement.value) {
    return;
  }

  chartInstance?.destroy();
  chartInstance = new Chart(canvasElement.value, {
    type: props.type,
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: props.type !== 'bar' } },
    },
  });
}

onMounted(renderChart);

// Rebuild the chart when the data or the type change (for example after changing a filter).
watch(() => [props.type, props.chartData], renderChart, { deep: true });

onBeforeUnmount(() => {
  chartInstance?.destroy();
  chartInstance = null;
});
</script>

<template>
  <section class="rounded-lg border border-white/10 bg-white p-5 text-gray-900 shadow">
    <h2 class="mb-4 text-lg font-semibold">{{ title }}</h2>
    <div class="h-72">
      <canvas ref="canvasElement"></canvas>
    </div>
  </section>
</template>
