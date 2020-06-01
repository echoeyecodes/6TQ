import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
const ActionBar = ({currentIndex, totalIndex}) => {
  const value = 1 + currentIndex
  return (
      <View style={styles.container}>
      <View>
          <Text style={styles.title}>LIVE EVENT</Text>
          <Text style={styles.questionIndex}>Question {value}/{totalIndex}</Text>
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  title:{
      fontSize: 24,
      fontFamily: 'Poppins-Regular',
      textAlign: 'center',
      color: '#ffffff'
  },
  questionIndex:{
    textAlign: 'center',
    color: 'rgba(255,255,255,0.8)'
  }
});


export default ActionBar