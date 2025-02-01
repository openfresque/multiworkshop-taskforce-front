<template>
  <v-card class="workshop-card my-2">
    <v-card-text>
      <v-row>
        <v-col
          class="d-flex justify-center align-center"
          cols="2"
        >
          <v-img
            :src="getWorkshopLogo(workshop)"
            :alt="getWorkshopTitle(workshop)"
            max-height="120px"
            max-width="120px"
          ></v-img>
        </v-col>
        <v-col cols="6">
          <v-card-title>
            {{ getWorkshopTitle(workshop) }}
          </v-card-title>
          <v-card-subtitle>
            {{ getWorkshopDate(workshop) }}
          </v-card-subtitle>
          <v-card-text class="text-address">
            {{ getWorkshopAdress(workshop) }}
          </v-card-text>
        </v-col>
        <v-col
          class="d-flex justify-center align-center"
          cols="4"
        >
          <v-btn
            color="primary"
            :href="workshop.tickets_link"
            target="_blank"
            size="large"
          >
            Réserver une place
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { ATELIERS, Workshop } from '@/common/Conf'

  defineProps({
    workshop: {
      type: Object as () => Workshop,
      required: true,
    },
  })

  function getWorkshopTitle(workshop: Workshop): string {
    return 'Atelier ' + ATELIERS[workshop.workshop_type].name
  }

  function getWorkshopDate(workshop: Workshop): string {
    return new Date(workshop.start_date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  function getWorkshopAdress(workshop: Workshop): string {
    if (workshop.online) {
      return 'En ligne'
    }

    let ret = ''
    if (workshop.location_name) {
      ret += workshop.location_name + ', '
    }
    if (workshop.address) {
      ret += workshop.address + ', '
    }
    if (workshop.city) {
      ret += workshop.city + ' '
    }
    if (workshop.zip_code) {
      ret += '(' + workshop.zip_code + ')'
    }
    return ret
  }

  function getWorkshopLogo(workshop: Workshop): string {
    return ATELIERS[workshop.workshop_type].logo
  }

  onMounted(() => {})
</script>

<style scoped>
  .v-card-title {
    font-size: 1.5rem;
    font-weight: 500;
    line-height: normal;
  }

  .v-card-subtitle {
    font-size: 1.25rem;
    line-height: normal;
    font-weight: bold;
  }

  .text-address {
    font-size: 1.05rem;
    line-height: normal;
    font-weight: 500;
  }
</style>
