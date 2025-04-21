<template>
  <v-container max-width="1200px">
    <div class="px-5">
      <h2 class="text-h2 text-primary mb-6">{{ t('taskforce.title') }}</h2>
      <!-- Intro paragraph -->
      <p class="mb-4">{{ t('taskforce.intro') }}</p>

      <!-- Restore original content sections inside the container -->
      <section class="my-12">
        <h2 class="mb-4">{{ t('taskforce.goal.title') }}</h2>
        <p class="text-h6">{{ t('taskforce.goal.text') }}</p>
      </section>

      <section class="my-12">
        <p class="">{{ t('taskforce.structure.title') }}</p>

        <v-row class="mt-6">
          <!-- Multi-workshop Ecosystem -->
          <v-col
            class="d-flex"
            cols="12"
            md="4"
          >
            <v-card
              class="d-flex flex-column flex-grow-1"
              elevation="2"
              rounded="lg"
            >
              <div class="card-title pa-3">
                {{ t('taskforce.structure.ecosystem.title') }}
              </div>
              <v-divider></v-divider>
              <v-card-text class="text-body-1 flex-grow-1 pa-4">
                <ul
                  class="pl-5"
                  style="list-style: disc"
                >
                  <li>{{ t('taskforce.structure.ecosystem.point1') }}</li>
                  <li>{{ t('taskforce.structure.ecosystem.point2') }}</li>
                </ul>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Global Digital Tools and Platforms -->
          <v-col
            class="d-flex"
            cols="12"
            md="4"
          >
            <v-card
              class="d-flex flex-column flex-grow-1"
              elevation="2"
              rounded="lg"
            >
              <div class="card-title pa-3">
                {{ t('taskforce.structure.tools.title') }}
              </div>
              <v-divider></v-divider>
              <v-card-text class="text-body-1 flex-grow-1 pa-4">
                <ul
                  class="pl-5"
                  style="list-style: disc"
                >
                  <li>{{ t('taskforce.structure.ecosystem.point3') }}</li>
                  <li>{{ t('taskforce.structure.tools.point1') }}</li>
                  <li>{{ t('taskforce.structure.tools.point3') }}</li>
                </ul>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Local Communities -->
          <v-col
            class="d-flex"
            cols="12"
            md="4"
          >
            <v-card
              class="d-flex flex-column flex-grow-1"
              elevation="2"
              rounded="lg"
            >
              <div class="card-title pa-3">
                {{ t('taskforce.structure.local.title') }}
              </div>
              <v-divider></v-divider>
              <v-card-text class="text-body-1 flex-grow-1 pa-4">
                <ul
                  class="pl-5"
                  style="list-style: disc"
                >
                  <li>{{ t('taskforce.structure.local.point1') }}</li>
                  <li>{{ t('taskforce.structure.local.point2') }}</li>
                  <li>{{ t('taskforce.structure.local.point3') }}</li>
                  <li>{{ t('taskforce.structure.local.point4') }}</li>
                </ul>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <section class="my-12">
        <h2 class="mb-4">{{ t('taskforce.progress.title') }}</h2>

        <div class="d-flex flex-column">
          <div>
            <h3 class="text-h6 mb-2">
              {{ t('taskforce.progress.team.title') }}
            </h3>
            <p>{{ t('taskforce.progress.team.text1') }}</p>
            <v-btn
              class="card-action-button"
              color="primary"
              block
              size="large"
              href="mailto:hello+join-team@findafresk.org"
            >
              {{ t('taskforce.button.joinTeam') }}
            </v-btn>
          </div>

          <div>
            <h3 class="text-h6 mb-1">
              {{ t('taskforce.progress.consulting.question') }}
            </h3>
            <p>{{ t('taskforce.progress.consulting.understand') }}</p>
            <ul
              class="pl-5 mb-2"
              style="list-style: disc"
            >
              <li>{{ t('taskforce.progress.consulting.point1') }}</li>
              <li>{{ t('taskforce.progress.consulting.point2') }}</li>
              <li>{{ t('taskforce.progress.consulting.point3') }}</li>
            </ul>
            <p>{{ t('taskforce.progress.consulting.support') }}</p>

            <v-btn
              class="card-action-button"
              color="primary"
              block
              size="large"
              href="mailto:hello+interview@findafresk.org"
            >
              {{ t('taskforce.interviewUs') }}
            </v-btn>
          </div>

          <div>
            <h3 class="text-h6 mt-2 mb-1">
              {{ t('taskforce.progress.mapping.question') }}
            </h3>
            <p>{{ t('taskforce.progress.mapping.compile') }}</p>

            <v-btn
              class="card-action-button"
              color="primary"
              block
              size="large"
              :to="'/local-groups'"
            >
              {{ t('taskforce.button.discoverLocalGroups') }}
            </v-btn>
          </div>
        </div>
      </section>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  // No longer using the 'sections' array as content is explicit
</script>

<style scoped lang="scss">
  /* Keep necessary styles */
  ul {
    padding-left: 20px;
    list-style: disc;
  }

  /* Add styles from index.vue */
  .card-title {
    font-size: 1.15rem;
    font-weight: 600;
    line-height: 1.4;
    text-align: center;
    width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    min-height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--v-theme-primary);
  }

  .card-description {
    // Added in case needed later, though not used in the list items
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }

  /* Remove old Quasar-specific styles */
  /* .my-card removed */

  /* Add other styles as required */
</style>

<route>
{
  name: 'taskforce',
  path: '/taskforce'
}
</route>
