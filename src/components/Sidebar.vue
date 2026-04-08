<template>
  <div class="w-[300px] h-full bg-white border-r border-gray-200 shadow-sm p-3">
    <MenuItem
        v-for="(item, i) in menuData"
        :key="item.name + i"
        :item="item"
        :selected="selectedItem"
        :depth="0"
        @select="onSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import MenuItem from "@/views/MenuItem.vue";
import {computed, ref} from "vue";

const router = useRouter();

interface MenuNode {
  name: string;
  link?: string;
  children?: MenuNode[];
}

const selectedItem = ref<MenuNode | null>(null);

const onSelect = (item: MenuNode) => {
  selectedItem.value = item;
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
           },
          {
            name: 'Account',
            link: '/account',
           },
          {
            name: 'Categories',
            link: "",
            children: [
              {
                name: "Category",
                link: '/categories',
              },
              {
                name: "Products",
                link: '/products',
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