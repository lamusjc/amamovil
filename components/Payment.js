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

export default class Payment extends React.Component {
  //   navigation = useNavigation();
  network = new Network();
  unsubscribe = this.props.navigation.addListener('focus', (e) => {
    // Prevent default action
    this.initAll();
  });
  constructor(props) {
    super(props);

    this.state = {
      payment: [],
      admin: false,
    };
  }

  initAll() {
    this.setState({
      payment: [],
    });
    this.getInfo();
  }

  componentDidMount() {
    // this.initAll();
  }
  getInfo() {
    this.network.get('info').then(
      (res) => {
        this.setState({
          admin: res.data.users_admin,
        });
        this.getPayment();
      },
      (err) => {
        this.props.navigate.navigation('Login');
      },
    );
  }

  getPayment() {
    this.network.get('payment').then(
      (res) => {
        res.data.map((value) => {
          this.setState({
            payment: [...this.state.payment, value],
          });
        });

        // console.log('estados', this.state);
      },
      (err) => {
        // console.log(err);
      },
    );
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={{flexDirection: 'row'}}>
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

          <View title="PAYMENT">
            {this.state.payment.map((payment, i) => {
              return (
                <View key={i} style={styles.container}>
                  <Text style={{marginBottom: 10}} h4>
                    PAYMENT #{payment.payment_id}
                  </Text>
                  <Text style={{marginBottom: 10}} h5>
                    STATUS:
                    {payment.payment_status == 'Pending' && (
                      <Text style={{color: 'blue'}}>
                        {payment.payment_status}
                      </Text>
                    )}
                    {payment.payment_status == 'Complete' && (
                      <Text style={{color: 'green'}}>
                        {payment.payment_status}
                      </Text>
                    )}
                  </Text>
                  {this.state.admin && payment.payment_status == 'Pending' ? (
                    <Button
                      icon={<Icon name="code" color="green" />}
                      buttonStyle={{
                        borderRadius: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        marginBottom: 0,
                      }}
                      title="COMPLETE STATUS"
                      onPress={() => {
                        const body = {
                          payment_id: payment.payment_id,
                        };

                        this.network.put('payment', body).then(
                          (res) => {
                            alert(res.message);
                            this.initAll();
                          },
                          (err) => {
                            alert(err.message);
                          },
                        );
                      }}
                    />
                  ) : null}
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
