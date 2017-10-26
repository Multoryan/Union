<template>
  <div class='reestr'>
    <span @click='changeFilter("All")'>All</span>
    <span @click='changeFilter("Active")'>Active</span>
    <span @click='changeFilter("NotActive")'>Complete</span>
    <input type="text" v-model='search' placeholder='Поиск' />
    <input type="text" v-model='todo' placeholder='Что нужно сделать?' @keyup.enter='addToList()' />
    <div v-for='item in list' is='todo' :do='item' :filterType='filterList' :search='search'></div>
  </div>
</template>

<script>
import Do from './Do.vue'

export default {
  name: 'ListDo',
  data () {
    return {
      search: '',
      filterList: 'All',
      todo: '',
      list: []
    }
  },
  methods: {
    addToList: function () {
      this.list.push(this.todo)
      this.todo = ''
    },
    changeFilter: function (type) {
      this.filterList = type
    }
  },
  components: {
    todo: Do
  }
}
</script>
