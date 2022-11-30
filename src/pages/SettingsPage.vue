<template>
  <!-- <div class="darkModeButton">
    <q-btn
      round
      color="black"
      icon="dark_mode"
      size="11px"
      clickable
      @click="toggleDarkMode()"
    />
  </div> -->
  <div class="darkModeGroup">
    <div class="themeText">Theme:</div>
    <div class="darkLightModeButtons">
      <q-btn
        class="darkButton"
        push
        color="primary"
        label="Dark"
        @click="darkMode()"
      />
      <q-btn
        class="lightButton"
        push
        color="primary"
        label="Light"
        @click="lightMode()"
      />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";

const $q = useQuasar();

const toggleDarkMode = () => {
  $q.dark.toggle();
};

const darkMode = () => {
  $q.dark.set(true);
};
const lightMode = () => {
  $q.dark.set(false);
};
</script>

<style scoped>
.darkLightModeButtons {
  margin: 1rem;
}
.darkButton {
  margin-right: 1rem;
}
.themeText {
  margin-left: 1rem;
  font-size: 30px;
  color: white;
}
.darkModeGroup {
  margin-top: 1rem;
}
</style>
