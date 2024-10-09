<template>
    <div class="overlay">
      <img src="../img/splash/idt_splash_cn_916.png" alt="Image" />
    </div>
  </template>
  <script>
  export default {
    props: {
        isloading: {
        type: Boolean,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .overlay {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5); /* 반투명 배경 */
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 10px; /* 모서리를 둥글게 */
  }
  
  .overlay img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
  </style>
  