<template>
  <div>
    <p class="error" v-if="error">{{ error }}</p> 
    <b-container>
      <b-row>
        <b-col>
          <h1>Uses: {{ totalStats.recordedcount }}</h1>
        </b-col>
        <b-col>
          <h1>Servers: {{ totalServers.nbservers }}</h1>
        </b-col>
        <b-col>
          <h1>Users: {{ totalUsers.uniqueusers }}</h1>
        </b-col>
      </b-row>
    </b-container>
    <hr>
  </div>
</template>

<script>
import StatsService from '../StatsService'

export default {
  name: 'TopStats',
  data () {
    return {
      totalStats: [],
      totalServers: [],
      totalUsers: '',
      error: ''
    }
  },
  async created() {
    try {
      this.totalStats = await StatsService.getTotalTriggers()
      this.totalServers = await StatsService.getTotalServers()
      this.totalUsers = await StatsService.getTotalUsers()
    } catch(err) {
      this.error = err.message
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 1px 1px 2px 2px #000;
  padding: 15px;
  margin: 10px 0px;
}

.row {
  padding-top: 5px;
  padding-bottom: 5px;
}

p.error {
  border: 1px solid #ff5b5f; background-color: #ffc5c1; padding: 10px; margin-bottom: 15px;
}

</style>