/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes as autoRoutes } from 'vue-router/auto-routes'

// Import your components
import Apropos from '@/pages/Apropos.vue'
import Carte from '@/pages/Carte.vue'
import Mentions from '@/pages/Mentions.vue'
import SearchResults from '@/pages/SearchResults.vue'
import {
  rechercheCommuneDescriptor,
  rechercheDepartementDescriptor,
} from '@/routing/DynamicURLs'

export const ROUTE_MAP = 'map' as string
export const ROUTE_ABOUT = 'about' as string
export const ROUTE_LEGAL = 'legal' as string
export const ROUTE_SEARCH_DPT = 'searchDpt' as string
export const ROUTE_SEARCH_CITY = 'searchCom' as string

// Define additional routes
const additionalRoutes = [
  {
    name: ROUTE_MAP,
    path: '/carte',
    component: Carte,
  },
  {
    name: ROUTE_ABOUT,
    path: '/apropos',
    component: Apropos,
  },
  {
    name: ROUTE_LEGAL,
    path: '/mentions-legales',
    component: Mentions,
  },
  {
    name: ROUTE_SEARCH_DPT,
    path: rechercheDepartementDescriptor.routerUrl,
    component: SearchResults,
  },
  {
    name: ROUTE_SEARCH_CITY,
    path: rechercheCommuneDescriptor.routerUrl,
    component: SearchResults,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts([...autoRoutes, ...additionalRoutes]),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
