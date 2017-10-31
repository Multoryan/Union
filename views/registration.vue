<template>
  <div class="ui grid container">
     <div class="six wide tablet four wide computer sixteen wide mobile column centered">
      <h2 class="ui header center aligned">Union<div class="sub header">Органайзер</div></h2>
      <div class="ui pointing secondary menu">
        <a class="item" :class="{'active': toggle}" @click="{toggle = true}" data-tab="registration">{{registration.title}}</a>
        <a class="item" :class="{'active': !toggle}" @click="{toggle = false}" data-tab="authorisation">{{authorisation.title}}</a>
      </div>
      <div class="ui tab" :class="{'active': toggle}" data-tab="registration">
        <form class="ui form" :class="{'loading': isLoading }" id="registration">
            <div class="ui left icon input field"  :class="{'error': isEmpty }">
              <input autofocus type="email" class="input_email" @input='resetError()' @focus='resetError()' v-model='email' name="email" placeholder="E-mail" required />
              <i class="mail outline icon"></i>
            </div>
          <button
          id="captcha"
          class="g-recaptcha green fluid ui button"
          :class="{'disabled': isPushed}"
          @click="inLoad()">
          {{registration.buttonValue}}
          </button>
          <div :class="{'visible': errMail}" class="ui error message">
            <div class="header">Ошибка регистрации</div>
            <p>{{registration.issetEmailErr}}</p>
          </div>
          <div  :class="{'visible': errSendMail}" class="ui error message">
            <div class="header">Ошибка отправки пароля</div>
            <p>{{registration.sendEmailErr}}</p>
          </div>
          <div   :class="{'visible': errCaptcha}" class="ui error message">
            <div class="header">Капча не введена</div>
            <p>{{registration.testBot}}</p>
          </div>
        </form>
      </div>
      <div class="ui tab"  :class="{'active': !toggle}" data-tab="authorisation">
        <form class="ui form" id="authorisation" :class="{'loading': isLoadingAuth }" >
          <div class="ui left icon input field"  :class="{'error': isEmpty }">
            <input autofocus type="email" v-model="email" class="input_email" @input='resetError()' @focus='resetError()' v-model='email' name="email" placeholder="E-mail" required />
            <i class="mail outline icon"></i>
          </div>
          <div class="ui input left icon field">
            <input type="password" name="password" v-model="password" @input='resetError()' @focus='resetError()' placeholder="Пароль" required />
            <i class="unlock alternate icon"></i>
          </div>
          <button
          id="captchaAuth"
          class="g-recaptcha green fluid ui button"
          :class="{'disabled': isPushedAuth}"
          @click="inLoadAuth()">
          {{authorisation.buttonValue}}
          </button>
          <div   :class="{'visible': errAuthEmailEmpty}" class="ui error message">
            <div class="header">Такой email не зарегистрирован</div>
            <p>{{authorisation.notEmailErr}}</p>
          </div>
          <div   :class="{'visible': errAuthValidPass}" class="ui error message">
            <div class="header">Неверный пароль</div>
            <p>{{authorisation.notValidErr}}</p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      email: "", // E-mail введенный пользователем
      password: "", // Пароль введенный пользователем
      errAuthEmailEmpty: false, // Пустой пароль при авторизации
      errAuthValidPass: false, // Неверный пароль при авторизации
      errCaptcha: false, //Состояние ошибки ввода капчи
      errMail: false, // Состояние ошибки повторяющегося E-mail в базе
      errSendMail: false, // Состояние ошибки отправки письма с паролем
      errRenderField: false, // Отображение ошибки с указанием на поле
      isEmpty: false, // Пустое ли поле E-mail
      isInit: false, // Инициализирована ли капча
      isLoading: false, // Запустить ли загрузку
      isLoadingAuth: false, // Запустить загрузку
      isPushedAuth: false, // Нажата ли кнопка
      isPushed: false, // Нажата ли кнопка
      toggle: true // Переключение регистрации и авторизации
    }
  },
  methods: {
    // Инициализация капчи
    initReCaptcha: function() {
            grecaptcha.render('captcha', {
                sitekey: '6LeCMDYUAAAAAC7ptc0La6HqQFCZZaRWEpAhIcZw',
                callback: this.regUser
            });
            grecaptcha.render('captchaAuth', {
                sitekey: '6LeCMDYUAAAAAC7ptc0La6HqQFCZZaRWEpAhIcZw',
                callback: this.sendAuth
            });
    },
    inLoad: function () {
      const regEmail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
      if (!this.email || !this.email.match(regEmail)){
          grecaptcha.reset(captcha);
          grecaptcha.reset(captchaAuth);
          this.isEmpty = true;
          this.errRenderField = true;
      }else{
        this.isPushed = true;
        this.isLoading = true;
      }
    },
    inLoadAuth: function () {
      this.isPushedAuth = true;
      this.isLoadingAuth = true;
    },
    // Авторизация пользователя
    sendAuth: function () {
      $.ajax({
        type: 'post',
        url: '/auth',
        data: {
          email: this.email,
          password: this.password
        },
        success: (data) => {
          // Ошибка, Email не найден в базе данных
          this.errAuthEmailEmpty = data === "notIsset";
          // Ошибка, неверный пароль
          this.errAuthValidPass = data === "wrongPass";
          // Сбрасываем пароль, индикатор загрузки и делаем кнопку снова активной
          this.password = "";
          this.isPushedAuth = false;
          this.isLoadingAuth = false;
          if (data === "good") window.location.href = '/';
        }
      });
    },
    // Регистрация пользователя
    // Вызывается после прохождения капчи
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
          if (data === 'good') this.toggle = false;
        }
      })
    },
    // Сброс отображаемых ошибок
    resetError: function () {
      this.errMail = false;
      // Регулярное выражение на проверку email
      const regEmail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
      //Инициализировать нужно только первый раз, далее - скрывать или отображать
      if (this.email.match(regEmail) && !this.isInit){
          this.initReCaptcha();
          this.isInit = true;
      }
      this.isEmpty = false;
      this.errRenderField = false;
    }
  }
}
</script>

<style scoped>
body{
  height: auto !important;
}
.grid{
  margin-top: 60px !important;
}
.input.field{
  width: 100%;
}
</style>
