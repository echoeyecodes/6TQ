import React, { useState, useEffect } from "react";
import { StyleSheet, View, Animated, Text, Dimensions } from "react-native";

const ProgressBar = ({ progress }) => {
  const [animation] = useState(new Animated.Value(0))

  const animatedProgress = animation.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  })

  useEffect(() =>{
    Animated.timing(animation, {
      toValue: progress,
      duration: 500
    }).start()
  }, [progress])

  return (
      <View style={styles.container}>
        <View style={styles.progress}>
          <Animated.View
            style={[
              styles.indicator, {width: animatedProgress}
            ]}
          ></Animated.View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  progress: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
    height: Dimensions.get('screen').width/20,
    borderRadius: 10
  },
  indicator: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 10,
    backgroundColor: '#64f38c'
  }
});

export default ProgressBar;
