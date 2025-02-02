<template>
  <v-container max-width="1200px">
    <v-infinite-scroll
      :items="filteredWorkshopsToDisplay"
      @load="loadMore"
    >
      <template
        v-for="(item, index) in filteredWorkshopsToDisplay"
        :key="item"
      >
        <SearchResultsCard :workshop="item"></SearchResultsCard>
      </template>
    </v-infinite-scroll>
  </v-container>
</template>

<script lang="ts" setup>
  import { Workshop } from '@/common/Conf'
  import { ref, onMounted } from 'vue'

  const props = defineProps({
    workshops: {
      type: Object as () => Workshop[],
      required: true,
    },
  })

  const filteredWorkshopsToDisplay = ref<Workshop[]>([])

  function displayXMoreWorkshops(nb = 10) {
    const end = filteredWorkshopsToDisplay.value.length + nb
    filteredWorkshopsToDisplay.value = props.workshops.slice(0, end)
  }

  function loadMore({ done }) {
    console.log(
      'loadMore, current length : ',
      filteredWorkshopsToDisplay.value.length
    )
    displayXMoreWorkshops()
    console.log('new length : ', filteredWorkshopsToDisplay.value.length)
    done('ok')
  }

  watch(
    () => props.workshops,
    newVal => {
      filteredWorkshopsToDisplay.value = []
      displayXMoreWorkshops()
    }
  )

  onMounted(() => {
    displayXMoreWorkshops()
  })
</script>
