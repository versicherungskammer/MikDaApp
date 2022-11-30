<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Quasar App </q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          <div v-for="link in linksList" :key="link.title" v-bind="link">
            <q-item clickable @click="goTo(link.link), toggleLeftDrawer()">
              <q-item-section v-if="link.icon" avatar>
                <q-icon :name="link.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ link.title }}</q-item-label>
                <q-item-label caption>{{ link.caption }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-item-label>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

const leftDrawerOpen = ref(false);
const router = useRouter();

const goTo = (link) => {
  router.push({ path: link });
};

const linksList = [
  {
    title: "Home",
    caption: "Caption test",
    icon: "home",
    link: "/",
  },
  {
    title: "Shop",
    caption: "Browse our items",
    icon: "shopping_cart",
    link: "shop",
  },
  {
    title: "Three.js Testing",
    caption: "Three.js",
    icon: "forest",
    link: "three",
  },
  {
    title: "Settings",
    caption: "Settings",
    icon: "settings",
    link: "settings",
  },
];

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>

<style scoped>
.darkModeButton {
  padding-left: 1rem;
}
</style>
