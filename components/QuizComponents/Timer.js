import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Timer = ({currentTime}) => {
  return (
      <Text style={styles.timerLeft}>{currentTime}</Text>
  );
}

const styles = StyleSheet.create({
  timerLeft:{
      fontWeight: 'bold',
      fontSize: 18,
      color: '#ED3544'
  }
});


export default Timer