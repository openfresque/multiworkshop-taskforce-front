<template>
  <v-container max-width="1200px">
    <div class="px-5">
      <h2 class="text-h2 text-primary mb-6">{{ $t('talkAboutIt.title') }}</h2>

      <p class="mb-6">
        {{ $t('talkAboutIt.campaign') }}
      </p>

      <h3 class="text-h5 mb-3">{{ $t('talkAboutIt.whatFor') }}</h3>
      <p class="mb-4">
        {{ $t('talkAboutIt.throughoutMay') }}
      </p>

      <!-- Campaign logo -->
      <div class="d-flex justify-center mb-6">
        <v-img
          class="mt-2"
          src="/assets/images/campaign/lets-talk-about-it.png"
          alt="Let's Talk About It Campaign"
          max-width="300"
          contain
        />
      </div>

      <p class="mb-4">
        {{ $t('talkAboutIt.aimOfOperation') }}
      </p>
      <ul class="mb-6">
        <li class="mb-2">{{ $t('talkAboutIt.jointCommunication') }}</li>
        <li class="mb-2">{{ $t('talkAboutIt.commonMap') }}</li>
        <li class="mb-2">{{ $t('talkAboutIt.ticketingTools') }}</li>
      </ul>

      <p class="mb-6">
        {{ $t('talkAboutIt.allWorkshops') }}
      </p>

      <h3 class="text-h5 mb-3">{{ $t('talkAboutIt.yourRole') }}</h3>
      <p class="mb-3">
        {{ $t('talkAboutIt.planWorkshops') }}
      </p>
      <p class="mb-6">
        {{ $t('talkAboutIt.createSessions') }}
      </p>

      <div class="d-flex flex-wrap gap-6 my-8 justify-center">
        <v-btn
          class="px-6 py-2 mr-4 mb-4"
          color="primary"
          href="https://docs.google.com/document/d/1ehh2JCkDod6mlIDUpnS70P6uNK4FCJ2Q4P7_kOWYcE0/edit?tab=t.60j2jenwg7pi"
          target="_blank"
          size="large"
        >
          {{ $t('talkAboutIt.kitEnglish') }}
        </v-btn>
        <v-btn
          class="px-6 py-2 mr-4 mb-4"
          color="primary"
          href="https://ab6pg.r.sp1-brevo.net/mk/cl/f/sh/SMK1E8tHeGLdZlc9f7mw6xwizWQH/aGfBHlu4EXpj"
          target="_blank"
          size="large"
        >
          {{ $t('talkAboutIt.kitFrench') }}
        </v-btn>
        <v-btn
          class="px-6 py-2 mb-4"
          color="primary"
          href="https://ab6pg.r.sp1-brevo.net/mk/cl/f/sh/SMK1E8tHeGZMU3G41S5uIcYCw7an/MSP3UQY_sLPg"
          target="_blank"
          size="large"
        >
          {{ $t('talkAboutIt.kitSpanish') }}
        </v-btn>
      </div>

      <h2 class="text-h4 mb-4">{{ $t('talkAboutIt.theMap') }}</h2>
      <p class="mb-4">
        {{ $t('talkAboutIt.mapDescription') }}
      </p>

      <!-- Map placeholder -->
      <div class="map-container mb-6">
        <div
          class="map-height"
          id="talkAboutItMap"
        ></div>
      </div>
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
