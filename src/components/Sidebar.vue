<template>
  <div class="w-[350px] bg-white/50 border-r-2 border-gray-400 text-gray-800 p-8">
    <MenuItem
        v-for="item in menuData"
        :key="item.name"
        :item="item"
        :depth="0"
        @select="onSelect"
    />
  </div>

</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import MenuItem from "@/views/MenuItem.vue";
import {computed} from "vue";

const router = useRouter();


interface MenuNode {
  name: string;
  link: string;
  children?: MenuNode[];
}

const onSelect = (item: MenuNode) => {
  if (item.link) {
    router.push(item.link);
  }
}

const menuData = computed<MenuNode[]>(() =>  [
      {
        name : "About",
        link: "",
        children: [
          {
            name: 'About',
            link: '/about',
            children: []
          },
          {
            name: 'Account',
            link: '/account',
            children: []
          },
          {
            name: 'Categories',
            link: "",
            children: [
              {
                name: "Categories",
                link: '/categories',
                children: []
              },
              {
                name: "Products",
                link: '/products',
                children: []
              },
            ]
          },
        ]
      },
      {
        name: "Categories2",
        link: '/categories2'
      }
    ]
)
</script>

<style scoped>

</style>