import React, {useContext} from 'react';
import {StyleSheet, View, Image, Text, TouchableNativeFeedback} from 'react-native';
import ThemeContext from '../Context/ThemeContext';

const ErrorComponent = ({tryAgain}) => {
  const {theme} = useContext(ThemeContext)
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('../assets/bot.png')} />
        <Text style={[styles.message, {color: theme.foreground}]}>Couldn't reach server. Please try again</Text>

        <TouchableNativeFeedback onPress={() => tryAgain()}>
          <View style={styles.tryAgainBtn}>
            <Text style={styles.tryAgainBtnText}>Try again</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      image:{
        width: 100,
        height: 100
      },
      message:{
        fontFamily: 'Poppins-SemiBold',
        marginVertical: 10,
        fontSize: 18,
        marginHorizontal: 20,
        textAlign: 'center'
      },
      tryAgainBtn:{
        width: 150,
        padding: 10,
        backgroundColor: '#5d11f7',
        borderRadius: 10,
        marginVertical: 10
      },
      tryAgainBtnText:{
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16
      }
})

export default ErrorComponent