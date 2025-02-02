<template>
  <div>
    <v-container max-width="1200px">
      <router-view />
      <!-- search card -->
      <v-container max-width="500px">
        <!-- search field -->
        <SearchField
          class="d-flex flex-grow-1 justify-center"
          v-model="searchItem"
        ></SearchField>

        <!-- online toggle -->
        <v-switch
          color="primary"
          label="Inclure les ateliers en ligne"
          hide-details
        ></v-switch>

        <!-- search radius -->
        <div class="text-caption mt-2">Rayon de recherche</div>
        <v-slider
          v-model="distance"
          :max="5"
          show-ticks="always"
          :step="1"
          :ticks="tickLabels"
          tick-size="4"
          color="primary"
        ></v-slider>
      </v-container>
    </v-container>
    <v-tabs
      class="workshop-type-btn-div d-flex justify-center"
      v-model="tab"
      color="primary"
      grow
      fixed-tabs
    >
      <v-tab
        class="workshop-type-btn"
        value="atelier"
        variant="tonal"
        >Participer à un atelier</v-tab
      >
      <v-tab
        class="workshop-type-btn"
        value="animation"
        variant="tonal"
        >devenir animateur</v-tab
      >
      <v-tab
        class="workshop-type-btn"
        value="junior"
        variant="tonal"
        >trouver un atelier junior</v-tab
      >
    </v-tabs>
    <!-- results -->
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="atelier">
        <SearchResultsList
          :workshops="filteredWorkshops"
          :longitude="selectedCity?.longitude"
          :latitude="selectedCity?.latitude"
          :search-radius="tickDistances[distance]"
          :workshop-type="'atelier'"
        ></SearchResultsList>
      </v-tabs-window-item>

      <v-tabs-window-item value="animation">
        <SearchResultsList
          :workshops="filteredWorkshops"
          :longitude="selectedCity?.longitude"
          :latitude="selectedCity?.latitude"
          :search-radius="tickDistances[distance]"
          :workshop-type="'formation'"
        ></SearchResultsList>
        <div class="results ma-2"></div>
      </v-tabs-window-item>

      <v-tabs-window-item value="junior">
        <SearchResultsList
          :workshops="filteredWorkshops"
          :longitude="selectedCity?.longitude"
          :latitude="selectedCity?.latitude"
          :search-radius="tickDistances[distance]"
          :workshop-type="'junior'"
        ></SearchResultsList>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script lang="ts" setup>
  import { Workshop } from '@/common/Conf'
  import router, { ROUTE_SEARCH_CITY, ROUTE_SEARCH_DPT } from '@/router'
  import { AutocompleteItem, Commune, State } from '@/state/State'
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

  const tickLabels = {
    0: '10 km',
    1: '25 km',
    2: '50 km',
    3: '100 km',
    4: '250 km',
    5: 'Tout',
  }

  const tickDistances = [10, 25, 50, 100, 250, -1]

  const filteredWorkshops = ref<Workshop[]>([])
  const selectedCity = ref<Commune | undefined>(undefined)
  const distance = ref(2)

  const tab = ref('atelier')

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
        selectedCity.value = await State.current.autocomplete.findCommune(
          params.codePostal,
          params.codeCommune
        )

        console.log('selectedCity : ', selectedCity.value)
        break
      default:
        console.log('default')
    }
    const allWorkshops = await State.current.allWorkshops()
    filteredWorkshops.value = allWorkshops.workshopsDisponibles
  }

  onMounted(() => {
    refresh()
  })

  router.afterEach(() => {
    refresh()
  })
</script>

<style scoped>
  .results {
    background-color: rgb(var(--v-theme-background-2));
  }

  .workshop-type-btn {
    /* @media screen and (max-width: 600px) {
      width: 120px !important;
    } */
    & :deep(.v-btn__content) {
      white-space: wrap !important;
      font-size: 0.7rem !important;
      /* @media screen and (max-width: 960px) {
        font-size: 0.6rem !important;
      }
      @media screen and (max-width: 600px) {
        font-size: 0.5rem !important;
      } */
    }
  }
</style>
