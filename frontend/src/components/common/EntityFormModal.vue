<script setup lang="ts">
// EntityFormModal: base for CRUD modals. Entity logic belongs to the view; this component only handles the modal UI.
defineProps<{
  isOpen: boolean
  title: string
  submitText?: string
  isSubmitting?: boolean
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
}>()
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white text-gray-900 rounded-lg shadow-xl w-full max-w-md p-6">
      <h2 class="text-xl font-bold mb-4">{{ title }}</h2>

      <!-- The form delegates its content to the view through slots -->
      <form @submit.prevent="$emit('submit')">
        <div class="form-body space-y-4 mb-6">
          <slot></slot>
        </div>

        <div class="form-actions flex justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Saving...' : submitText || 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
