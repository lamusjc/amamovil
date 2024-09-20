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

export default class MyArticles extends React.Component {
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
      search: '',
      category: [{category_id: 0, category_name: 'All'}],
      selectedValue: '',
    };
  }

  initAll() {
    this.setState({
      posts: [],
      posts_all: [],
      category: [{category_id: 0, category_name: 'All'}]
    });
    this.getInfo();
  }

  componentDidMount() {
    // this.initAll();
  }
  getInfo() {
    this.network.get('info').then(
      (res) => {
        this.getPosts();
        this.getCategory();
      },
      (err) => {
        this.props.navigate.navigation('Login');
      },
    );
  }

  getPosts() {
    this.network.get('post_user').then(
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
                  {posts.posts_deleted ? (
                    <View>
                      <Text style={{color: 'red'}}>This post was deleted!</Text>
                      <Text style={{color: 'red'}}>
                        Reason: {posts.posts_deleted_description}
                      </Text>
                    </View>
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
