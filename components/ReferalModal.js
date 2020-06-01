import React, { useState } from 'react'
import { View, StyleSheet, Dimensions, Text, TextInput, TouchableNativeFeedback } from 'react-native'
import { Portal, Modal } from 'react-native-paper'

const ActionBtn = ({continueRegProcess, code}) => {
    return (
        <View style={styles.actionBtnContainer}>
            <TouchableNativeFeedback onPress={() => continueRegProcess(code)}>
                <View style={styles.actionBtn}>
                    <Text style={styles.actionBtnText}>CONTINUE</Text>
                </View>
            </TouchableNativeFeedback>

            <TouchableNativeFeedback onPress={() => continueRegProcess(code)}>
                <View style={[styles.actionBtn, {backgroundColor: '#fff'}]}>
                    <Text style={[styles.actionBtnText, {color: '#000000'}]}>SKIP</Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    )
}
const ReferalModal = ({ visible,continueRegProcess }) => {
    const [code, setCode] = useState(null)
    return (
        <Portal>
            <Modal visible={visible}>
                <View style={styles.container}>
                    <Text style={styles.msg}>Do you have a referal code?</Text>
                    <TextInput onChangeText={(value) => setCode(value)} placeholder='Referal Code' style={styles.textInput} />

                    <ActionBtn code={code} continueRegProcess={() => continueRegProcess(code)} />
                </View>
            </Modal>
        </Portal>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('screen').height / 1.5,
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    msg: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        padding: 5,
        borderRadius: 3,
        width: '70%',
        marginVertical: 10
    },
    actionBtnContainer:{
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
    },
    actionBtn: {
        padding: 15,
        backgroundColor: '#5d11f7',
        borderRadius: 5,
        marginVertical: 5
    },
    actionBtnText: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Luxia-Display'
    }
})

export default ReferalModal