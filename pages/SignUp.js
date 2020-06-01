import React, { useReducer, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  AsyncStorage
} from "react-native";
import ActionBar from "../components/SignUpComponents/action-bar";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
  Foundation
} from "@expo/vector-icons";
import LoadingScreen from "../components/QuizComponents/LoadingScreen";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
const SignUp = props => {
  const [isLoading, setIsLoading] = useState(false);

  function reducerFunction(state, args) {
    return {
      ...state,
      ...args
    };
  }
  let formState = {
    username: null,
    password: null,
    email: null,
    fullName: null,
    image: null,
    referralCode: null
  };

  const [signUpState, dispatch] = useReducer(reducerFunction, formState);

  useEffect(() =>{

  }, [])

  const setSignUpDetails = data => {
    dispatch(data);
  };

  const openImagePicker = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      setSignUpDetails({
        image: result.uri
      });
    }
  };

  const signup = () => {
    const { username, password, email, fullName, image, referralCode } = signUpState;
    setIsLoading(true);
    let body = new FormData();
    const filetype = signUpState.image.split(".").pop();
    let file = {
      name: `photo.${filetype}`,
      type: `image/${filetype}`,
      uri: image
    };
    body.append("photo", file);
    body.append("username", username);
    body.append("password", password);
    body.append("email", email);
    body.append("fullName", fullName);
    body.append('referralCode', referralCode)
    fetch("http://192.168.43.31:3000/create", {
      method: "POST",
      body,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      }
    })
      .then(data =>
        data.json().then(async credentials => {
          console.log(credentials)
          await AsyncStorage.setItem("trivia-access-token", credentials.token);
          setIsLoading(false);
          props.navigation.navigate("Home");
        })
      )
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  };

  return isLoading ? (
    <LoadingScreen message="Creating account" />
  ) : (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
        <ActionBar />

        <ScrollView style={styles.scrollView}>
          <View style={styles.root}>
              <View style={styles.imageHolder}>
                  <Image
                    style={styles.image}
                    source={{ uri: signUpState.image }}
                  />
              </View>
                
            <TouchableWithoutFeedback onPress={() => openImagePicker()}>
              <View style={styles.chooseImageBtn}>
                <Text style={styles.chooseImageText}>Choose Image</Text>
              </View>
            </TouchableWithoutFeedback>

            <View style={styles.forms}>
              <View style={styles.textInputHolder}>
                <View style={styles.iconHolder}>
                  <MaterialIcons
                    name="person-outline"
                    color="black"
                    size={24}
                  />
                </View>
                <TextInput
                  onChangeText={value => setSignUpDetails({ fullName: value })}
                  style={styles.textInput}
                  selectionColor="black"
                  placeholder="Fullname"
                  autoCapitalize="sentences"
                />
              </View>

              <View style={styles.textInputHolder}>
                <View style={styles.iconHolder}>
                  <MaterialCommunityIcons
                    name="tag-outline"
                    color="black"
                    size={24}
                  />
                </View>
                <TextInput
                  onChangeText={value => setSignUpDetails({ username: value })}
                  style={styles.textInput}
                  selectionColor="black"
                  placeholder="Username"
                  multiline={false}
                />
              </View>

              <View style={styles.textInputHolder}>
                <View style={styles.iconHolder}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    color="black"
                    size={24}
                  />
                </View>
                <TextInput
                  onChangeText={value => setSignUpDetails({ email: value })}
                  style={styles.textInput}
                  selectionColor="black"
                  placeholder="Email"
                  textContentType="emailAddress"
                  multiline={false}
                />
              </View>

              <View style={styles.textInputHolder}>
                <View style={styles.iconHolder}>
                  <MaterialIcons name="lock-outline" color="black" size={24} />
                </View>
                <TextInput
                  onChangeText={value => setSignUpDetails({ password: value })}
                  style={styles.textInput}
                  selectionColor="black"
                  placeholder="Password"
                  secureTextEntry
                  textContentType="password"
                  multiline={false}
                />
              </View>

              <View style={styles.textInputHolder}>
                <View style={styles.iconHolder}>
                  <Foundation name="ticket" color="black" size={24} />
                </View>
                <TextInput
                  onChangeText={value =>
                    setSignUpDetails({ referralCode: value })
                  }
                  style={styles.textInput}
                  selectionColor="black"
                  maxLength={8}
                  placeholder="Referral Code (Optional)"
                  multiline={false}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <TouchableWithoutFeedback onPress={() => signup()}>
          <View style={styles.createAccountBtn}>
            <Text style={styles.createAccountText}>Register</Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 10
  },
  scrollView: {
    flex: 1
  },
  root: {
    justifyContent: "center",
    alignItems: "center"
  },
  imageHolder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E2E2E2",
    marginVertical: 10
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  welcomeText: {
    fontFamily: "normal-default",
    fontSize: 24,
    fontWeight: "bold"
  },
  highlights: {
    color: "rgba(0,0,0,0.5)",
    fontFamily: "normal-default"
  },
  forms: {
    width: "100%",
    marginVertical: 10
  },
  formItem: {
    marginVertical: 10
  },
  textInput: {
    borderColor: "rgba(0,0,0,0.4)",
    borderWidth: 0.5,
    flex: 1,
    padding: 10,
    fontFamily: "normal-default",
    fontSize: 14,
    color: "black",
    borderRadius: 5
  },
  iconHolder: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  textInputHolder: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10
  },
  createAccountBtn: {
    backgroundColor: "#0066f5",
    padding: 20,
    borderRadius: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },
  createAccountText: {
    color: "white",
    fontFamily: "normal-default",
    textAlign: "center"
  },
  chooseImageBtn:{
    borderRadius: 10,
    padding: 5,
    backgroundColor:'#0066f5'
  },
  chooseImageText:{
    color: 'white',
    fontFamily: 'normal-default'
  }
});

export default SignUp;
