<template>
  <div class="template">
    <p>Вы авторизованы</p>
    <button @click="exit()">Exit</button>
    <a href="/change">Сменить пароль</a>
    <a href="/org">Органайзер</a>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
    }
  },
  methods: {
    exit: function () {
      $.ajax({
        type: 'get',
        url: '/exit',
        success: function (data) {
          console.log(data);
          if(data === "exit")
            window.location.href = "/auth";
        }
      });
    }
  }
}
</script>
