import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text } from 'react-native';
import { CheckBox } from 'react-native-elements'
import axios from 'axios';
import FormButton from '../components/FormButton';
import { SearchBar } from 'react-native-elements';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import AsyncStorage from '@react-native-async-storage/async-storage';



const EditHobbiesScreen = (props) => {

  const [hobbies, setHobbies] = useState([]);
  const [initialHobbies, setInitialHobbies] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [searchWord, setSearchWord] = useState();


  const hobbiesFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/hobbies`

  useEffect(() => {
    fetchHobbies();
    clearAsHobbies("hobbies")



  }, []);

  const fetchHobbies = async () => {
    const result = await axios(
      hobbiesFetchURL
    );
    setHobbies(result.data);
    setInitialHobbies(result.data);

  };
  const storeDataToAs = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('hobbies', jsonValue)
    } catch (e) {
      // saving error
      console.log(e)
    }
  }

  const clearAsHobbies = async (key) => {

    try {
      await AsyncStorage.removeItem(key);
      return true;
    }
    catch (exception) {
      return false;
    }
  }

  const hobbyCheck = (hobby) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter(function (el) { return el.id != hobby.id; }));
    }
    else {
      setSelectedHobbies([...selectedHobbies, hobby]);
    }

  }

  const hobbyCheckSelected = (hobby) => {
    return (selectedHobbies.includes(hobby));
  }

  const onChangeSearchText = (searchText) => {
    setSearchWord(searchText);
    setHobbies(initialHobbies.filter(function (el) { return el.name.includes(searchText); }));
    if (hobbies.length <= 0 || searchText.length <= 0) {
      setHobbies(initialHobbies);
    }
  }


  const saveHobbies = () => {
    storeDataToAs(selectedHobbies).then(
      props.navigation.navigate('EditProfile')
    );

  }
  let renderHobbies = hobbies.length > 0 ? <FlatList
    keyExtractor={(item, index) => item.id.toString()}
    data={hobbies}
    renderItem={({ item }) => (
      <CheckBox
        title={item.name}
        key={item.id}
        checked={hobbyCheckSelected(item)}
        onPress={() => hobbyCheck(item)}
      />
    )}



  /> : <View><Text></Text ></View >

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 0.9 }} >
        <SearchBar
          containerStyle={{ marginTop: windowHeight / 30 }}
          placeholder="Search Hobby..."
          onChangeText={(text) => onChangeSearchText(text)}
          value={searchWord}
        />
        {renderHobbies}

      </SafeAreaView>
      <View style={{ flex: 0.1, alignItems: 'center' }}>
        <FormButton
          buttonTitle="Save"
          onPress={() => saveHobbies()}
        />
      </View>

    </View>
  );
};

export default EditHobbiesScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    alignItems: 'center',
    padding: 15,

  },
  radioBtnContainer: {
    borderWidth: 2,
    borderColor: '#ccc',
    marginVertical: 15,
    width: '100%',
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
    margin: 40
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    //  fontFamily: 'Lato-Regular',
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  imageContainer: {
    padding: 20
  },

  button: {

  }


});