<template>
  <v-card class="workshop-card">
    <v-card-title>{{ workshop.title }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-img
            src="https://trouverunefresque.org/assets/images/logo/logo_fresqueOceane.webp"
            max-height="200px"
            max-width="200px"
          ></v-img>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { Workshop } from '@/state/State'

  defineProps({
    workshop: {
      type: Object as () => Workshop,
      required: true,
    },
  })
</script>
