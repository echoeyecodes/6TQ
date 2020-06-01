import React, {useContext, Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableNativeFeedback,
} from 'react-native';
import TopThreeProfile from '../components/LeaderBoardComponents/top-three-profile';
import ProfileOthers from '../components/LeaderBoardComponents/profile-others';
import Layout from '../Layout';
import ThemeContext from '../Context/ThemeContext';
import {Query} from 'react-apollo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import gql from 'graphql-tag';
import {connect} from 'react-redux';
import {showSnackBar} from '../redux/actions/snackbar-actions';

const USER_QUERY = gql`
  query($offset: Int, $tabContext: String) {
    users(offset: $offset, tabContext: $tabContext) {
      bio {
        username
        fullName
        imageUrl
      }
      stats {
        currentPoints
        totalPoints
      }
    }
  }
`;
const Others = ({data, fetchMore, index, tabContext}) => {
  const {theme} = useContext(ThemeContext);
  return (
    <View key={index} style={styles.othersContainer}>
      {data.map(({bio, stats}, index) => (
        <ProfileOthers
          image={bio.imageUrl}
          key={bio.id}
          rank={index + 2}
          name={bio.fullName}
          points={tabContext == 'All Time' ? stats.totalPoints : stats.currentPoints}
          username={bio.username}
        />
      ))}

      <TouchableNativeFeedback
        onPress={() =>
          fetchMore({
            variables: {
              offset: index,
              tabContext: tabContext =='All Time' ? 'all' : null
            },
            updateQuery: (prev, {fetchMoreResult}) => {
              if (!fetchMoreResult) return prev;
              return Object.assign({}, prev, {
                users: [...prev.users, ...fetchMoreResult.users],
              });
            },
          })
        }>
        <View style={[styles.fetchMoreBtn, {borderColor: theme.border}]}>
          <Ionicons name="md-add" size={24} color={theme.border} />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const FlatlistHeader = ({data, tabContext}) => {
  const {theme} = useContext(ThemeContext);
  return (
    <>
      {/*   <View style={[styles.justify, {marginVertical: 5}]}>
        <Text style={{color: theme.foreground}}> Your Rank:</Text>
        <Text style={styles.rank}>#{5}</Text>
      </View> */}

      <View style={styles.topThreeProfile}>
        {data.map(({bio, stats}) => (
          <TopThreeProfile
            key={bio.id}
            rank={1}
            image={bio.imageUrl}
            points={tabContext == 'All Time' ? stats.totalPoints : stats.currentPoints}
            name={bio.fullName}
            username="@echoeyecodes"
          />
        ))}
      </View>
    </>
  );
};
class LeaderBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  onRefresh = refetch => {
    refetch();
  };

  onCompleted = ({users}) => {
    this.setState({data: users});
  };

  onError = () => {
    this.props.showSnackBar("Couldn't contact server. Please try again!");
  };

  render() {
    return (
      <ThemeContext.Consumer>
        {({theme}) => (
          <Query
            query={USER_QUERY}
            fetchPolicy="cache-and-network"
            onCompleted={this.onCompleted}
            onError={this.onError}
            variables={{offset: 0, tabContext: this.props.context =='All Time' ? 'all' : null}}>
            {({loading, refetch, fetchMore}) => {
              return (
                <View
                  style={[
                    styles.container,
                    {backgroundColor: theme.background},
                  ]}>
                  {this.state.data.length <= 0 && !loading && (
                    <Text
                      style={[
                        styles.emptyUsersText,
                        {color: theme.foreground},
                      ]}>
                      No users yet
                    </Text>
                  )}
                  <FlatList
                    style={{flex: 1}}
                    refreshControl={
                      <RefreshControl
                        refreshing={loading}
                        onRefresh={() => {
                          this.onRefresh(refetch);
                        }}
                      />
                    }
                    decelerationRate={0.997}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={({bio}) => bio.id}
                    ListFooterComponent={() => (
                      <Others
                        fetchMore={fetchMore}
                        index={this.state.data.length}
                        tabContext={this.props.context}
                        data={this.state.data.slice(1, this.state.data.length)}
                      />
                    )}
                    ListHeaderComponent={() => (
                      <FlatlistHeader tabContext={this.props.context} data={this.state.data.slice(0, 1)} />
                    )}
                  />
                </View>
              );
            }}
          </Query>
        )}
      </ThemeContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  justify: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: '#5D11F8',
  },
  timeLeftText: {
    color: 'white',
    fontFamily: 'normal-default',
    textAlign: 'center',
  },
  rank: {
    color: '#4c8bf5',
    fontWeight: 'bold',
    fontSize: 16,
  },
  othersContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  fetchMoreBtn: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  emptyUsersText: {
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 10,
  },
});

const mapStateToProps = state => state.snackbar;
export default connect(
  mapStateToProps,
  {showSnackBar},
)(LeaderBoard);
