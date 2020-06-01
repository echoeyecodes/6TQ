import React from 'react'

const themes = {
    light:{
        name: 'light',
        foreground: '#000000',
        background: '#fff',
        opacity: 'rgba(0,0,0,0.5)',
        secondary: '#e3e3e3',
        border: 'rgba(0,0,0,0.2)',
        backgroundLight: '#fff'
    },
    dark:{
        name: 'dark',
        foreground: '#fff',
        background: '#101d24',
        opacity: 'rgba(255,255,255,0.7)',
        secondary: 'rgba(0,0,0,0.7)',
        border: 'rgba(255,255,255,0.7)',
        backgroundLight: '#2d2d2d'
    }
}

export {themes}
export default React.createContext({theme: themes.light, toggleTheme: () =>{}})