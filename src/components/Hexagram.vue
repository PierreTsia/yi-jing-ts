<script lang="ts">
import { defineComponent, computed } from 'vue'
import Stroke from '~/components/Stroke.vue'

export default defineComponent({
  name: 'Hexagram',
  components: {
    Stroke,
  },
  props: {
    lines: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const reversedLines = computed(() => [...(props.lines as number[])].reverse())
    return { reversedLines }
  },
})
</script>
<template>
  <div class="w-full h-full grid grid-cols-1 gap-y-1">
    <Stroke v-for="(line, i) in reversedLines" :key="i" :line="line" />
  </div>
</template>
