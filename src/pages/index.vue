<script lang="ts">
import { ref, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '~/stores/user'
import Hexagram from '~/components/Hexagram.vue'
import CoinsInput from '~/components/CoinsInput.vue'
import { useHexagrams } from '~/composables/hexagrams'

export default defineComponent({
  components: {
    Hexagram,
    CoinsInput,
  },
  setup() {
    const user = useUserStore()
    const name = ref(user.savedName)
    const { lines, addLine, hexagrams } = useHexagrams()
    const updateLines = ({ score, index }: { score: number; index: number }) => {
      addLine(score, index)
    }

    const router = useRouter()
    const go = () => {
      if (name.value) router.push(`/hi/${encodeURIComponent(name.value)}`)
    }

    const { t } = useI18n()
    return { t, name, go, lines, addLine, updateLines, hexagrams }
  },
})
</script>

<template>
  <div>
    <p class="text-4xl">
      <icon-park-outline-chinese class="inline-block" />
    </p>
    <p>Yi-Jing</p>
    <p>
      <em class="text-sm opacity-75">{{ t('intro.desc') }}</em>
    </p>

    <div class="flex flex-col md:flex-row">
      <div class="h-80 w-90 md:w-100 mb-8">
        <Hexagram :lines="lines" />
      </div>
      <div class="md:flex-grow md:ml-6">
        <div
          class=" w-full flex flex-col md:flex-row justify-center items-center md:items-start p-6">
          <CoinsInput v-for="(line, i) in lines" :key="i" :line="line" :index="i" @onChange="updateLines" />
        </div>
        <div v-if="hexagrams.situation" class="flex flex-col  justify-center items-center py-6">
          <p class="text-xs dark:text-gray-200 text-center mb-2">Hexagramme de situation :</p>
          <h1 class="text-4xl">{{ hexagrams.situation.chineseName }}</h1>
          <h1 class="text-2xl dark:text-gray-400">
            {{ hexagrams.situation.pinyinName }}, num {{ hexagrams.situation.number }}
          </h1>
        </div>
        <div v-if="hexagrams.opposite" class="flex flex-col justify-center items-center py-6">
          <p class="text-xs dark:text-gray-200 text-center mb-2">Hexagramme opposé :</p>
          <h1 class="text-4xl">{{ hexagrams.opposite.chineseName }}</h1>
          <h1 class="text-2xl dark:text-gray-400">
            {{ hexagrams.opposite.pinyinName }}, num {{ hexagrams.opposite.number }}
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
