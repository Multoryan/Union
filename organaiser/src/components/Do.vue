<template>
  <div class='do' v-if='isVisible'>
    <span @click='taskDone()' class="check">v</span>
    <input type='text' v-model='text' v-focus v-if='isEditing' @blur='editToggle()' />
    <label @dblclick='editToggle()' :class='{done: isComplete}' v-else>{{text}}</label>
    <span @click='taskDelete()' class="iconDelete">x</span>
  </div>
</template>

<script>
  export default {
    name: 'Do',
    props: ['do', 'filterType', 'search'],
    data () {
      return {
        text: this.do,
        isComplete: false,
        isEditing: false,
        isDelete: false
      }
    },
    computed: {
      isVisible: function () {
        let result = false
        switch (this.filterType) {
          case 'All': result = true
            break
          case 'Active': result = !this.isComplete
            break
          case 'NotActive': result = this.isComplete
            break
        }
        if (this.isDelete) {
          result = false
        }
        if (result) {
          result = this.text.indexOf(this.search) + 1
        }
        return result
      }
    },
    methods: {
      editToggle: function () {
        // Выполненная задача не редактируется
        if (this.isComplete) {
          return false
        }
        // Пустая задача автоматически удаляется
        if (!this.text) {
          this.taskDelete()
        }
        // Переключение режима редактирования
        this.isEditing = !this.isEditing
      },
      taskDone: function () {
        this.isComplete = !this.isComplete
      },
      taskDelete: function () {
        // Удаление достигается отметкой флага
        this.isDelete = true
      }
    },
    directives: {
      focus: {
        inserted: function (el) {
          el.focus()
        }
      }
    }
  }
</script>

<style>
  .do{
    cursor: pointer;
    user-select: none;
  }
  .done{
    text-decoration: line-through;
  }
  .iconDelete{
    font-family: Arial;
    padding: 10px;
    text-transform: lowercase;
    text-decoration: none;
    color: #f00;
  }
  .check{
    text-transform: lowercase;
    font-family: Arial;
    border-radius: 50%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #eee;
    color: #080;
  }
</style>
