import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Text, TextInput, View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

import {SignInScreen, Home, Profile, AddDevice, AddingDevice} from './components/screens';
import sercrets from './sercrets';

export const AuthContext = React.createContext();

function SplashScreen() {
  return (
    <View style={{flex: 1}}>
      <ActivityIndicator
        size="large"
        color="black"
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App({navigation}) {
  const [user, setUser] = React.useState({});
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  // Google Sign In configure
  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId: sercrets.GOOGLE_WEB_CLIENT_ID_RELEASE, // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      // hostedDomain: '', // specifies a hosted domain restriction
      // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    });
  }, []);

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      // signIn: async (data) => {
      signIn: async () => {
        let userInfoTmp = {};
        try {
          await GoogleSignin.hasPlayServices();
          userInfoTmp = await GoogleSignin.signIn();
          // console.log(user);
          setUser(userInfoTmp);
        } catch (error) {
          console.log(error);
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }

        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        const tokenStr = JSON.stringify(userInfoTmp.idToken);
        dispatch({type: 'SIGN_IN', token: tokenStr});
      },
      signOut: async () => {
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
          setUser(null); // Remember to remove the user from your app's state as well
        } catch (error) {
          console.error(error);
        }
        dispatch({type: 'SIGN_OUT'});
      },
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      getCurrentUser: async () => {
        const currentUser = await GoogleSignin.getCurrentUser();
        setUser(currentUser);

        const tokenStr = JSON.stringify(currentUser.idToken);
        dispatch({type: 'SIGN_IN', token: tokenStr});
        return currentUser;
      },
      isSignedIn: async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        return isSignedIn;
      },
      getCurrentUser2: async () => {
        const currentUser = await GoogleSignin.getCurrentUser();
        return currentUser;
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : // <Stack.Screen name="Loading" component={ActivityIndicator} />
          state.userToken == null ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: 'Sign in',
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          ) : (
            // User is signed in
            <Stack.Screen name="Home" component={Home} />
            // <Stack.Screen name="Profile" component={Profile} />
          )}
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="AddDevice" component={AddDevice} />
          <Stack.Screen name="AddingDevice" component={AddingDevice} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
