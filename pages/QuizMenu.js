/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useContext, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import TriviaDetails from '../components/QuizMenuComponents/TriviaDetails';
import Layout from '../Layout';
import ThemeContext from '../Context/ThemeContext';
import LoadingScreen from '../components/QuizComponents/LoadingScreen';
import gql from 'graphql-tag';
import {FAB} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PlaceBetModal from '../components/PlacebetModal';
import {Query, useQuery} from 'react-apollo';
import LoadingComponent from '../components/LoadingComponent';
import {showSnackBar} from '../redux/actions/snackbar-actions';
import {connect} from 'react-redux';
import {showMessage} from '../redux/actions/message-action';

const EVENT_QUERY = gql`
  query {
    events {
      name
      amount
      isOpen
      canStake
      time
      maintainanceRequired
    }
    stats {
      currentPoints
      cashLeft
      level
      coins
      lives
    }
    activity {
      hasStaked
      hasCurrentlyPlayed
      hasRequestedWithdrawal
    }
  }
`;

const EVENT_SUBSCRIPTION = gql`
  subscription {
    eventUpdated {
      name
      amount
      isOpen
      time
      maintainanceRequired
      canStake
    }
  }
`;

const USER_ACTIVITY_SUBSCRIPTION = gql`
  subscription {
    userActivityUpdated {
      hasStaked
      hasCurrentlyPlayed
      hasRequestedWithdrawal
    }
  }
`;

const USER_STATS_SUBSCRIPTION = gql`
  subscription {
    userStatsUpdated {
      currentPoints
      gamesPlayed
      cashLeft
      lives
      level
      coins
    }
  }
`;

const UserParticipatedComponent = ({data}) => {
  const {theme} = useContext(ThemeContext);
  return (
    <View style={[styles.userParticipatedComponent]}>
      <Image
        style={styles.image}
        source={
          data ? require('../assets/party.png') : require('../assets/sad.png')
        }
      />

      <Text style={[styles.message, {color: theme.foreground}]}>
        {data
          ? 'Seems like you placed a bet and now you are eligible to participate in this event.. Ready your thumbs 👍👍👍'
          : "You haven't placed a bet. You won't be able to participate in this next event if you have no bet placed"}
      </Text>
    </View>
  );
};
const QuizMenu = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stake, setStake] = useState(null);
  const {data, loading, error, subscribeToMore, refetch} = useQuery(
    EVENT_QUERY,
    {
      fetchPolicy: 'cache-and-network',
    },
  );
  const {theme, toggleTheme} = useContext(ThemeContext);
  const unsubscribe = useRef(null);
  const unsubscribe1 = useRef(null);
  const unsubscribe2 = useRef(null);

  const {
    events,
    stats: {currentPoints, lives},
    activity,
    bio,
  } = data;
  const startGame = livess => {
    onCompleted(lives);
  };

  const onBetPlaced = message => {
    dismissModal();
    props.showSnackBar(message);
  };

  // Create seperate queries for stats, bio, activity
  const dismissModal = () => {
    setShowModal(false);
    setStake(null);
  };

  const onCompleted = lives => {
    console.log(lives);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      props.navigation.navigate('Quiz', {
        lives,
      });
    }, 2000);
  };

  useEffect(() => {
    if (data) {
      unsubscribe.current = subscribeToMore({
        document: EVENT_SUBSCRIPTION,
        updateQuery: (prev, {subscriptionData}) => {
          if (!subscriptionData.data) {
            return prev;
          }
          console.log(subscriptionData.data.eventUpdated);
          const {eventUpdated} = subscriptionData.data;
          const {isOpen, canStake} = eventUpdated;

          const isNewEvent =
            !isOpen && isOpen !== prev.events.isOpen && canStake;

          if (isNewEvent) {
            props.showMessage({
              title: `Event has ended. Looks like you finished with ${currentPoints} points`,
              desc:
                'Drop your price for the next round to play more and win more!',
              image: require('../assets/time.png'),
            });
          }
          return Object.assign({}, prev, {
            events: eventUpdated,
          });
        },
      });

      unsubscribe1.current = subscribeToMore({
        document: USER_ACTIVITY_SUBSCRIPTION,
        updateQuery: (prev, {subscriptionData}) => {
          if (!subscriptionData.data) {
            return prev;
          }
          const {
            data: {userActivityUpdated},
          } = subscriptionData;
          const newActivity = userActivityUpdated;
          console.log(newActivity);
          return Object.assign({}, prev, {
            activity: newActivity,
          });
        },
      });

      unsubscribe2.current = subscribeToMore({
        document: USER_STATS_SUBSCRIPTION,
        updateQuery: (prev, {subscriptionData}) => {
          if (!subscriptionData.data) {
            return prev;
          }
          const newStats = subscriptionData.data.userStatsUpdated;

          const isLevelDifference = newStats.level > prev.stats.level;
          console.log(newStats);

          if (isLevelDifference) {
            props.showMessage({
              title: `Congratulations! You just leveled up to level ${
                newStats.level
              }`,
              desc: `You now earn an extra ${
                newStats.level
              }% on evey amount of money you withdraw`,
              image: require('../assets/level.png'),
            });
          }
          return Object.assign({}, prev, {
            stats: newStats,
          });
        },
      });
    }

    return () => {
      unsubscribe.current();
      unsubscribe1.current();
      unsubscribe2.current();
    };
  }, []);

  return (
    <Layout title="Home">
      <View style={styles.container}>
        <ScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                refetch();
              }}
            />
          }>
          <View style={[styles.container, {backgroundColor: theme.background}]}>
            {data && (
              <View style={{flex: 1}}>
                <TriviaDetails
                  data={events}
                  userActivity={data.activity}
                  startGame={() => startGame(data.stats.lives)}
                />
                <UserParticipatedComponent data={data.activity.hasStaked} />
                <PlaceBetModal
                  onBetPlaced={onBetPlaced}
                  onDismiss={dismissModal}
                  visible={showModal}
                  coinsLeft={data.stats.coins}
                />
              </View>
            )}
          </View>
        </ScrollView>

        {data && (
          <FAB
            icon={({color, size, ...props}) => (
              <FontAwesome {...props} name="money" color={color} size={size} />
            )}
            color="white"
            style={styles.fab}
            onPress={() => {
              if (events && !events.canStake) {
                alert(
                  'You cannot place bets at this time. Try again after this event is over',
                );
                return;
              }
              setShowModal(true);
            }}
          />
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#5d11f7',
  },
  userParticipatedComponent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginTop: 50,
  },
  image: {
    width: 100,
    height: 100,
  },
  message: {
    textAlign: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    fontFamily: 'Poppins-Regular',
  },
});

const mapStateToProps = state => {
  return {
    snackbar: state.snackbar,
    message: state.message,
  };
};
export default connect(
  mapStateToProps,
  {showSnackBar, showMessage},
)(QuizMenu);
