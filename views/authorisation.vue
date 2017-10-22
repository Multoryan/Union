<template>
  <form class="authorisation" method="post">
    <!-- TODO: По умолчанию вставлять Email если пользователь только со страницы регистрации -->
    <input type="email" name="email" placeholder="E-mail" required />
    <input type="password" name="password" :placeholder='placePass' required />
    <input type="submit" :value='buttonValue'>
    <a href="registration">Зарегистрироваться</a>
  </form>
</template>

<script>
export default {
  data () {
    return {

    }
  }
}
</script>
