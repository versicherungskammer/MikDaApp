<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-carousel arrows animated v-model="slide" height="40rem" infinite>
        <q-carousel-slide
          v-for="item in itemList"
          :key="item.id"
          :name="item.id"
          :img-src="item.picture"
        >
          <div class="absolute-bottom custom-caption">
            <div class="text-h2">{{ item.title }}</div>
            <div class="text-subtitle1">{{ item.description }}</div>
          </div>
        </q-carousel-slide>
      </q-carousel>
      <div class="cardwrapper q-pa-md row items-start q-gutter-md">
        <div v-for="item in itemList" :key="item.id" v-bind="item">
          <q-card class="my-card bg-secondary text-white">
            <q-card-section>
              <q-img class="cardPicture" :src="item.picture"></q-img>
              <div class="text-h6">{{ item.title }}</div>
              <div class="text-subtitle2">{{ item.description }}</div>
            </q-card-section>
            <q-separator dark />
            <q-card-actions class="buttons">
              <q-btn @click="buyFunc(item.title)" flat class="leftButton"
                >Buy</q-btn
              >
              <q-btn @click="sellFunc(item.title)" flat class="rightButton"
                >Sell</q-btn
              >
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import firstImage from "/src/assets/image1.jpg";
import secondImage from "/src/assets/image2.jpg";
import thirdImage from "/src/assets/image3.jpg";
import { ref } from "vue";

const slide = ref("style");
slide.value = 1;

const buyFunc = (title) => {
  alert(title + " wurde gekauft!");
};

const sellFunc = (title) => {
  alert(title + " wurde verkauft!");
};

const itemList = [
  {
    id: 1,
    title: "Samsung Galaxy S22",
    description: "Smartphone 1",
    picture: firstImage,
  },
  {
    id: 2,
    title: "Apple iPhone 14",
    description: "Smartphone 2",
    picture: secondImage,
  },
  {
    id: 3,
    title: "Huawei P50 Pro",
    description: "Smartphone 3",
    picture: thirdImage,
  },
  {
    id: 4,
    title: "Apple iPhone 13",
    description: "Smartphone 4",
    picture: secondImage,
  },
  {
    id: 5,
    title: "Huawei P40 Lite",
    description: "Smartphone 5",
    picture: thirdImage,
  },
  {
    id: 6,
    title: "Samsung Galaxy S22",
    description: "Smartphone 6",
    picture: firstImage,
  },
];
</script>

<style scoped>
.buttons {
  display: flex;
  justify-content: space-between;
}

.leftButton {
  width: 5rem;
}
.rightButton {
  width: 5rem;
}

.custom-caption {
  text-align: center;
  padding: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
}

.cardwrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.my-card {
  min-height: 40rem;
}
.cardPicture {
  width: 29rem;
  height: 27rem;
}
</style>
