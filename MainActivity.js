import React, {Component, useContext} from 'react';
import Quiz from './pages/Quiz';
import Scoreboard from './pages/Scoreboard';
import ThemeContext, {themes} from './Context/ThemeContext';
import QuizMenu from './pages/QuizMenu';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import {Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import LeaderBoard from './pages/LeaderBoard';
import Profile from './pages/Profile';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import BuyCoins from './pages/BuyCoins';
import LoadingComponent from './components/LoadingComponent';
import ErrorComponent from './components/ErrorComponent';
import Checkout from './pages/Checkout';
import {showMessage} from './redux/actions/message-action';
import Withdraw from './pages/Withdraw';
import Layout from './Layout';

const Stack = createStackNavigator();
const BottomNavigator = createBottomTabNavigator();
const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
  const {theme} = useContext(ThemeContext)
  return (
    <Tab.Navigator lazy={false} sceneContainerStyle={{backgroundColor: theme.background}} tabBarOptions={{
      activeTintColor:'#fff',
      indicatorContainerStyle:{backgroundColor: theme.background},
      inactiveTintColor: theme.opacity,
      indicatorStyle:{
        top: 0,
        height: '100%',
        backgroundColor: '#5d11f7',
        borderRadius: 25
      },
      style:{elevation: 0}
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
const USER_QUERY = gql`
  query {
    user {
      bio {
        username
        fullName
        id
        imageUrl
        email
      }
      stats {
        currentPoints
        gamesPlayed
        cashLeft
        lives
        level
        coins
      }
      activity {
        hasStaked
        hasCurrentlyPlayed
        hasRequestedWithdrawal
      }
    }
  }
`;

const USER_SUBSCRIPTION = gql`
  subscription {
    userStatsUpdated {
      bio {
        username
        fullName
        id
        imageUrl
        email
      }
      stats {
        currentPoints
        gamesPlayed
        cashLeft
        lives
        level
        coins
      }
      activity {
        hasStaked
        hasCurrentlyPlayed
        hasRequestedWithdrawal
      }
    }
  }
`;
const BottomNav = ({theme, data}) => {
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
        {props => (
          <QuizMenu
            {...props}
            name={data.user.bio.fullName}
            userStats={data.user.stats}
            userActivity={data.user.activity}
          />
        )}
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
          <Layout {...props} title='Leaderboard'>
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
        {props => <Profile {...props} userData={data.user} />}
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

  componentDidMount() {}
  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const {authenticated} = this.props.authenticated;
    const {theme} = this.props.theme;

    return (
      <ThemeContext.Provider
        value={{theme: this.props.theme, toggleTheme: this.props.toggleTheme}}>
        <ThemeContext.Consumer>
          {({theme}) => {
            return authenticated ? (
              <Query
                query={USER_QUERY}
                fetchPolicy="cache-and-network"
                onError={this.onError}>
                {({loading, data, error, refetch, subscribeToMore}) => {
                  if (loading) {
                    return <LoadingComponent />;
                  }
                  if (error) return <ErrorComponent tryAgain={refetch} />;

                  if (data) {
                    this.unsubscribe = subscribeToMore({
                      document: USER_SUBSCRIPTION,
                      updateQuery: (prev, {subscriptionData}) => {
                        if (!subscriptionData.data) {
                          return prev;
                        }
                        const newStats = subscriptionData.data.userStatsUpdated;

                        const isLevelDifference =
                          newStats.stats.level > prev.user.stats.level;

                        if (isLevelDifference) {
                          this.props.showMessage({
                            title: `Congratulations! You just leveled up to level ${
                              newStats.stats.level
                            }`,
                            desc: `You now earn an extra ${
                              newStats.stats.level
                            }% on evey amount of money you withdraw`,
                            image: require('./assets/level.png'),
                          });
                        }

                        return Object.assign({}, prev, {
                          user: newStats,
                        });
                      },
                    });

                    return (
                      <Stack.Navigator screenOptions={{headerShown: false}}>
                        <Stack.Screen name="Index">
                          {props => (
                            <BottomNav {...props} data={data} theme={theme} />
                          )}
                        </Stack.Screen>
                        <Stack.Screen name="Quiz" component={Quiz} />
                        <Stack.Screen
                          name="Scoreboard"
                          component={Scoreboard}
                        />
                        <Stack.Screen name="Checkout" component={Checkout} />
                        <Stack.Screen name="BuyCoins" component={BuyCoins} />
                        <Stack.Screen name="Withdraw" component={Withdraw} />
                      </Stack.Navigator>
                    );
                  }
                }}
              </Query>
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
