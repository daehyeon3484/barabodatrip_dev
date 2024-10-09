<template>
    <main class="mt-3">
      <div class="container">
        <h2 class="text-center">json 파싱</h2>
      </div>
    </main>
</template>

<script>
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
    methods: {
    init() {
      let data = {
    "title" : "マイページ",
    "pay_history" : "決済履歴",
    "passport_file" : "パスポートファイル",
    "passport" : "パスポート番号",
    "bisa_file" : "ビザファイル",
    "bisa" : "非自承認番号"
  }
      let arr = []
      Object.keys(data).forEach(key => {
        arr.push(key)
      })
      console.log(arr)
      let arr1 = []
      Object.values(data).forEach(value => {
        arr1.push(value)
      })
      console.log(arr1)
      
    }
  }
}
</script>

<style>

</style>