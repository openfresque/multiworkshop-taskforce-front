<template>
  <v-container max-width="1200px">
    <!-- Banner -->
    <v-banner class="greeting-banner">
      <v-icon icon="mdi-information" color="primary"></v-icon>
      <span>Trouver une Fresque va bientôt s'internationaliser ! En attendant, rendez-vous sur la <a href="https://www.findafresk.org">page du projet</a>, et suivez-nous sur <a href="https://www.linkedin.com/company/trouver-une-fresque">LinkedIn</a> !</span>
    </v-banner>

    <router-view />
    <!-- search card -->
    <v-card class="search-card pa-2 pa-sm-10">
      <v-card-title
        class="d-flex justify-center"
        max-width="600px"
      >
        <h1 style="text-wrap-mode: wrap; max-width: 600px; text-align: center">
          Trouvez une Fresque près de chez vous
        </h1>
      </v-card-title>
      <v-card-text class="d-flex justify-center">
        <SearchField class="d-flex flex-grow-1 justify-center"></SearchField>
      </v-card-text>
    </v-card>

    <!-- logo section -->
    <LogoWall />

    <!-- Q&A section -->
    <QnA />
  </v-container>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
  .search-card {
    background: linear-gradient(
      45deg,
      rgba(var(--v-theme-secondary), 0.6),
      rgba(var(--v-theme-primary), 0.6)
    );
  }
  .greeting-banner {
    background-color: rgba(var(--v-theme-primary), 0.1);
    color: var(--v-theme-primary);
    margin-bottom: 20px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 10px;
  }
</style>
