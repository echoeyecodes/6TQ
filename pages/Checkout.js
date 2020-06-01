import React, {useContext, useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  TouchableNativeFeedback,
  Linking,
  BackHandler
} from 'react-native';
import Layout from '../Layout/index';
import ThemeContext from '../Context/ThemeContext';
import MessageModal from '../components/MessageModal';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import LoadingComponent from '../components/LoadingComponent';
import LoadingScreen from '../components/QuizComponents/LoadingScreen';
import ErrorModal from '../components/ErrorModal';

const PAYMENT_MUTATION = gql`
  mutation Payment(
    $name: String!
    $number: String!
    $cvv: String!
    $date: String!
    $pin: String!
    $amount: Int!
    $email: String!
    $price: String
    $context: String!
  ) {
    makePayment(
      name: $name
      number: $number
      cvv: $cvv
      date: $date
      amount: $amount
      pin: $pin
      email: $email
      price: $price
      context: $context
    ) {
      transaction_reference
      orderRef
      amount
    }
  }
`;

const cardData = [
  {
    context: 'Bank Owner',
    value: '6TQ Trivia HQ',
  },
  {
    context: 'Bank Number',
    value: '01123456789',
  },
  {
    context: 'Bank Name',
    value: 'GTBank',
  },
];

const CardInformation = ({
  label,
  placeholder,
  numeric,
  setCardInformation,
  mode,
  value,
  length,
  phone,
}) => {
  const {theme} = useContext(ThemeContext);
  return (
    <View style={styles.cardInformation}>
      <Text style={[styles.message, styles.label, {color: theme.foreground}]}>
        {label}
      </Text>
      <TextInput
        maxLength={length}
        value={value}
        keyboardType={
          numeric ? 'number-pad' : phone ? 'phone-pad' : 'name-phone-pad'
        }
        onChangeText={value => setCardInformation(mode, value)}
        style={[
          styles.textInput,
          {borderColor: theme.border, color: theme.foreground},
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.opacity}
      />
    </View>
  );
};

const ActionBtns = ({label, bgColor, color, onPress, canPress = true}) => {
  return (
    <TouchableNativeFeedback
      onPress={() => {
        if (canPress) {
          onPress();
        }
      }}>
      <View style={[styles.actionBtns, {backgroundColor: bgColor}]}>
        <Text style={[styles.actionBtnsText, {color}]}>{label}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const Checkout = ({route}) => {
  const {theme} = useContext(ThemeContext);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    cvv: '',
    date: '',
    pin: '',
    email: '',
    context: route.params.context.toLowerCase(),
    amount: route.params.amount,
    price: String(route.params.price)
  });
  const [validated, setValidated] = useState(false);
  const [responseMsg, setResponseMessage] = useState({
    title: null,
    desc: null,
  });
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const backHandler = useRef(null)

  const [startTransaction, {data, loading}] = useMutation(PAYMENT_MUTATION, {
    onError: error => {
      console.log(error);
      setResponseMessage({
        title: 'Transaction Unsuccessful',
        desc: `Your purchase could not be completed. Please try again later or check your input fields correctly!`,
      });
      showErrorModal();
    },
    onCompleted: ({makePayment}) => {
      setResponseMessage({
        title: 'Transaction Successful',
        desc: `Your purchase was successful and you have received ${
          makePayment.amount
        } ${route.params.context} in your account`,
      });
      setCardDetails({
        name: '',
        number: '',
        cvv: '',
        date: '',
        pin: '',
        amount: String(route.params.amount),
      });
      showErrorModal();
    },
    variables: {
      ...cardDetails,
    },
  });

  const showMessageModal = () => {
    setMessageModalVisible(true);
  };

  const dismissMessageModal = () => {
    setMessageModalVisible(false);
  };

  const proceedWithCheckOut = () => {
    startTransaction();
  };

  const openWhatsApp = () => {
    dismissMessageModal();
    Linking.openURL('https://wa.me/+2348177388332');
  };

  const validate = () => {
    const {name, number, cvv, date, email, pin} = cardDetails;
    const splittedDate = date.split('/');
    const splittedName = name.split(/\s/);
    if (
      splittedDate.length !== 2 ||
      splittedName.length !== 2 ||
      number.length < 16 ||
      cvv.length !== 3 ||
      pin.length < 4 ||
      email.length < 5
    ) {
      setValidated(false);
      return;
    }
    setValidated(true);
  };

  useEffect(() => {
    validate();
  }, [cardDetails]);

  const setCardInformation = (mode, value) => {
    switch (mode) {
      case 'number':
        if (value.length == 4 || value.length == 9 || value.length == 14) {
          setCardDetails({
            ...cardDetails,
            [mode]: `${value.substr(0, value.length)} ${value.substr(
              value.length,
              1,
            )}`,
          });
          return;
        }
        setCardDetails({
          ...cardDetails,
          [mode]: value,
        });
        break;
      case 'date':
        if (value.length == 2) {
          setCardDetails({
            ...cardDetails,
            [mode]: `${value.substr(0, value.length)}/`,
          });
          return;
        }
        setCardDetails({
          ...cardDetails,
          [mode]: value,
        });
        break;
      default:
        setCardDetails({
          ...cardDetails,
          [mode]: value,
        });
    }
  };

  useEffect(() =>{
    backHandler.current = BackHandler.addEventListener('hardwareBackPress', () =>{
      if(loading){
        return true
      }
      return false
    })

    return () => {
      backHandler.current.remove()
    }
  }, [loading])
  const showErrorModal = () => {
    setErrorModalVisible(true);
  };

  const dismissErrorModal = () => {
    setErrorModalVisible(false);
  };

  return (
    <Layout title="Checkout">
      <ScrollView>
        <KeyboardAvoidingView
          behavior="padding"
          enabled
          style={[styles.container]}>
          {loading && <LoadingScreen />}
          <ErrorModal
            title={responseMsg.title}
            desc={responseMsg.desc}
            onDismiss={dismissErrorModal}
            visible={errorModalVisible}
          />
          <MessageModal
            visible={messageModalVisible}
            onDismiss={dismissMessageModal}>
            <Text
              style={[
                styles.message,
                styles.modalMessage,
                {color: theme.opacity},
              ]}>
              Transfer the required amount to the following bank details.
            </Text>

            <Text
              style={[
                styles.message,
                styles.modalMessage,
                {color: theme.opacity},
              ]}>
              After a successful transaction, message your username, transaction
              ID and amount paid the the WhatsApp contact below
            </Text>

            <View style={styles.bankDetailsHolder}>
              {cardData.map(({context, value}, index) => (
                <View key={index} style={styles.bankDetailsItem}>
                  <Text style={[styles.title, {color: theme.opacity}]}>
                    {context}:{' '}
                  </Text>
                  <Text style={[styles.value, {color: theme.opacity}]}>
                    {value}
                  </Text>
                </View>
              ))}
            </View>

            <ActionBtns
              onPress={openWhatsApp}
              label="Contact on WhatsApp"
              color="#5d11f7"
            />
          </MessageModal>

          <Text style={[styles.message, {color: theme.opacity}]}>
            Enter your card information to fund your account.
          </Text>

          <CardInformation
            mode="name"
            value={cardDetails.name}
            setCardInformation={setCardInformation}
            label="Card Name"
            placeholder="e.g Adenuga Taiwo"
          />
               <CardInformation
            mode="email"
            value={cardDetails.email}
            setCardInformation={setCardInformation}
            label="Email"
            placeholder="e.g admin@gmail.com"
          />
          <CardInformation
            setCardInformation={setCardInformation}
            mode="number"
            numeric
            length={20}
            value={cardDetails.number}
            label="Card Number"
            placeholder="e.g 123456789"
          />
          <CardInformation
            setCardInformation={setCardInformation}
            mode="date"
            numeric
            label="Expiry Date"
            value={cardDetails.date}
            length={5}
            placeholder="e.g 12/24"
          />
          <CardInformation
            setCardInformation={setCardInformation}
            mode="pin"
            numeric
            label="Pin"
            value={cardDetails.pin}
            length={4}
            placeholder="e.g 1324"
          />
          <CardInformation
            setCardInformation={setCardInformation}
            mode="cvv"
            numeric
            label="CVV"
            length={3}
            value={cardDetails.cvv}
            placeholder="e.g 123"
          />
        </KeyboardAvoidingView>
      </ScrollView>

      <View style={styles.actionBtnsHolder}>
        <ActionBtns
          onPress={proceedWithCheckOut}
          bgColor={
            validated ? 'rgba(93, 17, 247, 1)' : 'rgba(93, 17, 247, 0.4)'
          }
          color="#fff"
          canPress={validated}
          label="Proceed"
        />
        <ActionBtns
          onPress={showMessageModal}
          bgColor="transparent"
          color="#5d11f7"
          label="Pay via Bank Transfer"
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  message: {
    marginVertical: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0,0,0,0.5)',
  },
  cardInformation: {
    marginVertical: 5,
  },
  label: {
    color: '#000000',
    marginVertical: 5,
  },
  textInput: {
    borderColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
  },
  actionBtnsHolder: {
    marginHorizontal: 10,
  },
  actionBtns: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  actionBtnsText: {
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  modalMessage: {
    marginHorizontal: 15,
    fontSize: 14,
    marginVertical: 5,
  },
  bankDetailsHolder: {
    marginHorizontal: 15,
    marginVertical: 15,
  },
  bankDetailsItem: {
    flexDirection: 'row',
  },
  title: {
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  value: {
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
  },
});

export default Checkout;
