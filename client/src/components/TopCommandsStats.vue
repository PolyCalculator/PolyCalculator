<template>
  <div>
    <p class="error" v-if="error">{{ error }}</p> 
    <b-container>
      <b-row>
        <b-col>
          <h2>Top {{ limit }} commands</h2>
        </b-col>
      </b-row>
      <b-row v-for="(command, index) in commandStats"
        v-bind:index='index'
        v-bind:key="command.count"
      >
        <b-col sm="8" class="h5">{{ commandStats[index].command }}:</b-col>
        <b-col sm="4" class="h5">{{ commandStats[index].count }}</b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import StatsService from '../StatsService'

export default {
  name: 'TopCommandsStats',
  data () {
    return {
      commandStats: [],
      error: '',
      limit: ''
    }
  },
  async mounted() {
      this.limit = 5;
      this.commandStats = await StatsService.getTopCommands()
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
  margin-bottom: 2em;
}

.row {
  padding-top: 5px;
  padding-bottom: 5px;
}

p.error {
  border: 1px solid #ff5b5f; background-color: #ffc5c1; padding: 10px; margin-bottom: 15px;
}

</style>
