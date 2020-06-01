import React, { Component } from "react";
import { StyleSheet, Animated, View, Text, Dimensions } from "react-native";
import { Portal } from "react-native-paper";

class LoadingScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      height: new Animated.Value(1)
    }

    this.animation = Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.height, {
          toValue: 1.5,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(this.state.height, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        })
      ]),
      {
        iterations: -1
      }
    )
  }

  startAnimation = () => {
    this.animation.start()
  }

  stopAnimation = () => {
    this.animation.stop()
  }
  componentDidMount() {
    this.animation.start()
  }

  componentWillUnmount() {
    this.animation.stop()
    this.state.height.removeAllListeners()
  }

  render() {
    const { message } = this.props
    let height1 = this.state.height.interpolate({
      inputRange: [1, 1.5],
      outputRange: [1.5, 1],
      extrapolate: "clamp"
    });

    let height2 = this.state.height.interpolate({
      inputRange: [1, 1.5],
      outputRange: [0.5, 1],
      extrapolate: "clamp"
    });

    let height3 = this.state.height.interpolate({
      inputRange: [1, 1.5],
      outputRange: [1.2, 0.6],
      extrapolate: "clamp"
    });

    let height4 = this.state.height.interpolate({
      inputRange: [1, 1.5],
      outputRange: [0.7, 1.3],
      extrapolate: "clamp"
    });

    return (
      <Portal>
        <View style={styles.container}>

          <View style={styles.root}>
            <View style={styles.holder}>
              <Animated.View
                style={{ ...styles.progress, transform: [{scaleY: this.state.height}] }}
              ></Animated.View>

              <Animated.View
                style={{ ...styles.progress, transform: [{scaleY: height1}]}}
              ></Animated.View>

              <Animated.View
                style={{ ...styles.progress, transform: [{scaleY: height2}]}}
              ></Animated.View>

              <Animated.View
                style={{ ...styles.progress, transform: [{scaleY: height3}]}}
              ></Animated.View>

              <Animated.View
                style={{ ...styles.progress, transform: [{scaleY: height4}]}}
              ></Animated.View>
            </View>
            <Text style={styles.message}>{message}</Text>
          </View>
        </View>
      </Portal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    flex: 1
  },
  root:{
    backgroundColor: '#fff',
    height: Dimensions.get('screen').height / 3,
    marginHorizontal: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems:'center'
  },
  holder: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 120
  },
  progress: {
    padding: 5,
    backgroundColor: "black",
    borderRadius: 10,
    marginHorizontal: 5,
    height: 70
  },
  message: {
    fontFamily: "Poppins-Regular"
  }
});

export default LoadingScreen;
