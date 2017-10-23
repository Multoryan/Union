<template>
  <div class="page">
    <form class="registration" method="post">
      <input type="email" @input='resetError()' @focus='resetError()' v-model='email' name="email" placeholder="E-mail" required />
      <input type="submit" :value='buttonValue' @click.prevent="regUser()" />
    </form>
    <span class="error" v-if='errMail'>{{issetEmailErr}}</span>
    <p>Пароль будет выслан на указанный E-mail</p>
  </div>
</template>

<script>

export default {
  data () {
    return {
      email: "",
      errMail: false
    }
  },
  methods: {
    regUser: function () {
      $.ajax({
        type: "post",
        url: "/registration",
        data: {
          email: this.email
        },
        success: (data) => {
          // Показать ошибку в случае нахождения Email в базе данных
          this.errMail = data === 'duplicateEmail';
          // Регистрация прошла успешно, перенаправить на авторизацию
          if (data === 'good')
            window.location.href = '/auth';
        }
      })
    },
    resetError: function () {
      this.errMail = false;
    }
  }
}
</script>
