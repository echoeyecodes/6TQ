import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Image,
  Dimensions
} from "react-native";
import { Portal, Modal } from "react-native-paper";

const Loss = () => {
  return (
    <View style={styles.icons}>
      <Image style={styles.reactions} source={require('../../assets/sad.png')} />
      <Image style={styles.reactions} source={require('../../assets/sad.png')} />
      <Image style={styles.reactions} source={require('../../assets/sad.png')} />
    </View>
  )
}
const CheckPointReached = ({ visible, useExtraLife, score, lifeUsed, lifeTimeoutValue, lifeLeft, continueGame, correctAnswer ='' }) => {
  return (
    <Portal>
      <Modal visible={visible}>
        <View style={styles.container}>
          <View style={styles.messageHolder}>
            <Text style={styles.title}>Oops!</Text>
            <Text style={styles.description}>
              Correct answer was <Text style={styles.value}>{correctAnswer}</Text>{" "}. Game will continue in {lifeTimeoutValue} seconds
            </Text>
          </View>

          <Loss />



          <View style={styles.btnHolder}>
            <TouchableNativeFeedback onPress={() => lifeUsed || lifeLeft <=0 ? alert("You have exhausted your chances") : useExtraLife()}>
              <View style={[styles.btn, { backgroundColor: "#5D11F7" }]}>
                <Text style={[styles.btnText, { color: "white" }]}>
                  Use life ({lifeUsed ? 0 : 1} left)
                </Text>
              </View>
            </TouchableNativeFeedback>

            <TouchableNativeFeedback onPress={continueGame}>
              <View style={[styles.btn, { backgroundColor: "#ffffff" }]}>
                <Text style={[styles.btnText, { color: "#5D11F7" }]}>
                  Continue Game
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    minHeight: Dimensions.get('window').height/3
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  messageHolder: {
    marginVertical: 10
  },
  imageHolder: {
    width: 100,
    height: 100
  },
  image: {
    width: null,
    height: null,
    flex: 1,
    borderRadius: 50
  },
  title: {
    fontFamily: "Congrat",
    fontSize: 28,
    textAlign: "center"
  },
  description: {
    color: "rgba(0,0,0,0.5)",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "normal-default"
  },
  value: {
    color: "#5D11F7",
    fontWeight: "bold"
  },
  btnHolder: {
    width: "100%",
    marginVertical: 20
  },
  btn: {
    padding: 20,
    borderRadius: 10,
    marginVertical: 5
  },
  btnText: {
    textAlign: "center",
    fontWeight: "bold"
  },
  reactions: {
    width: 30,
    height: 30,
    marginHorizontal: 5
  }
});

export default CheckPointReached;
