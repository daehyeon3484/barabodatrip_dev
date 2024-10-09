<template>
  <div :class="isMobile == true ? 'mobile-lg pt-2' : 'pt-2 loading-div'"> 
    <div class="d-flex justify-content-center" > 
      <div class="spinner-grow text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-info" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-dark" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>          
</template>
<script>

export default {
  data() {
    return {
      isLodings : false
    }
  },
  props : {
    isLoading : Boolean
  },
  watch:{
    isLoading: {
      handler( newVal, oldVal ){
        console.log( 'newVal:', newVal, 'oldVal:', oldVal )
        this.isLodings = newVal
        
      },
      // deep: true
    }
  },
  mounted() {
  
  },
  created() {


  },
  methods : {
    
  }

}
</script>

<style>

</style>