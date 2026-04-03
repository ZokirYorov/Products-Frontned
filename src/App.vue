<template>
  <router-view/>

</template>


<!--<script>-->
<!--// import {  defineComponent } from "vue";-->
<!--// import headerVue from "./components/Header.vue";-->
<!--import sidebarVue from "./components/Sidebar.vue";-->
<!--import headerVue from "@/components/Header.vue";-->

<!--// export default defineComponent({-->
<!--//-->
<!--//   components: {-->
<!--//     headervue,-->
<!--//     sidebarvue,-->
<!--//   },-->
<!--//   data() {-->
<!--//     return {-->
<!--//       openMenuRouter: "about",-->
<!--//       menuOchilishi: true-->
<!--//     }-->
<!--//   },-->
<!--//   methods: {-->
<!--//     routerMenu(name) {-->
<!--//       this.$router.push(name)-->
<!--//     },-->
<!--//     sidebarToggle(){-->
<!--//       this.menuOchilishi = !this.menuOchilishi-->
<!--//     }-->
<!--//   }-->
<!--// })-->

<!--</script>-->

<!--<template>-->
<!--  <div class="container">-->
<!--    <div-->
<!--        class="sidebar"-->
<!--        :style="`width: ${menuOchilishi ? 250 : 70}px`"-->
<!--       >-->
<!--        <sidebarVue-->
<!--          @click-router="routerMenu"-->
<!--          :open="openMenuRouter"-->
<!--          :isCollapsed="!menuOchilishi"-->
<!--      />-->
<!--    </div>-->
<!--    <div class="content"-->
<!--         :style="`width: calc(100% - ${menuOchilishi ? 250 : 70}px)`"-->
<!--    >-->
<!--      <div class="header">-->
<!--        <headerVue @menu-toggle="sidebarToggle()" />-->
<!--      </div>-->
<!--      <div class="router"><router-view /></div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<style scoped>-->
<!--.container{-->
<!--  width: 100%;-->
<!--  margin: 0;-->
<!--  height: 100vh;-->
<!--  display: flex;-->

<!--}-->
<!--.header{-->
<!--  width: 100%;-->
<!--  height: 80px;-->
<!--  color: white;-->
<!--  display: flex;-->
<!--  background-color: #6fd2d5;-->
<!--  border-bottom: 3px solid #20779d;-->
<!--}-->
<!--.sidebar{-->
<!--  display: flex;-->
<!--  height: 100%;-->
<!--  color: white;-->
<!--}-->
<!--.content{-->
<!--  height: 100%;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--}-->
<!--.router{-->
<!--  padding: 10px;-->
<!--  background-color: #b7cdce;-->
<!--  height: calc(100% - 80px);-->
<!--}-->
<!--</style>-->
<script setup lang="ts">
</script>