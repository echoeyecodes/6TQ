import React from 'react';
import {StyleSheet, View, ProgressBarAndroid} from 'react-native';

const LoadingComponent = () => {
    return (
      <View style={styles.container}>
        <ProgressBarAndroid color="#5d11f7" />
      </View>
    );
  };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
})

export default LoadingComponent