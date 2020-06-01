import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Text,
  RefreshControl,
  TouchableNativeFeedback,
} from 'react-native';
import ThemeContext from '../Context/ThemeContext';
import {Appbar} from 'react-native-paper';
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {showSnackBar} from '../redux/actions/snackbar-actions';
import {connect} from 'react-redux';
import ErrorComponent from '../components/ErrorComponent';

const COIN_QUERY = gql`
  query {
    coins {
      amount
      price
    }
  }
`;

const LIFE_QUERY = gql`
  query {
    lives {
      amount
      price
    }
  }
`;

const TopBar = ({title}) => {
  const {theme} = useContext(ThemeContext);
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
      <Appbar.Header
        style={[styles.appbar, {backgroundColor: theme.background}]}>
        <Appbar.Content style={{marginLeft: 0}} title={title} />
      </Appbar.Header>
    </>
  );
};

const CoinItem = ({amount, price, route, navigateToCheckOut}) => {
  const {theme} = useContext(ThemeContext);
  const context = route ? 'Coins 💰' : 'Lives ❤️';
  return (
    <View style={styles.coinItem}>
      <View>
        <Text style={[styles.amount, {color: theme.foreground}]}>
          {amount} {context}
        </Text>
        <Text style={[styles.price, {color: theme.opacity}]}>
          &#8358; {price}
        </Text>
      </View>

      <TouchableNativeFeedback onPress={() => navigateToCheckOut(price, amount)}>
        <View style={styles.buyBtn}>
          <Text style={styles.buyBtnText}>Buy</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};
const BuyCoins = ({route, navigation, ...props}) => {
  const {theme} = useContext(ThemeContext);
  const pageContext = route.params.route == 'Coins';
  const [queryData, setQueryData] = useState([]);
  const {loading, error, refetch} = useQuery(
    pageContext ? COIN_QUERY : LIFE_QUERY,
    {
      onCompleted: data => {
        setQueryData(pageContext ? data.coins : data.lives);
      },
      onError: () => {
        props.showSnackBar("Couldn't fetch data from server!");
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  const onRefresh = () => {
    refetch();
  };

  const navigateToCheckOut = (price, amount) => {
    navigation.navigate('Checkout', {
      price,
      context: route.params.route,
      amount
    });
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <TopBar title={`Buy ${route.params.route}`} />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        style={styles.scrollView}>
        {error && <ErrorComponent tryAgain={refetch} />}
        {queryData.map(({amount, price}, index) => (
          <CoinItem
            key={index}
            amount={amount}
            price={price}
            route={pageContext}
            navigateToCheckOut={navigateToCheckOut}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    elevation: 0,
  },
  scrollView: {
    flex: 1,
    marginTop: 10,
  },
  coinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  buyBtn: {
    marginLeft: 'auto',
    padding: 10,
  },
  buyBtnText: {
    fontFamily: 'Poppins-Bold',
    color: '#5d11f7',
  },
  amount: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  price: {
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0,0,0,0.5)',
  },
});
const mapStateToProps = state => state.snackbar;
export default connect(
  mapStateToProps,
  {showSnackBar},
)(BuyCoins);
