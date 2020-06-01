import React, { useContext } from 'react'
import {View, StyleSheet, Dimensions, ScrollView} from 'react-native'
import {Modal, Portal} from 'react-native-paper'
import EarnCoins from './EarnCoins'
import ThemeContext from '../Context/ThemeContext'

const EarnCoinModal = ({onDismiss, visible, onOptionSelected}) =>{
    const {theme} = useContext(ThemeContext)
        return(
            <Portal>
                <Modal visible={visible} onDismiss={onDismiss}>
                    <View style={[styles.container, {backgroundColor: theme.background}]}>
                        <ScrollView>
                        <EarnCoins onOptionSelected={onOptionSelected} theme={theme} />
                        </ScrollView>
                    </View>
                </Modal>
            </Portal>
        )
    }
    

const styles = StyleSheet.create({
        container:{
            height: Dimensions.get('screen').height/1.5,
            marginHorizontal: 10,
            borderRadius: 10,
            padding: 10,
        }
    })

export default EarnCoinModal