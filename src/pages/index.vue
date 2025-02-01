<template>
  <v-container max-width="1200px">
    <router-view />
    <!-- search card -->
    <v-card class="search-card pa-10">
      <v-card-title
        class="d-flex justify-center"
        max-width="600px"
      >
        <h1 style="text-wrap-mode: wrap; max-width: 600px; text-align: center">
          Trouvez une Fresque près de chez vous
        </h1>
      </v-card-title>
      <v-card-text class="d-flex justify-center">
        <v-autocomplete
          class="search-bar"
          clearable
          label="Localisation"
          max-width="500px"
          variant="solo"
          density="comfortable"
          :items="autocompleteMatches"
          :return-object="true"
          :custom-filter="() => true"
          @update:search="search"
          @update:model-value="goToSearchResults"
        >
          <template #item="{ item, props }">
            <v-list-item
              v-bind="props"
              :title="undefined"
              density="comfortable"
            >
              <strong
                >{{ item.props.codePostal
                }}{{ item.props.code_departement }}&nbsp;-&nbsp;</strong
              >{{ item.title }}
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-card-text>
    </v-card>

    <!-- logo section -->
    <LogoWall />

    <!-- Q&A section -->
    <QnA />
  </v-container>
</template>

<script lang="ts" setup>
  import router from '@/router'
  import {
    rechercheCommuneDescriptor,
    rechercheDepartementDescriptor,
  } from '@/routing/DynamicURLs'
  import { Commune, Departement, State } from '@/state/State'
  import { ref, onMounted } from 'vue'

  interface autocompleteItem {
    value: number
    title: string
    props: Commune | Departement
  }

  const autocompleteMatches = ref<autocompleteItem[]>([])

  async function search(searchTerm: string | null) {
    if (searchTerm === null) {
      autocompleteMatches.value = []
      return
    }
    const suggestions = await State.current.autocomplete.suggest(searchTerm)
    let uid = 0
    autocompleteMatches.value = suggestions.map(suggestion => ({
      value: uid++,
      title: suggestion.nom ?? suggestion.nom_departement,
      props: suggestion,
    }))
  }

  async function goToSearchResults(selected: autocompleteItem | null) {
    if (!selected) return
    console.log('Search for', selected.props)
    if ('codePostal' in selected.props) {
      // search by commune
      const com = selected.props as Commune
      const nomDepartement = await State.current
        .departementsDisponibles()
        .then(
          deps =>
            deps.find(dep => dep.code_departement === com.codeDepartement)
              ?.nom_departement
        )
      if (!nomDepartement) {
        console.error('Could not find departement for commune', com)
        return
      }
      const url = rechercheCommuneDescriptor.urlGenerator({
        codeDepartement: com.codeDepartement,
        nomDepartement,
        codeCommune: com.code,
        codePostal: com.codePostal,
        nomCommune: com.nom,
        tri: 'distance',
        searchType: 'atelier',
      })
      console.log('Navigating to', url)
      router.push(url)
    } else {
      // search by departement
      const dpt = selected.props as Departement
      const url = rechercheDepartementDescriptor.urlGenerator({
        codeDepartement: dpt.code_departement,
        nomDepartement: dpt.nom_departement,
        searchType: 'atelier',
      })
      console.log('Navigating to', url)
      router.push(url)
    }
  }

  onMounted(async () => {
    await search('')
  })
</script>

<style lang="scss" scoped>
  .search-card {
    background: linear-gradient(
      45deg,
      rgba(var(--v-theme-secondary), 0.6),
      rgba(var(--v-theme-primary), 0.6)
    );
  }
</style>
