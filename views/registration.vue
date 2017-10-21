<template>
  <form class="registration" method="post">
    <input type="email" name="email" placeholder="E-mail" required />
    <input type="submit" :value='buttonValue'>
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
