<template>
  <div>
    <router-view />
    <v-autocomplete
      clearable
      label="Localisation"
      max-width="500px"
      variant="solo"
      density="comfortable"
      no-data-text="Aucun résultat"
      :items="autocompleteMatches"
      :return-object="true"
      :custom-filter="() => true"
      :model-value="modelValue"
      @update:search="search"
      @update:model-value="goToSearchResults"
      @update:focused="focused = $event"
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

      <template #selection="{ item }">
        <div v-if="!searchValue && !focused">
          <strong
            >{{ item.props.codePostal
            }}{{ item.props.code_departement }}&nbsp;-&nbsp;</strong
          >{{ item.title.toUpperCase()[0] + item.title.slice(1).toLowerCase() }}
        </div>
      </template>
    </v-autocomplete>
  </div>
</template>

<script lang="ts" setup>
  import router from '@/router'
  import {
    rechercheCommuneDescriptor,
    rechercheDepartementDescriptor,
  } from '@/routing/DynamicURLs'
  import { AutocompleteItem, Commune, Departement, State } from '@/state/State'
  import { ref, onMounted } from 'vue'

  const props = defineProps({
    modelValue: {
      type: Object as () => AutocompleteItem | null,
      required: false,
      default: null,
    },
  })

  const autocompleteMatches = ref<AutocompleteItem[]>([])
  const searchValue = ref<string | null>(null)
  const focused = ref(false)

  async function search(searchTerm: string | null) {
    searchValue.value = searchTerm
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

  async function goToSearchResults(selected: AutocompleteItem | null) {
    if (!selected) return

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

  onMounted(() => {
    if (!props.modelValue) {
      search('')
    } else {
      search(props.modelValue.title)
    }
  })
</script>
