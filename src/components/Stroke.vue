<script lang="ts">
import { defineComponent, computed } from 'vue'
import { isDark } from '~/composables'

export default defineComponent({
  name: 'Stroke',
  props: {
    line: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const isYang = computed(() => [7, 9].includes(props.line))
    const isValid = computed(() => props.line > 5 && props.line < 10)
    return { isYang, isValid, isDark }
  },
})
</script>
<template>
  <div class="w-full h-full grid grid-cols-3 gap-0">
    <div :class="{ 'bg-gray-200': isValid && isDark, 'bg-gray-900': isValid && !isDark }" />
    <div :class="{ 'bg-gray-200': isValid && isYang && isDark, 'bg-gray-900': isValid && isYang && !isDark }" />
    <div :class="{ 'bg-gray-200': isValid && isDark, 'bg-gray-900': isValid && !isDark }" />
  </div>
</template>
