import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { windowHeight } from '../../utils/Dimentions';
import MyLinearGradient from '../components/MyLinearGradient';
import { KeyboardAvoidingView } from 'react-native';

const SignupScreenTest = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [fullName, setFullName] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const emailChangeHandler = (text) => {
    setEmail(text);
  }
  const passwordChangeHanlder = (text) => {
    setPassword(text);
  }
  const confirmPasswordChangeHanlder = (text) => {
    setConfirmPassword(text);
  }
  const fullNameChangeHanlder = (text) => {
    setFullName(text);
  }
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('signUpDetails', jsonValue)
    } catch (e) {
      // saving error
      console.log(e)
    }
  }

  const signUn = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert(
        "Missing info!",
        "Please fill all fields and try again.",
        [
          { text: "OK" }
        ],
      );
      return null;
    }
    else if (fullName.length <= 0 || email.length <= 0 || password.length <= 0 || confirmPassword.length <= 0) {
      Alert.alert(
        "Missing info!",
        "Please fill all fields and try again.",
        [
          { text: "OK" }
        ],
      );
      return null;
    }
    if (!validatePassword(password, confirmPassword) || !validateEmail(email)) {
      return null;
    }

    const url = "https://proj.ruppin.ac.il/bgroup14/prod/api/member/checkifmemberexists";

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const body = JSON.stringify({ email })
    try {

      //check if member exists on DB
      const res = await axios.post(url, body, config);
      Alert.alert(
        "OOPS!",
        "An account with this email already exists",
        [
          { text: "OK" }
        ],
      );
      console.log(res.status)




    } catch (err) {
      //if status code ==400 it means email is not in DB
      if (err.response.status == 400) {
        let signUpDetails = {
          email,
          password,
          fullName
        }
        storeData(signUpDetails).then(
          props.navigation.navigate('ProfileSetup')
        );

      }
      else if (err.response.status == 500) {
        Alert.alert(
          "OOPS!",
          "General error, try again.",
          [
            { text: "OK" }
          ],
        );
        console.log("error is:")
        console.log(err.response)
      }
    }

  }
  const validateEmail = (email) => {

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let validation = re.test(String(email).toLowerCase());
    if (validation) {
      return true;
    }
    Alert.alert(
      "OOPS!",
      "Email is not in the correct format.",
      [
        { text: "OK" }
      ],
    );
    return false;

  }
  const validatePassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      Alert.alert(
        "OOPS!",
        "Password dosen't match, try again",
        [
          { text: "OK" }
        ],
      );
      return false;

    }
    else if (password.length < 6) {
      Alert.alert(
        "OOPS!",
        "Password must contian at leats 6 characters",
        [
          { text: "OK" }
        ],
      );
      return false;
    }
    return true;

  }




  return (
    <KeyboardAvoidingView  >
      <MyLinearGradient firstColor="#ffffff" secondColor="#fff" height={1000} />

      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/logo.jpg')}
            style={styles.logo}
          />
        </View>

        <View >

          <FormInput
            onChangeText={(text) => fullNameChangeHanlder(text)}
            placeholderText="Full Name"
            iconType="user"
            autoCapitalize="words"
            autoCorrect={false}
            req
          />

          <FormInput
            labelValue={email}
            onChangeText={(text) => emailChangeHandler(text)}
            placeholderText="Email"
            iconType="envelope"
            keyboardType="email-address"
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />

          <FormInput
            labelValue={password}
            onChangeText={(text) => passwordChangeHanlder(text)}
            placeholderText="Password"
            iconType="lock"
            secureTextEntry={true}
          />

          <FormInput
            onChangeText={(text) => confirmPasswordChangeHanlder(text)}
            placeholderText="Confirm Password"
            iconType="lock"
            secureTextEntry={true}
          // autoFocus={true}
          />
        </View>
        <View style={styles.signUpBtnContainer}>

          <FormButton
            buttonTitle="Next"
            onPress={() => signUn()}
          />

          <TouchableOpacity
            style={{ marginTop: windowHeight / 35 }}
            onPress={() => props.navigation.navigate('SignIn')}>
            <Text style={styles.navButtonText}>
              Have an account? Sign In
        </Text>

          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignupScreenTest;

const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    //fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: windowHeight / 100,
    // marginBottom: windowHeight / 80.76363,
    color: '#051d5f',
    margin: windowHeight / 15
  },

  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2e64e5',
    //fontFamily: 'Lato-Regular',
  },
  logo: {
    height: windowHeight / 3.2,
    width: windowHeight / 1.8,
  },
  imageContainer: {
    margin: windowHeight / 40.381815
  },
  signUpBtnContainer: {
    marginTop: windowHeight / 6,
    alignItems: 'center',
    width: '100%'
  }

});