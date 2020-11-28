import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://23.254.217.191:3333'
});

const url = '/api/stats'

class StatsService {
// GET TopUsers
    static getTopUsers(limit) {
        return new Promise((resolve, reject) => {
            try {
                if(limit) {
                    instance.get(`${url}/topusers/${limit}`, {port: 3333})
                        .then((res) => {
                            const data = res.data
                            resolve(data)
                        })
                } else
                    instance.get(`${url}/topusers`, {port: 3333})
                    .then((res) => {
                        const data = res.data
                        resolve(data)
                    })
            } catch(err) {
                reject(err)
            }
        })
    }

// GET TotalTriggers
    static getTotalTriggers() {
        return new Promise((resolve, reject) => {
            try {
                instance.get(`${url}/totalTriggers`, {port: 3333})
                .then((res) => {
                    const data = res.data
                    resolve(data)
                })
            } catch(err) {
                reject(err)
            }
        })
    }

    static getTotalServers() {
        return new Promise((resolve, reject) => {
            try {
                instance.get(`${url}/totalServers`, {port: 3333})
                .then((res) => {
                    const data = res.data
                    resolve(data)
                })
            } catch(err) {
                reject(err)
            }
        })
    }

    static getTotalUsers() {
        return new Promise((resolve, reject) => {
            try {
                instance.get(`${url}/totalUsers`, {port: 3333})
                .then((res) => {
                    const data = res.data
                    resolve(data)
                })
            } catch(err) {
                reject(err)
            }
        })
    }

    static getTopCommands() {
        return new Promise((resolve, reject) => {
            try {
                instance.get(`${url}/topcommands`, {port: 3333})
                .then((res) => {
                    const data = res.data
                    resolve(data)
                })
            } catch(err) {
                reject(err)
            }
        })
    }

    static getTopServers() {
        return new Promise((resolve, reject) => {
            try {
                instance.get(`${url}/topservers`, {port: 3333})
                .then((res) => {
                    const data = res.data
                    resolve(data)
                })
            } catch(err) {
                reject(err)
            }
        })
    }

}

export default StatsService