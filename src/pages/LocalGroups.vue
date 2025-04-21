<template>
  <v-container max-width="1200px">
    <div class="px-5">
      <h2 class="text-h2 text-primary mb-6">{{ t('localGroups.title') }}</h2>

      <h2>{{ t('localGroups.globalCommunity.heading') }}</h2>

      <p>
        {{ t('localGroups.globalCommunity.paragraph') }}
      </p>

      <h2>{{ t('localGroups.builtByLocal.heading') }}</h2>

      <p>
        {{ t('localGroups.builtByLocal.paragraph1') }}
      </p>

      <p>
        {{ t('localGroups.builtByLocal.paragraph2') }}
      </p>

      <!-- Map placeholder -->
      <div class="map-container mb-6">
        <div id="talkAboutItMap" class="map-height"></div>
      </div>

      <p>
        {{ t('localGroups.missing.paragraph') }}
      </p>

      <v-btn
        color="primary"
        block
        size="large"
        href="https://tally.so/r/mVb0Qj"
        target="_blank"
        class="card-action-button"
      >
        {{ t('localGroups.missing.button') }}
      </v-btn>

      <p>
        {{ t('localGroups.unique.paragraph') }}
      </p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
  import { map, tileLayer, marker, Marker, Icon, LatLngTuple } from 'leaflet'
  import { useI18n } from 'vue-i18n'
  import { useTheme } from 'vuetify'
  import 'leaflet/dist/leaflet.css'
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
  // @ts-ignore
  import { MarkerClusterGroup } from 'leaflet.markercluster'
  import { State, Workshop } from '@/state/State'

  type WorkshopCarte = {
    nom: string
    longitude: number
    latitude: number
    reservation: string
    location_name: string | undefined
    address: string | undefined
    city: string | undefined
  }

  const mymap = ref<any>(null)
  const { t } = useI18n()
  const theme = useTheme()
  const isDark = computed(() => theme.global.current.value.dark)
  const mapLayer = ref<any>(null)

  onMounted(async () => {
    mymap.value = map('talkAboutItMap', {
      markerZoomAnimation: false,
    }).setView([46.505, 3], 6)

    const allWorkshops = await State.current.allWorkshops()
    const workshopsCarte = allWorkshops.workshopsDisponibles
      .filter((workshop: Workshop) => workshop.online === false) // Exclude online workshops
      .filter(workshop => !!workshop.longitude && !!workshop.latitude) // Exclude workshops without coordinates
      .filter(
        workshop =>
          workshop.latitude >= -90 &&
          workshop.latitude <= 90 &&
          workshop.longitude >= -180 &&
          workshop.longitude <= 180
      ) // Exclude workshops with invalid coordinates
      .map<WorkshopCarte>(workshop => ({
        nom: workshop.title,
        longitude: workshop.longitude,
        latitude: workshop.latitude,
        reservation: workshop.source_link,
        location_name: workshop.location_name,
        address: workshop.address,
        city: workshop.city,
      }))

    // Apply initial map layer based on theme
    setMapLayer()

    const markers = creerPins(workshopsCarte)
    mymap.value.addLayer(markers)
  })

  // Set the map layer based on current theme
  function setMapLayer() {
    if (mapLayer.value) {
      mymap.value.removeLayer(mapLayer.value)
    }

    if (isDark.value) {
      mapLayer.value = tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }
      )
    } else {
      mapLayer.value = tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      )
    }

    mapLayer.value.addTo(mymap.value)
  }

  // Watch for theme changes and update map layer
  watch(isDark, () => {
    if (mymap.value) {
      setMapLayer()
    }
  })

  onUnmounted(() => {
    if (mymap.value) {
      mymap.value.remove()
    }
  })

  function creerPins(lieux: WorkshopCarte[]) {
    const markers = lieux.reduce((markers, lieu) => {
      let reservation_str = ''
      if (typeof lieu.reservation !== 'undefined') {
        if (lieu.reservation.indexOf('http') === 0) {
          reservation_str = `<a href="${lieu.reservation}">${lieu.reservation.slice(0, 35) + '...'}</a>`
        }
      } else {
        reservation_str = lieu.reservation
      }

      const string_popup = `
      <span style='font-size: 150%;'>${lieu.nom}</span>
      <br>
      <b>${t('map.address')} :</b> ${lieu.location_name ? `${lieu.location_name}, ` : ''}${lieu.address}, ${lieu.city}
      <br>
      <b>${t('map.booking')} :</b> ${reservation_str || '-'}
    `

      const newMarker = marker([lieu.latitude, lieu.longitude] as LatLngTuple, {
        icon: new Icon.Default({
          imagePath: `/assets/images/png/`,
          iconUrl: `marker-icon-2x.png`,
          iconSize: [32, 31],
          iconAnchor: [8, 31],
        }),
      }).bindPopup(string_popup)
      newMarker.on('click', function () {
        // @ts-ignore
        this.openPopup()
      })

      markers.push(newMarker)
      return markers
    }, [] as Marker[])

    const markersGroup = new MarkerClusterGroup({
      disableClusteringAtZoom: 9,
      chunkedLoading: true,
    })
    markersGroup.addLayers(markers, true)
    return markersGroup
  }
</script>

<style scoped>
  .map-container {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .map-height {
    height: 500px;
    width: 100%;
  }
</style>


<route>
{
  name: 'local-groups',
  path: '/local-groups'
}
</route> 