<template>
    <main class="mt-3">
      <div class="container">
        <h2 class="text-center">로그아웃</h2>
      </div>
    </main>
</template>

<script>
import {generateSessionStorage} from '@/storage'
const sessionStorage = generateSessionStorage()
export default {
    data() {
        return {
          popup : null
        }
    },
    created() {
    },
    mounted() {
      this.init()
    },
    methods : {
      init() {
        this.$store.commit("user", {});
        console.log("logout")
        window.location.reload(true)
        window.location.href=`/?lan_tp=${sessionStorage.get('lan_tp')}`
        // this.$router.push({path: "/", query : {lan_tp : sessionStorage.get('lan_tp')} })
      }
    }
}
</script>

<style>

</style>