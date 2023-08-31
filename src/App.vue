<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();

    const isMobile = ref(false);

    onMounted(() => {
      isMobile.value = _isMobile();
      console.log('isMobile:', isMobile.value);
      if (isMobile.value) {
        router.replace('/mobile');
      } else {
        router.replace('/main');
      }
    });

    function _isMobile() {
      let device = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      console.log(device);
      return device != null;
    }

    return {
      isMobile,
    };
  },
});
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  text-decoration: none;
  outline: none;
}
#app {
}
</style>
