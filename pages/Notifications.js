import React, {useState, useContext, useEffect, useRef, memo} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  RefreshControl,
  TouchableNativeFeedback,
  FlatList,
} from 'react-native';
import Layout from '../Layout';
import ThemeContext from '../Context/ThemeContext';
import moment from 'moment';
import {useQuery} from 'react-apollo';
import gql from 'graphql-tag';
import LoadingComponent from '../components/LoadingComponent';

const NOTIFICATION_QUERY = gql`
  query($offset: Int) {
    notifications (offset: $offset) {
      route
      timestamp
      isRead
      message
    }
  }
`;

const NOTIFICATION_SUBSCRIPTION = gql`
  subscription {
    userNotificationsUpdated {
      route
      timestamp
      isRead
      message
    }
  }
`;

const notificationItem = ({msg, image, time, route, navigation}) => {
  const {theme} = useContext(ThemeContext);
  const date = new Date()
  date.setTime(time)
  const timeDifference = moment(date).fromNow();
  return (
    <TouchableNativeFeedback onPress={() => navigation.navigate(route)}>
      <View style={styles.notificationItem}>
        <Image source={image} style={styles.notificationImage} />
        <View style={{flex: 1}}>
          <Text style={[styles.notificationMsg, {color: theme.foreground}]}>
            {msg}
          </Text>
          <Text style={[styles.notificationTime, {color: theme.foreground}]}>
            {timeDifference}
          </Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};


const propsAreEqual = (prevProps, nextProps) =>{
  return prevProps.msg == nextProps.msg
}

const MemoizedNotificationItem = memo(notificationItem, propsAreEqual)

const Notifications = props => {
  const {theme} = useContext(ThemeContext);
  const [data, setData] = useState([]);
  const offset = useRef(null)
  const unsubscribeRef = useRef(null);
  const {loading, refetch, subscribeToMore, fetchMore} = useQuery(NOTIFICATION_QUERY, {
    fetchPolicy: 'cache-and-network',
    onCompleted: queryData => {
      setData([...queryData.notifications]);
      offset.current = queryData.notifications.length
    },
  });
  useEffect(() => {
    if (subscribeToMore) {
      unsubscribeRef.current = subscribeToMore({
        document: NOTIFICATION_SUBSCRIPTION,
        updateQuery: (prev, {subscriptionData}) => {
          if (!subscriptionData.data) {
            return prev;
          }
          setData([subscriptionData.data.userNotificationsUpdated, ...data]);
        },
      });
    }
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return (
    <Layout title="Notifications">
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        <View style={styles.notificationHolder}>
          <Text style={[styles.subtitle, {color: theme.foreground}]}>All</Text>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={() => {
                    refetch();
                  }}
                />
              }
              data={data}
              keyExtractor={data => String(data.timestamp)}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                fetchMore({
                  variables: {
                    offset: offset.current,
                  },
                  updateQuery: (prev, {fetchMoreResult}) => {
                    if (!fetchMoreResult) return prev;
                    
                    offset.current = offset.current + 20
                    return Object.assign({}, prev, {
                      notifications: [...prev.notifications, ...fetchMoreResult.notifications],
                    });
                  },
                })
              }}
              renderItem={({item}) => {
                return (
                  <MemoizedNotificationItem
                    image={require('../assets/bot.png')}
                    msg={item.message}
                    time={item.timestamp}
                    route={item.route}
                    navigation={props.navigation}
                  />
                )
              }}
            />
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterIcon: {
    marginLeft: 'auto',
  },
  subtitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    marginHorizontal: 10,
  },
  notificationHolder: {
    marginVertical: 10,
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  notificationMsg: {
    marginLeft: 10,
    fontFamily: 'Poppins-Regular',
  },
  notificationTime: {
    color: 'rgba(0,0,0,0.5)',
    marginLeft: 10,
  },
});

export default memo(Notifications);
