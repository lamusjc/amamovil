import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Button,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  ImageEditor,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Header,
  Card,
  Text,
  Image,
  Icon,
  SearchBar,
} from 'react-native-elements';
import Network from './Network';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {Picker} from '@react-native-community/picker';
import {WebView} from 'react-native-webview';

export default class Cart extends React.Component {
  //   navigation = useNavigation();
  network = new Network();
  unsubscribe = this.props.navigation.addListener('focus', (e) => {
    // Prevent default action
    this.initAll();
  });
  constructor(props) {
    super(props);

    this.state = {
      cart: [],
      showModal: false,
      status: 'Pending',
      total: 0,
    };
  }

  initAll() {
    this.setState({
      cart: [],
      showModal: false,
      status: 'Pending',
      total: 0,
    });
    this.getInfo();
  }

  componentDidMount() {
    // this.initAll();
  }
  getInfo() {
    this.network.get('info').then(
      (res) => {
        this.getCart();
      },
      (err) => {
        this.props.navigate.navigation('Login');
      },
    );
  }

  getCart() {
    this.network.get('cart').then(
      (res) => {
        res.data.map((value) => {
          this.setState({
            cart: [...this.state.cart, value],
            total: this.state.total + value.posts_price * value.posts_quantity,
          });
        });

        // console.log('estados', this.state);
      },
      (err) => {
        // console.log(err);
      },
    );
  }

  addPayment() {
    this.network.post('payment', this.state).then(
      (res) => {
        this.initAll();
        alert('Payment made successfully! Pending with the administrator');
      },
      (err) => {
        alert('Error processing the purchase');
      },
    );
  }

  handleResponse(data) {
    if (data.title === 'success') {
      this.setState({
        showModal: false,
        status: 'Complete',
      });
      this.addPayment();
    } else if (data.title === 'cancel') {
      this.setState({
        showModal: false,
        status: 'Cancelled',
      });
      alert('Error processing the purchase');
    } else {
      return;
    }
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={{flexDirection: 'row'}}>
            <Modal
              visible={this.state.showModal}
              onRequestClose={() => {
                this.setState({showModal: false});
              }}>
              <WebView
                source={{uri: this.network.getUrl() + 'pay'}}
                onNavigationStateChange={(data) => this.handleResponse(data)}
                injectedJavaScript={`document.getElementById('price').value="${this.state.total}";document.f1.submit()`}
                onHttpError={(syntheticEvent) => {
                  const {nativeEvent} = syntheticEvent;
                  console.warn(
                    'WebView received error status code: ',
                    nativeEvent.statusCode,
                  );
                }}
              />
            </Modal>

            <TouchableHighlight
              style={{
                padding: 5,
              }}>
              <Button
                disabled={this.state.cart.length == 0}
                color={'blue'}
                title="PROCESS PURCHASE"
                onPress={() => {
                  this.setState({
                    showModal: true,
                  });
                }}
              />
            </TouchableHighlight>

            <TouchableHighlight
              style={{
                padding: 5,
              }}>
              <Button
                color={'red'}
                title="BACK TO MAIN"
                onPress={() => {
                  this.props.navigation.navigate('Main');
                }}
              />
            </TouchableHighlight>
          </View>
          <Text>Payment Status: {this.state.status}</Text>
          <View title="CART">
            {this.state.cart.map((posts, i) => {
              return (
                <View key={i} style={styles.container}>
                  <Text style={{marginBottom: 10}} h4>
                    {posts.posts_title}
                  </Text>
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      borderWidth: 1,
                      borderColor: 'black',
                    }}
                    source={
                      posts.posts_image
                        ? {uri: this.network.getUrl() + posts.posts_image}
                        : {
                            uri:
                              'http://spootmedia.com/wp-content/uploads/2018/06/443809727.jpg',
                          }
                    }
                  />
                  <Text style={{marginBottom: 10}} h5>
                    {posts.posts_description}
                  </Text>
                  <Text style={{marginBottom: 10}} h5>
                    Price: {posts.posts_price}
                  </Text>
                  <Text style={{marginBottom: 10}} h5>
                    Quantity: {posts.posts_quantity}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0f0',
    borderColor: 'white',
    borderWidth: 20,
  },
});
