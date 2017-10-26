import Vue from 'vue'
import Router from 'vue-router'
import Do from '@/components/Do'
import ListDo from '@/components/ListDo'
import FolderDo from '@/components/FolderDo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Router',
      components: {
        Do: Do,
        ListDo: ListDo,
        FolderDo: FolderDo
      }
    }
  ]
})
