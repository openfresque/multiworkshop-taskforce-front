<template>
  <v-container max-width="1200px">
    <div
      id="mapid"
      style="
        height: 80vh;
        width: 90vw;
        max-width: 100%;
        max-height: 600px;
        margin-bottom: 40px;
        margin: auto;
      "
    ></div>
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted, onUnmounted, ref } from 'vue'
  import { map, tileLayer, marker, Marker, Icon, LatLngTuple } from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
  import { MarkerClusterGroup } from 'leaflet.markercluster'
  import { State, Workshop } from '@/state/State'

  type WorkshopCarte = {
    nom: string
    longitude: number
    latitude: number
    reservation: string
    adresse: string | undefined
  }

  const mymap = ref<any>(null)

  onMounted(async () => {
    mymap.value = map('mapid', {
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
      ) // Exclude workshops with
      .map<WorkshopCarte>(workshop => ({
        nom: workshop.title,
        longitude: workshop.longitude,
        latitude: workshop.latitude,
        reservation: workshop.source_link,
        adresse: workshop.full_location,
      }))

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mymap.value)

    const markers = creerPins(workshopsCarte)
    mymap.value.addLayer(markers)
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
      <b>Adresse :</b> ${lieu.adresse || '-'}
      <br>
      <b>Réservation :</b> ${reservation_str || '-'}
    `

      const newMarker = marker([lieu.latitude, lieu.longitude] as LatLngTuple, {
        icon: new Icon.Default({
          iconUrl: `assets/images/png/marker-icon-2x.png`,
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
  #mapid {
    height: 180px;
  }
</style>
