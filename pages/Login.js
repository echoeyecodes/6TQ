import React, {useContext, useState, useEffect, useRef} from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
} from 'react-native';
import LoadingScreen from '../components/QuizComponents/LoadingScreen';
import {GoogleSignin} from '@react-native-community/google-signin';
import {firebase} from '@react-native-firebase/auth';
import {
  userAuthenticated,
  userNotAuthenticated,
} from '../redux/actions/authenticateUser';
import ReferalModal from '../components/ReferalModal';
import Axios from 'axios';
import {connect} from 'react-redux';
const Login = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [showReferalModal, setShowReferalModal] = useState(false);
  const id = useRef(null);
  const firebaseUserData = useRef(null);

  useEffect(() => {}, []);

  const promptReferalCode = () => {
    setIsLoading(false);
    setShowReferalModal(true);
  };

  const continueRegProcess = value => {
    id.current = value;
    setShowReferalModal(false);
    createNewAccount();
  };

  const createNewAccount = async () => {
    setIsLoading(true);
    const {user} = firebaseUserData.current;
    const username = `User-${Math.random()
      .toString()
      .slice(2, 7)}`;
    const bio = {
      id: user.uid,
      fullName: user.displayName,
      username,
      email: user.email,
      imageUrl: user.photoURL,
      createdAt: new Date().toString(),
    };

    try {
      const {data} = await Axios.post('http://192.168.43.31:3001/account', {
        bio,
        referalId: id.current,
      });
      await AsyncStorage.setItem('user-token', data.token);
      props.userAuthenticated(true);
    } catch (error) {
      alert("Couldn't log in. Please try again!");
    }
    setIsLoading(false);
    //await Axios request
  };

  const signIn = async () => {
    /*     await GoogleSignin.signOut()
        await firebase.auth().signOut() */

    try {
      const {accessToken, idToken} = await GoogleSignin.signIn().catch(() =>
        alert('Could not sign in with Google. Please try again!'),
      );
      const credential = firebase.auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      setIsLoading(true);
      const fireUser = await firebase
        .auth()
        .signInWithCredential(credential)
        .catch(error => alert('An error occured!'));

      if (fireUser) {
        const {data} = await Axios.get(
          `http://192.168.43.31:3001/exists/${fireUser.user.uid}`,
        ).catch(error => console.log(error));
        if (data.token) {
          setIsLoading(false);
          await AsyncStorage.setItem('user-token', data.token);
          props.userAuthenticated(true);
          return;
        }
        firebaseUserData.current = fireUser;
        promptReferalCode();
      } else {
        alert('Could not log in. Please try again');
      }
    } catch (error) {
      alert("Couldn't log in. Please try again");
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {isLoading && <LoadingScreen message="Signing in" />}
      <ReferalModal
        visible={showReferalModal}
        continueRegProcess={continueRegProcess}
      />
      <Image style={styles.logo} source={require('../assets/logo.png')} />
      <TouchableNativeFeedback onPress={signIn}>
        <View style={styles.signInBtn}>
          <Text style={styles.signInBtnText}>Login with Google</Text>
        </View>
      </TouchableNativeFeedback>
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
  signInBtn: {
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5d11f7',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  logo: {
    width: 300,
    height: 300,
    borderWidth: 1,
  },
  signInBtnText: {
    color: '#fff',
    fontFamily: 'poppins-semibold',
    fontSize: 18,
    textTransform: 'uppercase',
  },
});

const mapStateToProps = state => state.authenticated;

export default connect(
  mapStateToProps,
  {userAuthenticated},
)(Login);
