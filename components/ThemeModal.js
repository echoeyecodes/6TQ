import React, { useState } from 'react'
import {View, StyleSheet, Dimensions, Text, TouchableWithoutFeedback} from 'react-native'
import {Portal, Modal} from 'react-native-paper'
import {lightTheme, darkTheme} from  '../redux/actions/changeTheme'
import { connect } from 'react-redux'

const ThemeItem =({theme, backgroundColor, iconColor, name, action, selectTheme}) =>{
    const isActive = theme === name
    return(
        <TouchableWithoutFeedback onPress={() =>action()}>
        <View style={[styles.themeItem, {backgroundColor}]} />
        </TouchableWithoutFeedback>
    )
}

const ThemeModal = ({visible, dismissThemeModal, ...props}) =>{
    const [theme] = useState('light')

    return(
        <Portal>
            <Modal dismissable onDismiss={dismissThemeModal} visible={visible}>
                <View style={[styles.container, styles.justify]}>
                    <Text style={styles.msg}>Choose your preferred theme</Text>
                    {['dark', 'light'].map((item, index) =>{
                        const color = index === 0 ? '#000000' : '#fff'
                        const iconColor = index === 0 ? '#fff' : '#000000'
                        const action = index === 0 ? props.darkTheme : props.lightTheme
                        return <ThemeItem key={index} theme={theme} action={action} name={item} iconColor={iconColor} backgroundColor={color} />
                    })}
                </View>
            </Modal>
        </Portal>
    )
}

const styles = StyleSheet.create({
    container:{
        height: Dimensions.get('screen').height/2,
        marginHorizontal: 10,
        borderRadius: 10,
        padding: 10,
        backgroundColor:'rebeccapurple',
    },
    msg:{
        fontFamily: 'poppins-semibold',
        color: '#fff'
    },
    justify:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    themeItem:{
        marginVertical: 10,
        width: 150,
        height: 70,
        borderRadius: 30
    },
    iconHolder:{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: 30
    }
})

const mapStateToProps = (state) => state.theme

export default connect(mapStateToProps, {lightTheme, darkTheme})(ThemeModal)