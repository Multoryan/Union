<template>
  <div class="page">
    <h1 class="logo">Union</h1>
    <p>Объедините мысли, организуйте себя</p>
    <form class="authorisation">
      <!-- TODO: По умолчанию вставлять Email если пользователь только со страницы регистрации -->
      <input @input='resetError()' @focus='resetError()' type="email" v-model="email" name="email" placeholder="E-mail" required />
      <input @input='resetError()' @focus='resetError()' type="password" v-model="password" name="password" :placeholder='placePass' required />
      <input type="submit" @click.prevent="sendAuth()" :value='buttonValue'>
    </form>
    <span class="error" v-if="errEmail">{{notEmailErr}}</span>
    <span class="error" v-if="errValid">{{notValidErr}}</span>
    <a href="registration">{{links.registration}}</a>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: "",
      password: "",
      errEmail: false,
      errValid: false
    }
  },
  methods: {
    sendAuth: function () {
      $.ajax({
        type: 'post',
        url: '/auth',
        data: {
          email: this.email,
          password: this.password
        },
        success: (data) => {
          this.errEmail = data === "notIsset";
          this.errValid = data === "wrongPass";
          this.password = "";
        }
      });
    },
    resetError: function () {
      this.errEmail = false;
      this.errValid = false;
    }
  }
}
</script>
