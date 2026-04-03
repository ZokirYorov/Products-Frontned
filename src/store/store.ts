// import { defineStore } from "pinia/dist/pinia";
// import { useStorage }  from "@vueuse/core";
//
// const useStore = defineStore('store', {
//     state: () => ({
//         products: useStorage('products', []),
//         accounts: useStorage('accounts', []),
//         categories: useStorage('categories',[])
//     }),
//     getters: {
//         getProducts: (state) => state.products,
//         getAccounts: (state) => state.accounts,
//         getCategories:(state) => state.categories,
//     },
//     actions: {
//         setProducts(products) {
//             this.products = products
//         },
//         setAccounts(accounts) {
//             this.accounts = accounts
//         },
//         setCategories(categories){
//             this.categories = categories
//         }
//     }
// })
//
// export default useStore;