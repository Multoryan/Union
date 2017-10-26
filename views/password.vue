<template>
<div class="password">
  <form>
    Старый пароль
    <input type="password" required v-model="oldpass" />
    Новый пароль
    <input type="password" required v-model="newpass" />
    Повторите пароль
    <input type="password" required v-model="againpass" />
    <input type="submit" @click.prevent="updatePassword()" />
  </form>
</div>
</template>

<script>

  export default {
    name: "password",
      data: function () {
          return {
            oldpass: "",
            newpass: "",
            againpass: ""
          }
      },
      methods: {
        updatePassword:function () {
          // TODO: Проверка пароля на сложность
          console.log(this.newpass);
          console.log(this.againpass);
          const reg = /[а-яё\s]/ig;
          if (this.newpass.match(reg))
            console.log('Недопустимые символы')
          if (this.newpass !== this.againpass)
            console.log('пароли не равны')
          else
            console.log('нормально')
          // $.ajax({
          //   type: 'post',
          //   url: '/changepass',
          //   data: {
          //     oldpass: this.oldpass,
          //     newpass: this.newpass
          //   },
          //   success: (result) => {
          //     this.errWrongPass = data === "wrongPass";
          //   }
          //})
        }
      }
  }
</script>
