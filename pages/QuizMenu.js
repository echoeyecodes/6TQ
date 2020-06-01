import React, {Component, useContext} from 'react';
import {StyleSheet, View, Image, Text, ScrollView, RefreshControl} from 'react-native';
import TriviaDetails from '../components/QuizMenuComponents/TriviaDetails';
import Layout from '../Layout';
import ThemeContext from '../Context/ThemeContext';
import LoadingScreen from '../components/QuizComponents/LoadingScreen';
import gql from 'graphql-tag';
import {FAB} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PlaceBetModal from '../components/PlacebetModal';
import {Query} from 'react-apollo';
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
class QuizMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showModal: false,
      stake: null,
      minutes: 0,
      seconds: 0,
    };
  }

  startGame = () => {
    this.onCompleted();
  };

  onBetPlaced = message => {
    this.props.showSnackBar(message);
    this.dismissModal();
  };

  dismissModal = () => {
    this.setState({showModal: false, stake: null});
  };

  onCompleted = () => {
    this.setState({isLoading: true}, () => {
      setTimeout(() => {
        this.setState({isLoading: false}, () => {
          this.props.navigation.navigate('Quiz', {
            lives: this.props.userStats.lives,
          });
        });
      }, 2000);
    });
  };

  componentDidMount() {}

  subscribeToMore = () => {};

  componentWillUnmount() {}

  render() {
    return (
      <ThemeContext.Consumer>
        {({theme}) => (
          <Layout title="Home">
            <Query fetchPolicy="cache-and-network" query={EVENT_QUERY}>
              {({data, loading, error, subscribeToMore, refetch}) => {
                if (loading) return <LoadingComponent />;
                if (error) return <Text>Error</Text>;
                const {events} = data;
                this.subscribeToMore = subscribeToMore({
                  document: EVENT_SUBSCRIPTION,
                  updateQuery: (prev, {subscriptionData}) => {
                    if (!subscriptionData.data) {
                      return prev;
                    }

                    const isNewEvent =
                      !subscriptionData.data.eventUpdated.isOpen &&
                      subscriptionData.data.eventUpdated.isOpen !==
                        prev.events.isOpen &&
                      subscriptionData.data.eventUpdated.canStake;

                    if (isNewEvent) {
                      this.props.showMessage({
                        title: `Event has ended. Looks like you finished with ${
                          this.props.userStats.currentPoints
                        } points`,
                        desc:
                          'Place your bets for the next round to play more and win more!',
                        image: require('../assets/time.png'),
                      });
                    }
                    return Object.assign({}, prev, {
                      events: subscriptionData.data.eventUpdated,
                    });
                  },
                });
                return (
                  <>
                  <ScrollView showsVerticalScrollIndicator={false}    refreshControl= {<RefreshControl
              refreshing={loading}
              onRefresh={() => {
                refetch();
              }}
            />
              }
            >
                  <View
                    style={[
                      styles.container,
                      {backgroundColor: theme.background},
                    ]}>
                    {this.state.isLoading && (
                      <LoadingScreen message="Starting your game" />
                    )}
                    <TriviaDetails
                      data={events}
                      userActivity={this.props.userActivity}
                      startGame={this.startGame}
                    />
                    <UserParticipatedComponent
                      data={this.props.userActivity.hasStaked}
                    />
                    <PlaceBetModal
                      onBetPlaced={this.onBetPlaced}
                      onDismiss={this.dismissModal}
                      visible={this.state.showModal}
                      coinsLeft={this.props.userStats.coins}
                    />
                  </View>
                  </ScrollView>

                  <FAB
                      icon={({color, size, ...props}) => (
                        <FontAwesome
                          {...props}
                          name="money"
                          color={color}
                          size={size}
                        />
                      )}
                      color="white"
                      style={styles.fab}
                      onPress={() => {
                        if (!events.canStake) {
                          alert(
                            'You cannot place bets at this time. Try again after this event is over',
                          );
                          return;
                        }
                        this.setState({showModal: true});
                      }}
                    />
                  </>
                );
              }}
            </Query>
          </Layout>
        )}
      </ThemeContext.Consumer>
    );
  }
}

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
