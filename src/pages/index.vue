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
</style>
