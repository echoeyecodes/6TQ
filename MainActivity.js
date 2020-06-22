import React, {Component, useContext} from 'react';
import Quiz from './pages/Quiz';
import Scoreboard from './pages/Scoreboard';
import ThemeContext, {themes} from './Context/ThemeContext';
import QuizMenu from './pages/QuizMenu';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import LeaderBoard from './pages/LeaderBoard';
import Profile from './pages/Profile';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import BuyCoins from './pages/BuyCoins';
import Checkout from './pages/Checkout';
import {showMessage} from './redux/actions/message-action';
import Withdraw from './pages/Withdraw';
import Layout from './Layout';

const Stack = createStackNavigator();
const BottomNavigator = createBottomTabNavigator();
const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
  const {theme} = useContext(ThemeContext);
  return (
    <Tab.Navigator
      lazy={false}
      sceneContainerStyle={{backgroundColor: theme.background}}
      tabBarOptions={{
        activeTintColor: '#fff',
        indicatorContainerStyle: {backgroundColor: theme.background},
        inactiveTintColor: theme.opacity,
        indicatorStyle: {
          top: 0,
          height: '100%',
          backgroundColor: '#5d11f7',
          borderRadius: 25,
        },
        style: {elevation: 0},
      }}>
      <Tab.Screen name="Daily">
        {props => <LeaderBoard {...props} context="Daily" />}
      </Tab.Screen>
      <Tab.Screen name="All Time">
        {props => <LeaderBoard {...props} context="All Time" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const BottomNav = ({theme}) => {
  return (
    <BottomNavigator.Navigator
      backBehavior="initialRoute"
      tabBarOptions={{
        showLabel: false,
        activeTintColor: '#5d11f7',
        inactiveTintColor: theme.opacity,
        tabStyle: {backgroundColor: theme.background},
      }}>
      <BottomNavigator.Screen
        name="Home"
        options={{
          tabBarIcon: ({color}) => (
            <AntDesign name="home" color={color} size={24} />
          ),
        }}>
        {props => <QuizMenu {...props} />}
      </BottomNavigator.Screen>
      <BottomNavigator.Screen
        name="Notifications"
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons
              name="ios-notifications-outline"
              color={color}
              size={28}
            />
          ),
        }}>
        {props => <Notifications {...props} />}
      </BottomNavigator.Screen>
      <BottomNavigator.Screen
        name="Leaderboard"
        options={{
          tabBarIcon: ({color}) => (
            <SimpleLineIcons name="trophy" color={color} size={24} />
          ),
        }}>
        {props => (
          <Layout {...props} title="Leaderboard">
            <TabNavigator />
          </Layout>
        )}
      </BottomNavigator.Screen>
      <BottomNavigator.Screen
        name="Profile"
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="ios-person" color={color} size={24} />
          ),
        }}>
        {props => <Profile {...props} />}
      </BottomNavigator.Screen>
    </BottomNavigator.Navigator>
  );
};

class MainActivity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      theme: themes.light,
      isLoading: true,
    };
  }

  onError = error => {};
  render() {
    const {authenticated} = this.props.authenticated;
    const {theme} = this.props.theme;

    return (
      <ThemeContext.Provider
        value={{theme: this.props.theme, toggleTheme: this.props.toggleTheme}}>
        <ThemeContext.Consumer>
          {({theme}) => {
            return authenticated ? (
              <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Index">
                  {props => <BottomNav {...props} theme={theme} />}
                </Stack.Screen>
                <Stack.Screen name="Quiz" component={Quiz} />
                <Stack.Screen name="Scoreboard" component={Scoreboard} />
                <Stack.Screen name="Checkout" component={Checkout} />
                <Stack.Screen name="BuyCoins" component={BuyCoins} />
                <Stack.Screen name="Withdraw" component={Withdraw} />
              </Stack.Navigator>
            ) : (
              <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{headerShown: false}}>
                <Stack.Screen name="Login" component={Login} />
              </Stack.Navigator>
            );
          }}
        </ThemeContext.Consumer>
      </ThemeContext.Provider>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authenticated,
    message: state.message,
  };
};

export default connect(
  mapStateToProps,
  {showMessage},
)(MainActivity);
