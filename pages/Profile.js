import React, {useContext, useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableNativeFeedback,
  Clipboard,
  ScrollView,
} from 'react-native';
import {FAB, Snackbar} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import Layout from '../Layout';
import ThemeContext from '../Context/ThemeContext';
import EarnCoinModal from '../components/EarnCoinModal';
import {
  InterstitialAd,
  TestIds,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from '@react-native-firebase/admob';
import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {connect} from 'react-redux';
import {showSnackBar} from '../redux/actions/snackbar-actions';
import LoadingScreen from '../components/QuizComponents/LoadingScreen';
const USER_MUTATION = gql`
  mutation User($lives: Int, $points: Int) {
    updateUserStats(lives: $lives, points: $points) {
      bio {
        username
      }
    }
  }
`;


const ProfileHeader = ({userData}) => {
  const {fullName, imageUrl, username} = userData;
  const {theme} = useContext(ThemeContext);
  return (
    <View style={styles.profileHeader}>
      <Image source={{uri: imageUrl}} style={styles.profileImage} />
      <View style={styles.profileDetails}>
        <Text style={[styles.profileTitle, {color: theme.foreground}]}>
          {fullName}
        </Text>
        <Text style={[styles.profileDesc, {color: theme.foreground}]}>
          {username}
        </Text>
      </View>
    </View>
  );
};

const ProfileCounts = ({userData}) => {
  const {theme} = useContext(ThemeContext);
  const {gamesPlayed, currentPoints, level} = userData;
  return (
    <View style={[styles.profileCount, {
      borderColor: theme.border
    }]}>
      <View style={styles.profileCountItem}>
        <Text style={[styles.profileTitle, {color: theme.foreground}]}>
          {gamesPlayed}
        </Text>
        <Text style={[styles.profileDesc, {color: theme.foreground}]}>
          Games
        </Text>
      </View>

      <View style={styles.profileCountItem}>
        <Text style={[styles.profileTitle, {color: theme.foreground}]}>
          {level}
        </Text>
        <Text style={[styles.profileDesc, {color: theme.foreground}]}>
          Level
        </Text>
      </View>

      <View style={styles.profileCountItem}>
        <Text style={[styles.profileTitle, {color: theme.foreground}]}>
          {currentPoints}
        </Text>
        <Text style={[styles.profileDesc, {color: theme.foreground}]}>
          Score
        </Text>
      </View>
    </View>
  );
};

const RechargeButton = ({showRechargeOptions, value}) => {
  return (
    <TouchableNativeFeedback onPress={showRechargeOptions}>
      <View style={styles.rechargeBtn}>
        <Text style={styles.rechargeBtnText}>{value}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};
const ProfileTabs = ({children, title, description}) => {
  const {theme} = useContext(ThemeContext);
  return (
    <TouchableNativeFeedback>
      <View style={styles.profileTabs}>
        <View>
          <Text
            style={[
              styles.profileTitle,
              {fontSize: 16, color: theme.foreground},
            ]}>
            {title}
          </Text>
          <Text style={[styles.profileDesc, {color: theme.opacity}]}>
            {description}
          </Text>
        </View>
        {children}
      </View>
    </TouchableNativeFeedback>
  );
};
const Profile = props => {
  const {theme} = useContext(ThemeContext);
  const {bio, stats, activity} = props.userData;
  const [showOptions, setShowOptions] = useState(false);
  const [increaseUserLife, {}] = useMutation(USER_MUTATION);

 

  const showAd = () => {
    props.showSnackBar('Loading your ad. Please wait...');
    const interstitialId = RewardedAd.createForAdRequest(
      'ca-app-pub-5590121921077996/9067677674',
    );
    interstitialId.onAdEvent(async (type, error, reward) => {
      /* RewardedAdEventType.EARNED_REWARD */
      console.log(type);
      if (error) {
        console.log(error);
        props.showSnackBar("Sorry. Couldn't load your ad. Please try again");
        return;
      }
      if (type === RewardedAdEventType.EARNED_REWARD) {
        increaseUserLife({variables: {lives: reward.amount}});
        props.showSnackBar(`You have received ${reward.amount} life`);
      }
      if (type === RewardedAdEventType.LOADED) {
        interstitialId.show();
      }
    });
    interstitialId.load();
  };

  const copyUserNameToClipboard = () => {
    Clipboard.setString(
      `Hey! Join me on 6TQ to win cash prizes. Used my code to win extra lives. My referal code is ${
        bio.username
      }`,
    );
    props.showSnackBar(`Your referal code has been copied to clipboard`);
  };

  const onOptionSelected = value => {
    setShowOptions(false);
    switch (value) {
      case 0:
        showAd();
        break;
      case 1:
        copyUserNameToClipboard();
        break;
      case 2:
        navigateToStore('Lives');
    }
  };

  const showRechargeOptions = () => {
    setShowOptions(!showOptions);
  };

  const navigateToStore = value => {
    props.navigation.navigate('BuyCoins', {
      route: value,
    });
  };

  return (
    <Layout title="Profile">
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        <EarnCoinModal
          onDismiss={showRechargeOptions}
          onOptionSelected={onOptionSelected}
          visible={showOptions}
        />
        <ScrollView decelerationRate={0.997}>
          <ProfileHeader userData={bio} />
          <ProfileCounts userData={stats} />
          <ProfileTabs title="Lives" description={`Remaining ${stats.lives}`}>
            <RechargeButton
              value="Recharge"
              showRechargeOptions={showRechargeOptions}
            />
          </ProfileTabs>
          <ProfileTabs title="Coins" description={stats.coins}>
            <RechargeButton
              value="Buy More"
              showRechargeOptions={() => navigateToStore('Coins')}
            />
          </ProfileTabs>
          <ProfileTabs title="Contact Information" description={bio.email} />
          <ProfileTabs
            title="Total Cash"
            description={`#${stats.cashLeft} ${
              activity.hasRequestedWithdrawal ? '(Pending)' : ''
            }`}
          />
        </ScrollView>

        <FAB
          icon={({color, size, ...props}) => (
            <Entypo {...props} name="credit" color={color} size={size} />
          )}
          color="white"
          style={styles.fab}
          onPress={() => {
            if(stats.cashLeft < 1000){
              alert("You must have a minium of #1000 before you can issue a withdrawal")
              return
            }
            if(activity.hasRequestedWithdrawal){
              alert("You have already issued a request. Wait until it is resolved")
              return
            }
            props.navigation.navigate("Withdraw")
          }}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  profileDetails: {
    flex: 1,
    marginLeft: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileTitle: {
    fontFamily: 'poppins-medium',
    fontSize: 20,
    marginBottom: 0,
  },
  profileDesc: {
    fontFamily: 'poppins-regular',
    color: 'rgba(0,0,0,0.5)',
  },
  profileCount: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  profileCount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    marginHorizontal: 10,
    marginVertical: 20,
    borderRadius: 5,
  },
  profileCountItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileTabs: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 5,
  },
  rechargeBtn: {
    borderRadius: 3,
    padding: 10,
    backgroundColor: '#5d11f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  rechargeBtnText: {
    color: '#fff',
    fontFamily: 'poppins-semibold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#5d11f7',
  },
});

const mapStateToProps = state => state.snackbar;
export default connect(
  mapStateToProps,
  {showSnackBar},
)(Profile);
