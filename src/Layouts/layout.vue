<template>
  <div class="h-screen w-full flex flex-col">
    <Header class="fixed flex-1 top-0 left-0 right-0 z-40" />

    <div class="flex flex-1 mt-14">
<!--      <Sidebar class="" />-->
      <RouterView class="flex-1 w-full h-full p-4"/>
    </div>
  </div>
</template>


<script setup lang="ts">
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
import { onBeforeUnmount, onMounted, ref} from "vue";

const isOnActive = ref(false);


const handleScroll = () => {
  isOnActive.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
})
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
})
</script>


<style scoped>

.scrollBtn {
  z-index: 999;
  position: fixed;
  color: white;
  width: 45px;
  height: 45px;
  right: 5px;
  bottom: 30px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  line-height: 45px;
  border-radius: 3px;
  cursor: pointer;
  opacity: 0;
  transition: all .3s ease;
}
.scrollBtn.activeScroll {
  opacity: 1;
  right: 20px;
}
</style>