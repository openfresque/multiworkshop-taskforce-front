<template>
  <v-container
    class="bg-background-2 mt-2"
    max-width="1200px"
  >
    <!-- Result summary -->
    <v-card variant="flat">
      <v-card-title
        class="text-center pb-0"
        style="white-space: wrap"
      >
        <v-icon
          v-if="filteredWorkshops.length > 0"
          color="green-darken-2"
          icon="mdi-calendar-check"
          size="large"
        ></v-icon>
        <v-icon
          v-else
          icon="mdi-calendar-remove"
          size="large"
        ></v-icon>
        {{ filteredWorkshops.length }} {{ getWorkshopType() }}
        {{ searchByDpt ? 'pour' : 'autour de' }}
        <strong>{{ locationTitle }}</strong></v-card-title
      >
      <v-card-subtitle
        class="text-center"
        style="white-space: wrap"
      >
        Dernière mise à jour : {{ getLastUpdateRelativeDate() }}
      </v-card-subtitle>
    </v-card>

    <!-- workshops list -->
    <v-infinite-scroll
      v-if="filteredWorkshopsToDisplay.length > 0"
      :items="filteredWorkshopsToDisplay"
      @load="loadMore"
      :empty-text="'-'"
    >
      <template
        v-for="(item, index) in filteredWorkshopsToDisplay"
        :key="item"
      >
        <SearchResultsCard :workshop="item"></SearchResultsCard>
      </template>
    </v-infinite-scroll>

    <!-- no result card -->
    <v-card
      class="text-center my-6 no-result-card"
      v-else-if="!online"
    >
      <v-card-title
        class="text-center"
        style="white-space: wrap"
      >
        Souhaitez vous inclure les ateliers en ligne ?
      </v-card-title>
      <v-card-actions class="d-flex justify-center">
        <v-btn
          color="primary"
          @click="$emit('showOnline')"
          variant="elevated"
          ripple
        >
          Voir les ateliers en ligne
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
  import { CodeDepartement, SearchType, Workshop } from '@/common/Conf'
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
    online: {
      type: Boolean,
      required: false,
      default: false,
    },
    locationTitle: {
      type: String,
      required: false,
      default: '',
    },
    lastUpdateDate: {
      type: String,
      required: false,
      default: '',
    },
    searchByDpt: {
      type: Boolean,
      required: false,
      default: false,
    },
    dptNb: {
      type: String as () => CodeDepartement | '',
      required: false,
      default: '',
    },
  })

  const filteredWorkshops = ref<Workshop[]>([])
  const filteredWorkshopsToDisplay = ref<Workshop[]>([])
  let infiniteScrollEvents:
    | ((value: 'ok' | 'empty' | 'error') => void)
    | undefined

  function getLastUpdateRelativeDate() {
    const lastUpdate = new Date(props.lastUpdateDate)
    const now = new Date()
    const diff = now.getTime() - lastUpdate.getTime()
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (diffDays === 0) {
      return "aujourd'hui"
    }
    if (diffDays === 1) {
      return 'hier'
    }
    return `il y a ${diffDays} jours`
  }

  function getWorkshopType() {
    const plural = filteredWorkshops.value.length > 0? 's' : ''
    if (props.workshopType === 'junior') {
      return 'atelier' + plural + ' junior' + plural
    } else if (props.workshopType === 'formation') {
      return 'formation' + plural
    } else return 'atelier' + plural
  }

  function displayXMoreWorkshops(nb = 10) {
    const currentLength = filteredWorkshopsToDisplay.value.length
    let end = filteredWorkshopsToDisplay.value.length + nb

    if (end > filteredWorkshops.value.length) {
      end = filteredWorkshops.value.length
    }

    filteredWorkshopsToDisplay.value = filteredWorkshops.value.slice(0, end)
    const added = end - currentLength
    return added
  }

  function filterWorkshops() {
    filteredWorkshops.value = props.workshops.filter((workshop: Workshop) => {
      // junior filter
      if (
        props.workshopType === 'junior' &&
        (!workshop.kids || workshop.training) // don't show training for kids
      ) {
        return false
      }

      // training filter
      if (props.workshopType === 'formation' && !workshop.training) {
        return false
      }

      // workshop filter
      if (
        props.workshopType === 'atelier' &&
        (workshop.training || workshop.kids)
      ) {
        return false
      }

      // online filter
      if (props.online && workshop.online) {
        return true
      }

      //   search by department filter
      if (props.searchByDpt) {
        return workshop.department === props.dptNb
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
      props.online,
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

<style scoped>
  .no-result-card {
    @media screen and (max-width: 600px) {
      &:deep(.v-card-title) {
        font-size: 1rem;
      }

      &:deep(.v-btn__content) {
        font-size: 0.7rem;
      }
    }
  }
</style>
