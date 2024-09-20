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
  Input,
} from 'react-native-elements';
import Network from './Network';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {Picker} from '@react-native-community/picker';

export default class Main extends React.Component {
  //   navigation = useNavigation();
  network = new Network();
  unsubscribe = this.props.navigation.addListener('focus', (e) => {
    // Prevent default action
    this.initAll();
  });
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      posts_all: [],
      logged: false,
      search: '',
      category: [{category_id: 0, category_name: 'All'}],
      selectedValue: '',
      users_id: undefined,
      admin: 0,
      modal: false,
      posts_deleted_description: '',
      posts_id_delete: '',
    };
  }

  initAll() {
    this.setState({
      posts: [],
      posts_all: [],
      category: [{category_id: 0, category_name: 'All'}],
    });
    this.getInfo();
    this.getPost();
    this.getCategory();
  }

  getInfo() {
    this.network.get('info').then(
      (res) => {
        this.setState({
          logged: true,
          users_id: res.data.users_id,
          admin: res.data.users_admin,
        });
      },
      (err) => {
        this.setState({
          logged: false,
          users_id: undefined,
          admin: 0,
        });
      },
    );
  }
  getPost() {
    this.network.get('post').then(
      (res) => {
        res.data.map((value) => {
          this.setState({
            posts: [...this.state.posts, value],
            posts_all: [...this.state.posts_all, value],
          });
        });
        // console.log('estados', this.state);
      },
      (err) => {
        // console.log(err);
      },
    );
  }
  getCategory() {
    this.network.get('category').then(
      (res) => {
        res.data.map((value) => {
          this.setState({
            category: [...this.state.category, value],
          });
        });
      },
      (err) => {
        // console.log(err);
      },
    );
  }

  updateSearch = (search) => {
    this.setState({search}, (e) => {
      let filtro = this.state.posts_all.filter(
        (posts) =>
          posts.posts_title.toLowerCase().indexOf(search.toLowerCase()) !== -1,
      );

      this.setState({posts: filtro});
    });
  };

  updateCategory(category) {
    if (category == 0) {
      this.setState({posts: this.state.posts_all});
    } else {
      let filtro = this.state.posts_all.filter(
        (posts) => posts.category_id == category,
      );
      this.setState({posts: filtro});
    }
  }

  componentDidMount() {
    // this.initAll();
  }

  handleInput(value, target) {
    this.setState({
      [target]: value,
    });
  }

  render() {
    const {search} = this.state;
    let categoryItems = this.state.category.map((category, i) => {
      return (
        <Picker.Item
          key={i}
          value={category.category_id}
          label={category.category_name}
        />
      );
    });
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={{flexDirection: 'row'}}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modal}
              onRequestClose={() => {
                this.setState({modal: false});
              }}>
              <View style={stylesModal.centeredView}>
                <View style={stylesModal.modalView}>
                  <Text style={stylesModal.modalText}>
                    Why do you want delete this post?
                  </Text>
                  <Input
                    name="posts_deleted_description"
                    onChangeText={(value) => {
                      this.handleInput(value, 'posts_deleted_description');
                    }}
                    placeholder="Reason"
                    multiline={true}
                    maxLength={199}
                  />
                  <View style={{flexDirection: 'row'}}>
                    <TouchableHighlight
                      style={{
                        padding: 5,
                      }}>
                      <Button
                        color={'red'}
                        title="Delete"
                        onPress={() => {
                          const body = {
                            posts_id: this.state.posts_id_delete,
                            posts_deleted_description: this.state
                              .posts_deleted_description,
                          };

                          this.network.put('post', body).then(
                            (res) => {
                              this.setState({
                                modal: false,
                              });
                              alert(res.message);
                              this.initAll();
                            },
                            (err) => {
                              alert(err.message);
                            },
                          );
                        }}></Button>
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={{
                        padding: 5,
                      }}>
                      <Button
                        title="Close"
                        onPress={() => {
                          this.setState({
                            modal: false,
                          });
                        }}></Button>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </Modal>
            <TouchableHighlight
              style={{
                padding: 5,
              }}>
              <Button
                color={'green'}
                title="POST YOUR ARTICLE"
                onPress={() => {
                  this.network.get('info').then(
                    (res) => {
                      this.props.navigation.push('Article');
                    },
                    (err) => {
                      this.props.navigation.navigate('Login');
                    },
                  );
                }}
              />
            </TouchableHighlight>

            <TouchableHighlight
              style={{
                padding: 5,
              }}>
              <Button
                color={'blue'}
                title="CART"
                onPress={() => {
                  this.network.get('info').then(
                    (res) => {
                      this.props.navigation.navigate('Cart');
                    },
                    (err) => {
                      this.props.navigation.navigate('Login');
                    },
                  );
                }}
              />
            </TouchableHighlight>

            <TouchableHighlight
              style={{
                padding: 5,
              }}>
              <Button
                color={'gray'}
                title="MY ARTICLES"
                onPress={() => {
                  this.network.get('info').then(
                    (res) => {
                      this.props.navigation.navigate('MyArticles');
                    },
                    (err) => {
                      this.props.navigation.navigate('Login');
                    },
                  );
                }}
              />
            </TouchableHighlight>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableHighlight
              style={{
                padding: 5,
              }}>
              {this.state.admin == 1 ? (
                <Button
                  color={'orange'}
                  title="PAYMENTS"
                  onPress={() => {
                    this.network.get('info').then(
                      (res) => {
                        // alert(res.message);
                        this.props.navigation.navigate('Payment');
                      },
                      (err) => {
                        // alert(err.message);
                        this.props.navigation.navigate('Login');
                      },
                    );
                  }}
                />
              ) : (
                <Button
                  color={'black'}
                  title="PAYMENTS"
                  onPress={() => {
                    this.network.get('info').then(
                      (res) => {
                        this.props.navigation.navigate('Payment');
                      },
                      (err) => {
                        this.props.navigation.navigate('Login');
                      },
                    );
                  }}
                />
              )}
            </TouchableHighlight>
            <TouchableHighlight
              style={{
                padding: 5,
              }}>
              {this.state.logged ? (
                <Button
                  color={'red'}
                  title="LOGOUT"
                  onPress={() => {
                    this.network.get('logout').then(
                      (res) => {
                        alert(res.message);
                        this.props.navigation.navigate('Login');
                      },
                      (err) => {
                        alert(err.message);
                        this.props.navigation.navigate('Login');
                      },
                    );
                  }}
                />
              ) : null}
            </TouchableHighlight>
          </View>
          <View title="POSTS">
            <View style={{flexDirection: 'column'}}>
              <SearchBar
                lightTheme={true}
                placeholder="Search article title here..."
                onChangeText={this.updateSearch}
                value={search}
              />
              <Picker
                selectedValue={this.state.selectedValue}
                onValueChange={(value) => {
                  this.setState({selectedValue: value}, () => {
                    this.updateCategory(value);
                  });
                }}>
                {categoryItems}
              </Picker>
            </View>
            {this.state.posts.map((posts, i) => {
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
                  {this.state.users_id !== posts.users_id && (
                    <TouchableHighlight
                      style={{
                        padding: 5,
                      }}>
                      <Button
                        icon={<Icon name="code" color="#ffffff" />}
                        buttonStyle={{
                          borderRadius: 0,
                          marginLeft: 0,
                          marginRight: 0,
                          marginBottom: 0,
                        }}
                        title="ADD TO CART"
                        onPress={() => {
                          const body = {
                            posts_id: posts.posts_id,
                          };
                          if (this.state.users_id) {
                            this.network.post('cart', body).then(
                              (res) => {
                                alert(res.message);
                              },
                              (err) => {
                                alert(err.message);
                              },
                            );
                          } else {
                            this.props.navigation.navigate('Login');
                          }
                        }}
                      />
                    </TouchableHighlight>
                  )}
                  {this.state.admin ? (
                    <TouchableHighlight
                      style={{
                        padding: 5,
                      }}>
                      <Button
                        icon={<Icon name="code" />}
                        buttonStyle={{
                          borderRadius: 0,
                          marginLeft: 0,
                          marginRight: 0,
                          marginBottom: 0,
                        }}
                        color={'red'}
                        title="DELETE POST!"
                        onPress={() => {
                          this.setState({
                            modal: true,
                            posts_id_delete: posts.posts_id,
                          });
                        }}
                      />
                    </TouchableHighlight>
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

const stylesModal = StyleSheet.create({
  centeredView: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
