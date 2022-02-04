<script lang="ts">
import { defineComponent } from 'vue'
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
})
</script>
<template>
  <div class="w-full h-full grid grid-cols-1 gap-y-4">
    <Stroke v-for="(line, i) in 6" :key="i" :line="lines[i]" />
  </div>
</template>
