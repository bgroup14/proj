
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import PublishPostTextArea from '../components/PublishPostTextArea';
import ModalSelector from 'react-native-modal-selector'
import MyOverlay from '../components/MyOverlay';
import DatePicker from '../components/DatePicker';
import { Button } from 'react-native-elements';
import SetLocationScreen from './SetLocationScreen';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { Toast } from "native-base";
import * as Font from "expo-font";
import { Appbar, Button as Btn } from 'react-native-paper';

const PostPublishScreen = (props) => {
    const [participantAge, setParticipantAge] = useState(useSelector(state => state.user.participantAge));
    const [fontsLoaded, setFontsLoaded] = useState(false);




    useEffect(() => {


        const loadFonts = async () => {
            await Font.loadAsync({
                'Roboto': require('native-base/Fonts/Roboto.ttf'),
                'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),

            })
        }
        loadFonts();
        setFontsLoaded(true)
        setAgeRange();

    }, [participantAge])


    useFocusEffect(
        React.useCallback(() => {

        }, [])
    )



    let index = 0;
    const activityTypes = [
        { key: index++, section: true, label: 'Do You' },
        { key: index++, label: 'Need Help' },
        { key: index++, label: 'Give Help' },

    ];
    let indexFromWho = 0;
    const fromWho = [
        { key: indexFromWho++, section: true, label: 'Participant Gender' },
        { key: indexFromWho++, label: 'Man' },
        { key: indexFromWho++, label: 'Woman' },
        { key: indexFromWho++, label: "Dosen't Matter" },

    ];
    let indexFromAge = 0;
    const fromAge = [
        { key: indexFromAge++, section: true, label: 'Participant Age' },
        { key: indexFromAge++, label: '16-30' },
        { key: indexFromAge++, label: '30-50' },
        { key: indexFromAge++, label: '50+' },
        { key: indexFromAge++, label: "Dosen't Matter" },

    ];

    const [postContent, setPostContent] = useState();
    const [postCategory, setPostCategory] = useState();
    const [specificDate, setSpecificDate] = useState(true);
    const [haveDateFromPicker, setHaveDateFromPicker] = useState(false);
    const [dateLabel, setDateLabel] = useState();
    const [timeOFtheDay, setTimeOFtheDay] = useState(null);
    const [isLocationSet, setIsLocationSet] = useState(false);
    const [locationLabel, setLocationLabel] = useState(null);
    const [postLongitude, setPostLongitude] = useState(null);
    const [postLatitude, setPostLatitude] = useState(null);
    const [unixDate, setUnixDate] = useState(null);

    const [fromAgeRange, setFromAgeRange] = useState(null);
    const [toAge, setToAge] = useState(null);


    let userName = useSelector(state => state.user.userName);
    let userId = useSelector(state => state.user.userId);
    const [userType, setUserType] = useState(useSelector(state => state.user.userType));
    const [participantGender, setParticipantGender] = useState(useSelector(state => state.user.participantGender));

    const [initalUserTypeValue, setInitalUserTypeValue] = useState(userType)

    let userFirstName = userName.split(" ")[0];
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    userFirstName = capitalizeFirstLetter(userFirstName)

    const createGreeting = () => {
        const hours = new Date().getHours(); //To get the Current Hours)
        if (hours > 0 && hours <= 5) {
            return "Good night"
        }
        else if (hours > 5 && hours <= 12) {
            return "Good morning"

        }
        else if (hours > 12 && hours <= 18) {
            return "Good afternoon"

        }
        return "Good evening"


    }
    const setUserGiveOrGetHelp = () => {
        if (userType == 'Both') {
            return "How would you like to give / get help today?"

        }
        else if (userType == 'Give Help') {
            return "How would you like to give help today?"
        }

        return "How would you like to get help today?"

    }

    let userGiveOrGet = setUserGiveOrGetHelp();
    let greeting = createGreeting();
    let categories = [
        { label: 'Sport', value: 'Sport', icon: () => <Icon name="dribbble" size={22} color="#000000" /> },
        { label: 'Study', value: 'Study', icon: () => <Icon name="book" size={24} color="#000000" /> },
        { label: 'Mental', value: 'Mental', icon: () => <Icon name="phone" size={24} color="#000000" /> },
        { label: 'Elder People', value: 'Elder', icon: () => <MaterialIcons name="elderly" size={24} color="#000000" /> },
        { label: 'General', value: 'General', icon: () => <Icon name="hearto" size={24} color="#000000" /> },
    ]

    const resetPost = () => {
        setPostContent()
        setHaveDateFromPicker(false)
        setSpecificDate(true);

        setLocationLabel(null)
        setUnixDate(null)
        setTimeOFtheDay(null)


    }

    const [isVisible, setIsvisble] = useState(false);
    const [isVisibleLocation, setIsVisibleLocation] = useState(false);

    const receiveDateFromDatePicker = (dateObj) => {
        setIsvisble(false)
        setHaveDateFromPicker(true)
        setDateLabel(dateObj.dateLabel)
        setTimeOFtheDay(dateObj.timeOFtheDay)
        setUnixDate(dateObj.unixDate)
    }


    const setLocation = (locationObj) => {
        setLocationLabel(locationObj.locationLabel);
        if (locationObj.latitude != undefined) {
            setPostLatitude(locationObj.latitude);
            setPostLongitude(locationObj.longitude);
        }
        else {
            setPostLatitude(null);
            setPostLongitude(null);

        }


    }

    const setAgeRange = () => {
        switch (participantAge) {
            case "16-30":
                setFromAgeRange(16)
                setToAge(30)
                break;
            case "30-50":
                setFromAgeRange(30)
                setToAge(50)
                break;
            case "50+":
                setFromAgeRange(50)
                setToAge(99)
                break;
            case "Dosen't Matter":
                setFromAgeRange(16)
                setToAge(99)
                break;

            default:
                break;
        }

    }

    const checkIfFormFilled = (meetingLocaion) => {

        if (meetingLocaion == null) {

            return false;
        }
        return true;
    }



    const publishPost = async () => {



        let meetingLatitude = postLatitude == undefined ? null : postLatitude;
        let meetingLongitude = postLongitude == undefined ? null : postLongitude;

        let isZoom = locationLabel === 'Zoom Meeting' ? true : false
        let recurring = unixDate == null ? true : false


        let postDetails = {
            category: postCategory,
            text: postContent,
            helpType: userType,
            fromGender: participantGender,
            fromAge: fromAgeRange,
            toAge,
            latitude: meetingLatitude,
            longitude: meetingLongitude,
            isZoom,
            unixDate,
            recurring,
            member_id: userId,
            timeOfDay: timeOFtheDay,
            cityName: locationLabel,
            dateLabel
        }


        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        console.log()
        if (!checkIfFormFilled(postDetails.cityName) || postCategory == undefined || postContent == undefined) {

            Alert.alert(
                "",
                "Please fill the entire form",
                [
                    { text: "OK" }
                ],
            );
            return null
        }
        const body = JSON.stringify(postDetails)



        try {
            //if this will fail (status !=200 ) it will catch the error in the error block
            const res = await axios.post("https://proj.ruppin.ac.il/bgroup14/prod/api/post/publishpost", body, config);
            resetPost();

            // console.log(res);
            Toast.show({
                text: "Post published successfully!",
                // buttonText: "Okay",
                type: "success",
                duration: 4000
            });

            props.navigation.navigate('Home')
            updateCategoryStrength();


        } catch (err) {

            Alert.alert(
                "OOPS!",
                "Error occurred, try again.",
                [

                    { text: "OK" }
                ],
            );


        }

    }

    const updateCategoryStrength = async () => {

        try {
            const postInteractionUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/post/postIntercation/${userId}/${postCategory}`
            //if this will fail (status !=200 ) it will catch the error in the error block
            const res = await axios.patch(postInteractionUrl);



        } catch (err) {

            console.log(err)


        }


    }


    if (!fontsLoaded) {
        return (
            <View></View>
        );

    }
    return (
        <View style={styles.container}>
            <MyOverlay isVisible={isVisible} onBackdropPress={() => setIsvisble(false)}  >
                <DatePicker receiveDateFromDatePicker={(dateObj) => receiveDateFromDatePicker(dateObj)}
                    closeDatePicker={() => setIsvisble(false)} />
            </MyOverlay>
            <MyOverlay isVisible={isVisibleLocation} onBackdropPress={() => setIsVisibleLocation(false)}   >
                <SetLocationScreen closeSetLocation={() => setIsVisibleLocation(false)} setLocation={(locationObj) => setLocation(locationObj)} />
            </MyOverlay>


            <Appbar.Header style={{ backgroundColor: '#3b5998', marginHorizontal: windowWidth / 100 }} >
                <Appbar.Content title="Create Post" />

            </Appbar.Header>


            <View View style={styles.userGreetingContainer} ><Text style={styles.userGreetingText}>{greeting}, {userFirstName}</Text>
                <Text style={{ padding: windowWidth / 30, fontSize: 16 }}>{userGiveOrGet}</Text>


                <View style={styles.selectCategoryContainer}>
                    <DropDownPicker
                        placeholder="Select Category"
                        items={categories}
                        containerStyle={styles.dropDownContainer}
                        itemStyle={{

                            justifyContent: 'flex-start', marginTop: 1, borderBottomWidth: 0, borderColor: 'black', paddingBottom: 20
                        }}
                        onChangeItem={item => setPostCategory(item.value)}


                    />
                </View>

            </View >
            <View style={styles.txtAreaContainer} >
                <PublishPostTextArea
                    labelValue={postContent}
                    placeholderText="What's on your mind?"
                    iconType="calendar"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(text) => setPostContent(text)}

                />
            </View>

            <View style={styles.postOptionsContainer}>
                <View style={styles.optionContainer}>
                    <Text style={{ marginTop: windowHeight / 90, fontSize: 16 }} >Do You</Text>


                    <ModalSelector
                        data={activityTypes}
                        cancelTextStyle={{ textTransform: 'capitalize' }}
                        animationType='fade'
                        supportedOrientations={['landscape']}
                        accessible={true}
                        scrollViewAccessibilityLabel={'Scrollable options'}
                        cancelButtonAccessibilityLabel={'Cancel Button'}
                        onChange={(option) => { setUserType(option.label == "Need Help" ? "Need Help" : "Give Help") }} >

                        <TextInput
                            textAlign="center"
                            style={styles.postBtnText}
                            editable={false}
                            value={userType == "Both" ? "Select" : userType} />

                    </ModalSelector>
                </View>

                {/* <Divider /> */}


                <View style={styles.optionContainer}>
                    <Text style={{ marginTop: windowHeight / 90, fontSize: 16 }} >Participant Gender</Text>

                    <ModalSelector
                        data={fromWho}
                        cancelTextStyle={{ textTransform: 'capitalize' }}
                        animationType='fade'
                        initValue={participantGender}
                        supportedOrientations={['landscape']}
                        accessible={true}
                        scrollViewAccessibilityLabel={'Scrollable options'}
                        cancelButtonAccessibilityLabel={'Cancel Button'}
                        onChange={(option) => { setParticipantGender(option.label) }}>

                        <TextInput
                            textAlign="center"
                            style={styles.postBtnText}
                            editable={false}
                            value={participantGender} />
                    </ModalSelector>

                </View>

                <View style={styles.optionContainer}>
                    <Text style={{ marginTop: windowHeight / 90, fontSize: 16 }} >Participant Age</Text>

                    <ModalSelector
                        data={fromAge}
                        cancelTextStyle={{ textTransform: 'capitalize' }}
                        animationType='fade'
                        initValue={participantAge}
                        supportedOrientations={['landscape']}
                        accessible={true}
                        scrollViewAccessibilityLabel={'Scrollable options'}
                        cancelButtonAccessibilityLabel={'Cancel Button'}
                        onChange={(option) => { setParticipantAge(option.label) }}>

                        <TextInput
                            textAlign="center"
                            style={styles.postBtnText}
                            editable={false}
                            value={participantAge} />

                    </ModalSelector>


                </View>


                <View style={styles.optionContainer}>
                    <Text style={{ marginTop: windowHeight / 90, fontSize: 16 }} >Meeting Location</Text>
                    {locationLabel == null ? <TouchableOpacity onPress={() => setIsVisibleLocation(true)} >
                        <TextInput
                            textAlign="center"
                            style={styles.postBtnText}
                            editable={false}
                            value='Select' />
                    </TouchableOpacity> :
                        <TouchableOpacity onPress={() => setIsVisibleLocation(true)}>
                            <TextInput
                                textAlign="center"
                                style={styles.postBtnText}
                                editable={false}
                                value={locationLabel} />

                        </TouchableOpacity>}







                </View>
                {/* <Divider /> */}



                {!haveDateFromPicker ? <View style={styles.optionContainer}>

                    <Text style={{ marginTop: 10, fontSize: 16 }} >Specific Date?</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ marginHorizontal: windowWidth / 9 }}>
                            <Button title="NO" type={specificDate ? 'clear' : 'solid'} onPress={() => setSpecificDate(false)} buttonStyle={!specificDate ? { backgroundColor: "red", borderRadius: 2 } : { fontSize: 10, borderRadius: 2 }} />

                        </View>

                        <Button title="YES" type='clear' onPress={() => setIsvisble(true)} buttonStyle={{ borderRadius: 2 }} />
                    </View>


                </View> :



                    <View style={styles.optionContainer} >

                        <Text style={{ marginTop: 10, fontSize: 16 }} >Meeting Date</Text>
                        <TouchableOpacity onPress={() => setIsvisble(true)}>
                            <View style={{ marginHorizontal: windowWidth / 10 }} >
                                <View >
                                    <Text style={{ marginBottom: 3 }}>{dateLabel}
                                    </Text>
                                </View>
                                <Text>{timeOFtheDay}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }






            </View>

            <View style={{ alignItems: 'center', marginTop: windowWidth / 12 }}>

                <Button containerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                    buttonStyle={{ backgroundColor: '#3b5998', width: windowWidth / 2 }}
                    title='Post' onPress={() => publishPost()} />

            </View>
        </View >


    )

}

export default PostPublishScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: Math.round(windowHeight)
    },
    barContainer: {

        marginTop: windowHeight / 100,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 30,
        height: windowHeight / 10,
    },
    barText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
    },
    barReset: {
        color: '#fff',
        marginTop: windowHeight / 40,
    },
    bellIcon: {
        color: '#ffffff',
        fontSize: 24
    },
    userGreetingContainer: {
        alignItems: 'center',
        marginTop: windowHeight / 50
        //  height: windowHeight / 6,

    },
    userGreetingText: {
        fontSize: 18,
    },
    dropDownContainer: {

        width: '98%',
        height: windowHeight / 15,

    },
    txtAreaContainer:
    {
        alignItems: 'center',
        // height: windowHeight / 5,
        marginTop: windowHeight / 100
    },

    postOptionsContainer: {
        // height: windowHeight / 2.4,
        marginTop: windowHeight / 100,
        marginLeft: windowWidth / 150
    },
    optionContainer: {
        height: windowHeight / 13,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: windowWidth / 28,
        alignItems: 'center',
    },
    btnContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: windowHeight / 50

    },
    postBtnText: {

        borderWidth: 1,
        marginTop: windowHeight / 60,
        borderWidth: 1,
        borderColor: '#ccc',
        height: windowHeight / 25,
        color: '#000000',
        fontSize: 16,
        width: windowWidth / 3.1,
        borderRadius: 2
    },
    selectCategoryContainer:
    {
        width: '95%',
        marginLeft: windowWidth / 50,
        borderRadius: 50
    }



})