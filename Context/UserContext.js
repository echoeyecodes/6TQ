import React from 'react'

const UserContext = React.createContext({isLoggedIn: false, authenticate: () =>{}})

export default UserContext