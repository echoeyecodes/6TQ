import React, { useState, useEffect } from "react";
import { StyleSheet, Animated, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Portal, Modal } from "react-native-paper";
const UseLifeModal = ({ visible }) => {
  const [mock] = useState(new Animated.Value(0));
  const [position] = useState(new Animated.Value(0));

  const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

  let angle = mock.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
    extrapolate: "clamp"
  });

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(mock, {
            toValue: 360,
            duration: 600
          }),
          Animated.timing(position, {
            toValue: -900,
            duration: 600
          })
        ]),
        { iterations: 1 }
      ).start(() => {
        mock.setValue(0)
        position.setValue(0)
      })
    }
  }, [visible]);
  return (
    <Portal>
      <Modal dismissable visible={visible}>
        <View style={styles.container}>
          <Animated.View style={{ transform: [{ translateY: position }] }}>
            <AnimatedIcon
              style={{ transform: [{ rotateY: angle }] }}
              name="md-heart"
              color="red"
              size={150}
            />
          </Animated.View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default UseLifeModal;
