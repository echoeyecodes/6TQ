import React, {useContext} from 'react';
import {Portal, Modal} from 'react-native-paper';
import {View, StyleSheet, Dimensions, Image, Text, TouchableWithoutFeedback,} from 'react-native';
import ThemeContext from '../Context/ThemeContext';

const ErrorModal = ({visible, onDismiss, title, desc}) => {
  const {theme} = useContext(ThemeContext);
  return (
    <Portal>
      <Modal onDismiss={onDismiss} visible={visible}>
        <View
          style={[styles.container, {backgroundColor: theme.background}]}>
          <View style={styles.root}>
            <Image style={styles.image} source={require('../assets/bot.png')} />
            <Text style={[styles.title, {color: theme.foreground}]}>{title}l</Text>
            <Text style={[styles.desc, {color: theme.foreground}]}>
              {desc}
            </Text>
          </View>

          <TouchableWithoutFeedback onPress={onDismiss}>
              <View style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>Okay</Text>
              </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get('screen').height / 1.5,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 5,
  },
  title:{
      fontFamily: "Poppins-SemiBold",
      textAlign: 'center',
      marginVertical: 5,
      fontSize: 18
  },
  desc:{
      fontFamily: "Poppins-Regular",
      textAlign: 'center',
      marginHorizontal: 15,
      marginVertical: 5
  },
  actionBtn:{
      position: 'absolute',
      bottom: 10,
      right: 10,
      padding: 10
  },
  actionBtnText:{
      color: '#5d11f7',
      fontFamily: "Poppins-SemiBold"
  }
});

export default ErrorModal;
