<template>
  <v-container max-width="1200px">
    <v-infinite-scroll
      v-if="filteredWorkshopsToDisplay.length > 0"
      :items="filteredWorkshopsToDisplay"
      @load="loadMore"
      empty-text="Tous les ateliers correspondants aux critères ont été affichés"
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
  import { SearchType, Workshop } from '@/common/Conf'
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
    workshopType: {
      type: String as () => SearchType,
      required: false,
      default: () => 'all' as SearchType,
    },
  })

  const filteredWorkshops = ref<Workshop[]>([])
  const filteredWorkshopsToDisplay = ref<Workshop[]>([])
  let infiniteScrollEvents:
    | ((value: 'ok' | 'empty' | 'error') => void)
    | undefined

  function displayXMoreWorkshops(nb = 10) {
    const currentLength = filteredWorkshopsToDisplay.value.length
    let end = filteredWorkshopsToDisplay.value.length + nb

    if (end > filteredWorkshops.value.length) {
      end = filteredWorkshops.value.length
    }
    console.log('was showing', currentLength, 'now showing', end)
    filteredWorkshopsToDisplay.value = filteredWorkshops.value.slice(0, end)
    const added = end - currentLength
    return added
  }

  function filterWorkshops() {
    filteredWorkshops.value = props.workshops.filter((workshop: Workshop) => {
      // junior filter
      if (props.workshopType === 'junior' && !workshop.kids) {
        return false
      }

      // training filter
      if (props.workshopType === 'formation' && !workshop.training) {
        return false
      }

      // Distance filter
      if (props.searchRadius === -1) {
        return true
      }

      if (!props.longitude || !props.latitude) {
        console.warn(
          'No longitude or latitude provided for workshop ',
          workshop
        )
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
    infiniteScrollEvents = done
    const added = displayXMoreWorkshops()
    console.log('added', added)
    if (added === 0) done('empty')
    else done('ok')
  }

  watch(
    () => [
      props.workshops,
      props.searchRadius,
      props.longitude,
      props.latitude,
      props.workshopType,
    ],
    newVal => {
      filteredWorkshops.value = []
      filteredWorkshopsToDisplay.value = []
      filterWorkshops()
      displayXMoreWorkshops()
      infiniteScrollEvents?.('ok')
    }
  )

  onMounted(() => {
    filterWorkshops()
    displayXMoreWorkshops()
  })
</script>
