<template>
  <div class="page">
    <h1 class="logo">Union</h1>
    <p>Объедините мысли, организуйте себя</p>
    <form class="authorisation" method="post">
      <!-- TODO: По умолчанию вставлять Email если пользователь только со страницы регистрации -->
      <input type="email" name="email" placeholder="E-mail" required />
      <input type="password" name="password" :placeholder='placePass' required />
      <input type="submit" :value='buttonValue'>
    </form>
    <a href="registration">Зарегистрироваться</a>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  }
}
</script>
