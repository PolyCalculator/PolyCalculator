<template>
  <div>
    <p class="error" v-if="error">{{ error }}</p> 
    <b-container>
      <b-row>
        <b-col>
          <h2>Top {{ limit }} users</h2>
        </b-col>
      </b-row>
      <b-row v-for="(user, index) in userStats"
        v-bind:index='index'
        v-bind:key="user.count"
      >
        <b-col sm="8" class="h5">{{ userStats[index].author_tag }}:</b-col>
        <b-col sm="4" class="h5">{{ userStats[index].count }}</b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import StatsService from '../StatsService'

export default {
  name: 'TopUserStats',
  data () {
    return {
      userStats: [],
      error: '',
      text: '',
      limit: ''
    }
  },
  // watch: {
  //   name(newLimit) {
  //     localStorage.limit = newLimit;
  //   }
  // },
  async mounted() {
  //   if (localStorage.limit && localStorage.limit <= 20) {
  //     this.limit = localStorage.limit;
  //   } else {
      this.limit = 10;
  //     localStorage.limit = this.limit
  //   }
  //   try {
      this.userStats = await StatsService.getTopUsers(this.limit)
  //   } catch(err) {
  //     this.error = err.message
  //   }
  }//,
  // methods: {
  //   persist: function () {
  //     if(this.limit > 20){
  //       this.error = "Maximum of 20 users"
  //       this.limit = 20
  //     }
  //     localStorage.limit = this.limit
  //     setTimeout(function() {
  //       location.reload();
  //     }, 1000)
      
  //   }
  // }
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
