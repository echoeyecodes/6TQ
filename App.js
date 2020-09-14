import React from 'react';
import {Provider} from 'react-redux';
import {store, persistor} from './redux/store/store';
import {AsyncStorage} from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin';
import MainActivity from './MainActivity';
import {PersistGate} from 'redux-persist/integration/react';
import PaperProvider from './PaperProvider';
import {persistCache} from 'apollo-cache-persist';
import {ApolloProvider} from 'react-apollo';
import UserContext from './Context/UserContext';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error';
import {ApolloLink, Observable} from 'apollo-link';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from './SplashScreen';
import {WebSocketLink} from 'apollo-link-ws';
import {getMainDefinition} from 'apollo-utilities';
import {split} from 'apollo-link';
import SnackbarComponent from './components/SnackbarComponent';
import {
  SHOW_SNACKBAR,
  ENABLE_AUTHENTICATION,
  DISABLE_AUTHENTICATION,
} from './redux/actions/types';
import {themes} from './Context/ThemeContext';
import LevelReachedModal from './components/LevelReachedModal';

const request = async operation => {
  const token = await AsyncStorage.getItem('user-token');
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : undefined,
    },
  });
};

const wsLink = new WebSocketLink({
  uri: 'ws://15.15.15.9:3001/graphql',
  options: {
    reconnect: true,
    lazy: true,
    reconnectionAttempts: Infinity,
  },
});

const subscriptionMiddleware = {
  applyMiddleware: async (options, next) => {
    const token = await AsyncStorage.getItem('user-token');
    let data = {
      headers: {
        authorization: token ? `Bearer ${token}` : undefined,
      },
    };
    options.authToken = data;
    next();
  },
};

// add the middleware to the web socket link via the Subscription Transport client
wsLink.subscriptionClient.use([subscriptionMiddleware]);

const httpLink = new HttpLink({
  uri: 'http://15.15.15.9:3001/graphql',
  credentials: 'same-origin',
});
const link = split(
  // split based on operation type
  ({query}) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const cache = new InMemoryCache();
const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle;
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) {
          handle.unsubscribe();
        }
      };
    }),
);

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({graphQLErrors, networkError}) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({message, locations, path}) => {
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          );
          if (
            message.includes('Not authencticated') ||
            message.includes('jwt malformed')
          ) {
            store.dispatch({type: DISABLE_AUTHENTICATION, payload: false});
          }
        });
      }
      if (networkError) {
        store.dispatch({
          type: SHOW_SNACKBAR,
          payload: "Couldn't contact the server!",
        });
      }
    }),
    requestLink,
    link,
  ]),
  cache,
  request: async operation => {
    const token = await AsyncStorage.getItem('user-token');
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : undefined,
      },
    });
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      theme: themes.light,
      hydrated: false,
      isAuthenticated: false,
      isLoading: true,
      isError: false,
    };
  }

  changeTheme = value => {
    this.setState({theme: value});
    /* this.fetchMe() */
  };
  persistCacheStorage = async () => {
    await persistCache({
      cache,
      storage: AsyncStorage,
    });
  };

  updateTheme = async () => {
    const theme = await AsyncStorage.getItem('app-theme');
    if (!theme) {
      await AsyncStorage.setItem('app-theme', 'light');
      this.setState({theme: themes.light});
      return;
    }
    this.setState({theme: themes[theme]});
  };

  async bootstrap() {
    this.updateTheme();
    await GoogleSignin.configure({
      webClientId:
        '40175272704-e1j644s96kd7esn552ivifin6qt0nc5m.apps.googleusercontent.com', // required
    });
  }

  toggleTheme = async () => {
    const theme = await AsyncStorage.getItem('app-theme');
    if (theme == 'dark') {
      await AsyncStorage.setItem('app-theme', 'light');
      this.setState({theme: themes.light});
      return;
    }
    await AsyncStorage.setItem('app-theme', 'dark');
    this.setState({theme: themes.dark});
  };

  authenticate = async () => {
    /* await AsyncStorage.setItem('user-token', 'sdasdr')
    await AsyncStorage.clear() */
    const token = await AsyncStorage.getItem('user-token');
    setTimeout(() => {
      if (token) {
        this.setState({isLoading: false});
        return;
      }
      this.setState({isLoading: false});
    }, 2000);
  };

  async componentDidMount() {
    /* FullScreen.enable() */
    this.authenticate();
    this.bootstrap();

    await this.persistCacheStorage();
    this.setState({hydrated: true});
  }

  render() {
    if (this.state.isLoading) {
      return <SplashScreen />;
    }
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <PaperProvider>
            <PersistGate persistor={persistor} loading={null}>
              {this.state.hydrated && (
                <NavigationContainer>
                  <SnackbarComponent />
                  <LevelReachedModal />
                  <MainActivity
                    toggleTheme={this.toggleTheme}
                    theme={this.state.theme}
                  />
                </NavigationContainer>
              )}
            </PersistGate>
          </PaperProvider>
        </Provider>
      </ApolloProvider>
    );
  }
}
export default App;
