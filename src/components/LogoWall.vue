<template>
  <v-container>
    <v-row class="d-flex">
      <v-col
        class="d-flex"
        v-for="workshop in workshops"
        :key="workshop.id"
        cols="12"
        sm="6"
        md="4"
        lg="4"
      >
        <v-card
          class="workshop-card ma-2 d-flex flex-column justify-center align-center"
        >
          <div class="card-content">
            <a
              :href="workshop.website"
              target="_blank"
            >
              <v-img
                class="workshop-logo"
                :src="workshop.logo"
                :alt="workshop.name"
              />
            </a>
            <v-card-title>{{ workshop.name }}</v-card-title>
            <v-card-text>{{ workshop.description }}</v-card-text>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ATELIERS } from '@/common/Conf'
  import { onMounted, ref } from 'vue'

  const workshops = ref([])

  onMounted(() => {
    for (const atelier of Object.values(ATELIERS)) {
      if (atelier.promoted) workshops.value.push(atelier)
    }
  })
</script>

<style scoped>
  .workshop-card {
    transition: transform 0.3s ease;
    padding: 20px;
    flex: 1; /* Ensure the card takes up equal space */
  }

  .workshop-card:hover {
    transform: scale(1.05);
  }

  .card-content {
    height: 100%;
    width: 100%;
    text-align: center;
    word-break: keep-all;
  }

  .workshop-logo {
    max-width: 60%;
    max-height: 60px;
    height: auto;
    margin: 0 auto; /* Center the image horizontally */
    display: block; /* Ensure the image is displayed as a block element */
  }
</style>
