<template>
  <div>
    <Header/>  
    <b-container id="app" class="margins">
      <b-row>
        <b-col>
          <TopStats/>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <TopUsersStats/>
        </b-col>
        <b-col>
          <TopServerStats/>
          <TopCommandsStats/>
        </b-col>
      </b-row>
    </b-container>
    <Footer/>
  </div>
</template>

<script>
import TopUsersStats from './components/TopUsersStats.vue'
import TopCommandsStats from './components/TopCommandsStats.vue'
import TopServerStats from './components/TopServerStats.vue'
import TopStats from './components/TopStats.vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    TopUsersStats,
    TopServerStats,
    TopCommandsStats,
    TopStats,
    Header,
    Footer
  }
}
</script>

<style>
  .margins {
    width: 90%;
    margin-top: 35px !important;
    margin-bottom: 35px !important;
  }
</style>