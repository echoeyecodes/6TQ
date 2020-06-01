import firestore from '@react-native-firebase/firestore'
import Axios from 'axios'
class User {
    constructor() {
    }
    async getUser(id) {
        const root = firestore().collection('users').doc(id)
        const userData = await root.collection('bio').doc('user_data').get()
        const userStats = await root.collection('stats').doc('user_stats').get()

        if (userData.data() && userStats.data()) {
            return {
                userData: userData.data(),
                userStats: userStats.data(),
                notifications: []
            }
        } else {
            return undefined
        }
    }

    checkUserExists(id) {
        return new Promise((resolve, reject) => {
            firestore().collection('users').doc(id).get().then(data => {
                if (data.exists) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }).catch(error => reject())
        })
    }

    async createUser(id, userData, userStats) {
        const root = firestore().collection('users').doc(id)
        await firestore().collection('leaderboard').doc('data').collection('all_users').doc(id).set({ id })
        await root.set({ timestamp: new Date().toString() })
        await root.collection('bio').doc('user_data').set(userData)
        await root.collection('stats').doc('user_stats').set(userStats)
        const responseData = await this.getUser(id)
        Axios.get('https://us-central1-tq-trivia-8a076.cloudfunctions.net/updateUser')
        Axios.get(`https://us-central1-tq-trivia-8a076.cloudfunctions.net/newUser?id=${id}`)
        return responseData
    }

    async updateUserByStats(id, userData) {
        await firestore().collection('users').doc(id).collection('stats').doc('user_stats').update(userData)
    }

    async getLeaderboard() {
        const allUsers = await firestore().collection('leaderboard').doc('data').collection('all_users').get()
        let usersArray = []
        for (let user of allUsers.docs) {
            const reference = await firestore().collection('users').doc(user.id).get()
            const uBio = (await reference.ref.collection('bio').doc('user_data').get()).data()
            const uStats = (await reference.ref.collection('stats').doc('user_stats').get()).data()
            usersArray = [...usersArray, { uBio, uStats, id: user.id }]
        }
        return usersArray
    }
}
export default User