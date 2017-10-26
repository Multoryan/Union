<template>
  <div class='folders'>
    <div class='navigation'>
      <input placeholder="Добавить папку" type="text" class='newFolder' v-model='newFolder' @keyup.enter='addFolder()' />
      <ul>
        <li v-for='(item,index) in folders' :class="[index === currentFolder ? 'current' : '']" @click='changeFolder(index)' v-if='item !== ""'>{{item}}
          <span class='delIcon' @click='deleteFolder(index)' v-show='index !== 0'>X</span>
        </li>
      </ul>
    </div>
    <listdo v-for='(item,index) in folders' v-show='index === currentFolder' />
  </div>
</template>


<script>
import ListDo from './ListDo'

export default{
  name: 'FolderDo',
  data () {
    return {
      newFolder: '',
      currentFolder: 0,
      folders: ['По умолчанию', 'Учеба', 'Работа', 'Личные дела']
    }
  },
  methods: {
    changeFolder: function (index) {
      this.currentFolder = index
    },
    addFolder: function () {
      this.folders.push(this.newFolder)
      this.newFolder = ''
    },
    deleteFolder: function (index) {
      this.folders.splice(index, 1, '')
    }
  },
  components: {
    listdo: ListDo
  }
}

</script>


<style>
 .navigation{
   float: left;
   width: 200px;
   height: 100%;
 }
 .navigation ul{
   list-style: none;
   padding-left: 0px;
 }
 .navigation ul li{
   width: 130px;
   padding: 10px 30px;
   transition: background-color .2s ease-in;
   cursor: pointer;
 }
 .navigation ul li:hover:not(.current){
   background-color: #eee;
 }
 .newFolder{
   padding-left: 10px;
   outline: none;
   height: 25px;
   border-radius: 5px;
 }
 .navigation ul li:hover:not(.current) .delIcon {
   opacity: 1;
 }
 .delIcon{
   transition: all .2s ease-in;
   opacity: 0;
   font-family: Arial;
   padding: 10px;
   text-transform: lowercase;
   text-decoration: none;
   color: #f00;
 }
 .navigation ul .current{
   background-color: #bbb;
 }
</style>
