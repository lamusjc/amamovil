import 'react-native-gesture-handler';

import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Article from './Article';
import Main from './Main';
import {Header, Image} from 'react-native-elements';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Cart from './Cart';
import Payment from './Payment';
import MyArticles from './MyArticles';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default class Home extends React.Component {
  //   navigation = useNavigation();
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Stack.Navigator
        drawerContentOptions={{
          activeTintColor: '#e91e63',
          itemStyle: {marginVertical: 5},
        }}
        initialRouteName="Main">
        <Stack.Screen
          options={{
            title: 'Main', //Set Header Title
            headerLeft: () => (
              <NavigationDrawerStructure
                navigationProps={this.props.navigation}
              />
            ),
            headerStyle: {
              backgroundColor: '#2089dc', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
          name="Main"
          component={Main}
        />
        <Stack.Screen
          options={{
            title: 'Article', //Set Header Title
            headerLeft: () => (
              <NavigationDrawerStructure
                navigationProps={this.props.navigation}
              />
            ),
            headerStyle: {
              backgroundColor: '#2089dc', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
          name="Article"
          component={Article}
        />
        <Stack.Screen
          options={{
            title: 'Cart', //Set Header Title
            headerLeft: () => (
              <NavigationDrawerStructure
                navigationProps={this.props.navigation}
              />
            ),
            headerStyle: {
              backgroundColor: '#2089dc', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
          name="Cart"
          component={Cart}
        />

        <Stack.Screen
          options={{
            title: 'Payment', //Set Header Title
            headerLeft: () => (
              <NavigationDrawerStructure
                navigationProps={this.props.navigation}
              />
            ),
            headerStyle: {
              backgroundColor: '#2089dc', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
          name="Payment"
          component={Payment}
        />

        <Stack.Screen
          options={{
            title: 'My articles', //Set Header Title
            headerLeft: () => (
              <NavigationDrawerStructure
                navigationProps={this.props.navigation}
              />
            ),
            headerStyle: {
              backgroundColor: '#2089dc', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
          name="MyArticles"
          component={MyArticles}
        />
      </Stack.Navigator>
    );
  }
}

const NavigationDrawerStructure = (props) => {
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={() => toggleDrawer()}>
        {/*Donute Button Image */}
        <Image
          source={{
            uri:
              'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png',
          }}
          style={{width: 25, height: 25, marginLeft: 5}}
        />
      </TouchableOpacity>
    </View>
  );
};
