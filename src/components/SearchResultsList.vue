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
  import distanceBetween from '@/utils/distance'
  import { ref, onMounted } from 'vue'

  const props = defineProps({
    workshops: {
      type: Object as () => Workshop[],
      required: true,
    },
    longitude: {
      type: [Number, undefined],
      required: false,
      default: undefined,
    },
    latitude: {
      type: [Number, undefined],
      required: false,
      default: undefined,
    },
    searchRadius: {
      type: Number,
      required: false,
      default: -1,
    },
  })

  const filteredWorkshops = ref<Workshop[]>([])
  const filteredWorkshopsToDisplay = ref<Workshop[]>([])

  function displayXMoreWorkshops(nb = 10) {
    const end = filteredWorkshopsToDisplay.value.length + nb
    filteredWorkshopsToDisplay.value = filteredWorkshops.value.slice(0, end)
  }

  function filterWorkshops() {
    filteredWorkshops.value = props.workshops.filter((workshop: Workshop) => {
      if (props.searchRadius === -1) {
        return true
      }

      if (!props.longitude || !props.latitude) {
        console.warn('No longitude or latitude provided for workshop ', workshop)
        return false
      }

      const distance = distanceBetween(
        { latitude: workshop.latitude, longitude: workshop.longitude },
        { latitude: props.latitude, longitude: props.longitude }
      )
      return distance <= props.searchRadius
    })
  }

  function loadMore({ done }) {
    displayXMoreWorkshops()
    done('ok')
  }

  watch(
    () => [props.workshops, props.searchRadius],
    newVal => {
      filteredWorkshops.value = []
      filteredWorkshopsToDisplay.value = []
      filterWorkshops()
      displayXMoreWorkshops()
    }
  )

  onMounted(() => {
    filterWorkshops()
    displayXMoreWorkshops()
  })
</script>
