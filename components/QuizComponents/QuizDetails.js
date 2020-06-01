import React from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Timer from "./Timer";
import CircularProgressBar from "../Circular ProgressBar";

const QuizDetails = ({ currentTime, shouldStart, useLife, correctAnswer, lifeUsed, lifeLeft }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="md-flag" color="rgba(0,0,0,0.5)" size={28} />
      <View style={styles.timer}>
        <CircularProgressBar shouldStart={shouldStart} duration={5800} color="red">
          <Timer currentTime={currentTime} />
        </CircularProgressBar>
      </View>

      <TouchableNativeFeedback onPress={() => {
        if(lifeUsed || lifeLeft <= 0){
          alert("You have exhausted your chances!")
          return
        }
        useLife(correctAnswer, true)
      }}>
      <Ionicons style={styles.life} name="md-heart" color={lifeUsed || lifeLeft<=0 ? 'rgba(0,0,0,0.5)' : "#ED3544"} size={28} />
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
    flexDirection: "row",
    position: "absolute",
    height: 60,
    bottom: 0,
    left: 0,
    right: 0
  },
  timer: {
    marginLeft: "auto",
    width: 60,
    height: 60,
  },
  life: {
    marginLeft: "auto"
  }
});

export default QuizDetails;