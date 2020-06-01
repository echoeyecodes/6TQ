import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';

const SplashScreen = () => {

  useEffect(() => {
    
  }, []);

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('./assets/logo.png')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image:{
    width: 300,
    height: 300
  }
});

export default SplashScreen
