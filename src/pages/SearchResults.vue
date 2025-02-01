<template>
  <div>
    <v-container max-width="1200px">
      <router-view />
      <!-- search card -->
      <v-card class="search-card pa-10">
        <v-card-text class="d-flex justify-center">
          <SearchField
            class="d-flex flex-grow-1 justify-center"
            v-model="searchItem"
          ></SearchField>
        </v-card-text>
      </v-card>
    </v-container>
    <!-- results -->
    <div class="results">
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
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Workshop } from '@/common/Conf'
  import router, { ROUTE_SEARCH_CITY, ROUTE_SEARCH_DPT } from '@/router'
  import { AutocompleteItem, State } from '@/state/State'
  import { ref, onMounted } from 'vue'

  const searchItem = ref<AutocompleteItem>({
    value: 0,
    title: '',
    props: {
      code_departement: '',
      code_region: 0,
      nom_departement: '',
      nom_region: '',
    },
  })

  const filteredWorkshops = ref<Workshop[]>([])
  const filteredWorkshopsToDisplay = ref<Workshop[]>([])

  async function refresh() {
    const route = router.currentRoute.value.name
    const params = router.currentRoute.value.params as any
    console.log('params : ', params)
    switch (route) {
      case ROUTE_SEARCH_DPT:
        console.log('ROUTE_SEARCH_DPT')
        searchItem.value = {
          value: -1,
          title: params.nomDpt.replace(/_/g, ' '),
          props: {
            code_departement: params.codeDpt,
            code_region: 0,
            nom_departement: params.nomDpt,
            nom_region: '',
          },
        }
        break
      case ROUTE_SEARCH_CITY:
        console.log('ROUTE_SEARCH_CITY')
        searchItem.value = {
          value: -1,
          title: params.nomCommune.replace(/_/g, ' '),
          props: {
            code: params.codeCommune,
            codeDepartement: params.codeDpt,
            codePostal: params.codePostal,
            latitude: 0,
            longitude: 0,
            nom: params.nomCommune,
          },
        }
        break
      default:
        console.log('default')
    }
    const allWorkshops = await State.current.allWorkshops()
    filteredWorkshops.value = allWorkshops.workshopsDisponibles
    filteredWorkshopsToDisplay.value = []

    console.log('workshops : ', filteredWorkshops.value)
    displayXMoreWorkshops()
  }

  function displayXMoreWorkshops(nb = 10) {
    const end = filteredWorkshopsToDisplay.value.length + nb
    filteredWorkshopsToDisplay.value = filteredWorkshops.value.slice(0, end)
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

  onMounted(() => {
    refresh()
  })

  router.afterEach(() => {
    refresh()
  })
</script>

<style scoped>
  .search-card {
    background: linear-gradient(
      45deg,
      rgba(var(--v-theme-secondary), 0.6),
      rgba(var(--v-theme-primary), 0.6)
    );
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    margin-top: 20px;
  }

  .results {
    margin-top: 20px;
    background-color: rgb(var(--v-theme-background-2));
  }
</style>
