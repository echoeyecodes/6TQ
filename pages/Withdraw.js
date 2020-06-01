import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableNativeFeedback,
  TextInput,
  ScrollView,
} from 'react-native';
import {Portal, Modal} from 'react-native-paper';
import gql from 'graphql-tag';
import ThemeContext from '../Context/ThemeContext';
import {useMutation} from '@apollo/react-hooks'
import Layout from '../Layout';
import LoadingScreen from '../components/QuizComponents/LoadingScreen';
import { connect } from 'react-redux';
import {showSnackBar} from '../redux/actions/snackbar-actions'

const WITHDRAW_MUTATION = gql`
  mutation Withdraw($name: String, $number: String, $bankName: String) {
    withdraw(name: $name, number: $number, bankName: $bankName) {
      bio {
        id
      }
    }
  }
`;

const ActionBtn = ({sendInfo, bgColor}) => {
  return (
    <TouchableNativeFeedback onPress={sendInfo}>
      <View style={[styles.actionBtn, {backgroundColor: bgColor}]}>
        <Text style={styles.actionBtnText}>Submit</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const FieldItem = ({placeholder, name, mode, setInfo, value}) => {
  const {theme} = useContext(ThemeContext);
  return (
    <View style={styles.fieldItem}>
      <Text
        style={[
          styles.title,
          {
            color: theme.foreground,
          },
        ]}>
        {name}
      </Text>
      <TextInput
        keyboardType={mode == 'number' ? 'number-pad' : 'default'}
        onChangeText={value => setInfo(mode, value)}
        placeholder={placeholder}
        value={value}
        placeholderTextColor={theme.opacity}
        style={[
          styles.textInput,
          {
            borderColor: theme.border,
            color: theme.foreground
          },
        ]}
      />
    </View>
  );
};
const Withdraw = (props) => {
  const {theme} = useContext(ThemeContext);
  const [bankDetails, setBankDetails] = useState({
    name: '',
    number: '',
    bankName: '',
  });
  const [isValidated, setIsValidated] = useState(false);
  

  const [startQuery, {data, loading}] = useMutation(WITHDRAW_MUTATION, {
    variables: bankDetails,
    onCompleted: () => {
      props.showSnackBar(
        `Your bank details has been sent to the admin. You'll be settled shortly`,
      );
      setBankDetails({name: '', number: '', bankName: ''})
    },
    onError: (error) => {
      props.showSnackBar(
        `Couldn't send your details. Please again or contact us via Whatsapp`,
      );
    },
  });

  const sendInfo = () => {
    if (isValidated) {
      startQuery()
    }
  };

  const validate = () => {
    const {name, number, bankName} = bankDetails;
    if (name.length < 5 || number.length < 9 || bankName.length < 5) {
      setIsValidated(false);
      return;
    }

    setIsValidated(true);
  };

  const setInfo = (mode, value) => {
    setBankDetails({
      ...bankDetails,
      [mode]: value,
    });
  };

  useEffect(() => {
    validate();
  }, [bankDetails]);
  return (
    <Layout title="Withdraw">
        <View
          style={[styles.container, {backgroundColor: theme.background}]}>
            {loading && <LoadingScreen />}
          <ScrollView style={{flex: 1}}>
            <Text
              style={[
                styles.message,
                {
                  color: theme.foreground,
                },
              ]}>
              Enter your account details to receive your funds
            </Text>
            <FieldItem
              name="Account No."
              mode="number"
              value={bankDetails.number}
              theme={theme}
              setInfo={setInfo}
              placeholder="e.g 3030145214"
            />

            <FieldItem
              name="Account Name."
              setInfo={setInfo}
              mode="name"
              value={bankDetails.name}
              placeholder="e.g Ayodeji Onyeka"
            />

            <FieldItem
              mode="bankName"
              setInfo={setInfo}
              name="Bank Name"
              value={bankDetails.bankName}
              placeholder="e.g GTBank"
            />
          </ScrollView>
          <ActionBtn
            bgColor={
              isValidated ? 'rgba(93, 17, 247, 1)' : 'rgba(93, 17, 247, 0.4)'
            }
            sendInfo={sendInfo}
          />
        </View>
        </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  actionBtn: {
    borderRadius: 30,
    padding: 10,
    backgroundColor: '#5d11f7',
    margin: 10,
  },
  message: {
    marginHorizontal: 10,
    marginVertical: 10,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  actionBtnText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  fieldItem: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  title: {
    fontFamily: 'Poppins-Regular',
    marginVertical: 10,
  },
  textInput: {
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
});
const mapStateToProps = (state) => state.snackbar
export default connect(mapStateToProps, {showSnackBar})(Withdraw);
