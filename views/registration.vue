<template>
  <div class="ui grid container">
     <div class="six wide tablet four wide computer sixteen wide mobile column centered">
      <h2 class="ui header center aligned">Union<div class="sub header">Органайзер</div></h2>
      <div class="ui pointing secondary menu">
        <a class="item active" data-tab="registration">{{title}}</a>
        <a class="item" data-tab="authorisation">Авторизация</a>
      </div>
      <div class="ui tab active" data-tab="registration">
        <!-- <h3 class="ui header center aligned">Регистрация</h3> -->
        <form class="ui form" :class="{'loading': isLoading }" id="registration">
            <div class="ui left icon input field">
              <input autofocus type="email" class="input_email" @input='resetError()' @focus='resetError()' v-model='email' name="email" placeholder="E-mail" required />
              <i class="mail outline icon"></i>
            </div>
          <button
          id="captcha"
          class="g-recaptcha green fluid ui button"
          :class="{'disabled': isPushed}"
          @click="inLoad()">
          {{buttonValue}}
          </button>
          <!-- <div v-if="loading" class="ui active centered inline loader"></div> -->
          <div :class="{'visible': errMail}" class="ui error message">
            <div class="header">Ошибка регистрации</div>
            <p>{{issetEmailErr}}</p>
          </div>
          <div  :class="{'visible': errSendMail}" class="ui error message">
            <div class="header">Ошибка отправки пароля</div>
            <p>{{sendEmailErr}}</p>
          </div>
          <div   :class="{'visible': errCaptcha}" class="ui error message">
            <div class="header">Капча не введена</div>
            <p>{{testBot}}</p>
          </div>
        </form>
      </div>
      <div class="ui tab segment" data-tab="authorisation">
        <h3>Авторизация</h3>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      email: "",
      errCaptcha: false,
      errMail: false,
      errSendMail: false,
      isLoading: false,
      isPushed: false,
      isInit: false
    }
  },
  methods: {
    initReCaptcha: function() {
            grecaptcha.render('captcha', {
                sitekey: '6LeCMDYUAAAAAC7ptc0La6HqQFCZZaRWEpAhIcZw',
                callback: this.regUser
            });
    },
    inLoad: function () {
      this.isPushed = true;
      this.isLoading = true;
    },
    regUser: function () {
      this.errCaptcha = false;
      this.errMail = false;
      this.errSendMail = false;
      $.ajax({
        type: "post",
        url: "/registration",
        data: $("#registration").serialize(),
        success: (data) => {
          grecaptcha.reset();
          // Показать ошибку в случае нахождения Email в базе данных
          this.errMail = data === 'duplicateEmail';
          this.errSendMail = data === 'notSend';
          this.errCaptcha = data === 'bot';
          this.isLoading = false;
          this.isPushed = false;
          // Регистрация прошла успешно, перенаправить на авторизацию
          if (data === 'good') window.location.href = '/auth';
        }
      })
    },
    resetError: function () {
      this.errMail = false;
      // Регулярное выражение на проверку email
      const regEmail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
      // TODO: Инициализировать нужно только первый раз, далее - скрывать или отображать
      if (this.email.match(regEmail) && !this.isInit){
          this.initReCaptcha();
          this.isInit = true;
      }

    }
  }
}
</script>

<style scoped>
.grid{
  margin-top: 60px !important;
}
.input.field{
  width: 100%;
}
</style>
