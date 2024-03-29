import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwsome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Post from '../components/Post';
import { useFocusEffect } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import MyOverlay from '../components/MyOverlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import registerForPushNotificationsAsync from '../../registerForPushNotificationsAsync';
import * as Notifications from 'expo-notifications'
import { NEW_MESSAGE, RECEIVED_USER_COORDINATES, NEW_NOTIFICATION } from '../../store/actions/types';
import AppLoading from 'expo-app-loading';
import Spinner from 'react-native-loading-spinner-overlay';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { KeyboardAvoidingView } from 'react-native';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import axios from 'axios';
import { TouchableOpacity } from 'react-native';
import FeedFilterScreen from './FeedFilterScreen';
import CommentsScreens from './CommentsScreens';
import * as Location from 'expo-location';
import * as Font from "expo-font";
import { Appbar, Badge } from 'react-native-paper';
import {
    useFonts,
    Ubuntu_300Light,
    Ubuntu_300Light_Italic,
    Ubuntu_400Regular,
    Ubuntu_400Regular_Italic,
    Ubuntu_500Medium,
    Ubuntu_500Medium_Italic,
    Ubuntu_700Bold,
    Ubuntu_700Bold_Italic,
} from '@expo-google-fonts/ubuntu';
import { Fragment } from 'react';







const HomeScreen = (props) => {
    let [fontsLoaded] = useFonts({
        Ubuntu_300Light,
        Ubuntu_300Light_Italic,
        Ubuntu_400Regular,
        Ubuntu_400Regular_Italic,
        Ubuntu_500Medium,
        Ubuntu_500Medium_Italic,
        Ubuntu_700Bold,
        Ubuntu_700Bold_Italic,
    });
    const dispatch = useDispatch();
    const [posts, setPosts] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const userId = useSelector(state => state.auth.userId);
    const userLong = useSelector(state => state.user.userLong);
    // let userLong = null;
    let userLat = useSelector(state => state.user.userLat);
    const postsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/post/getFilteredPosts/${userId}`
    const [isFilterVisible, setIsFilterVisble] = useState(false);
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);
    const [commentsToShow, setCommentsToShow] = useState([]);
    const [newComment, setNewComment] = useState(false);
    const [categoryNameToSend, setCategoryameToSend] = useState(null);
    const [postsFilteredObj, setPostsFilteredObj] = useState(null);
    const [restartComponent, setRestartComponent] = useState(1);
    const [categoriesToShow, setCategoriesToShow] = useState([]);
    const [pushNotificationToken, setPushNotificationToken] = useState(null);
    const [myLong, setMyLong] = useState(null);
    const [myLat, setMyLat] = useState(null);
    const [filterActivated, setFilterACtivated] = useState(false);
    let newNotificationFromRedux = useSelector(state => state.notification.newNotification);
    const [fontsLoad, setFontsLoad] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const [notification, setNotification] = useState(false);

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });


    const receivedNewMessage = async () => {
        dispatch({
            type: NEW_MESSAGE,
            payload: null
        });
    }


    const newNotification = async () => {
        dispatch({
            type: NEW_NOTIFICATION,
            payload: null
        });
    }


    useEffect(() => {

        console.log("notifications")

        //when user in app will preform this
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log("open!!!!!!")

            setNotification(notification);
            let notificationBody = JSON.parse(notification.request.trigger.remoteMessage.data.body)
            switch (notificationBody.functionToRun) {
                case "receivedNewMessage":
                case "receivedNewMeetingInvitation":
                    receivedNewMessage()
                    break;
                case "meetingApproved":
                case "meetingRejected":
                case "receivedNewComment":
                case "meetingCheck":
                case "receivedNewReview":
                    newNotification();
                    //FUNCTION THAT WILL MAKE THE BELL RED
                    break;

                default:
                    break;
            }


        });

        //When user not in the app will preform this
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("close!!!!!!")
            let notificationBody = JSON.parse(response.notification.request.trigger.remoteMessage.data.body)
            switch (notificationBody.functionToRun) {
                case "receivedNewMessage":
                case "receivedNewMeetingInvitation":
                    props.navigation.navigate('ChatWithOtherUser', {
                        chatRoomId: notificationBody.chatRoomId,
                        otherMemberName: notificationBody.otherMemberName,
                        otherMemberImage: notificationBody.otherMemberImage,
                        otherMemberId: notificationBody.otherMemberId
                    })
                    break;
                case "meetingApproved":
                case "receivedNewComment":
                case "meetingRejected":
                case "meetingCheck":
                case "receivedNewReview":

                    props.navigation.navigate("Notifications")
                    break;

                default:
                    break;
            }




        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, []);




    useEffect(() => {

        const loadFonts = async () => {
            await Font.loadAsync({
                'Roboto': require('native-base/Fonts/Roboto.ttf'),
                'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),

            })
            setFontsLoad(true)

        }
        loadFonts();

        if (pushNotificationToken == null) {
            console.log("push not is null")
            checkPushNotifications();
        } else {
            console.log("push not is not null")
            console.log(pushNotificationToken)
        }

        if (commentsToShow.length > 0) {
            setIsCommentsVisible(true)
        }


    }, [commentsToShow])




    useEffect(() => {
        if (pushNotificationToken != null) {
            //SEND NOTIFICATION TO SERVER

            sendPushTokenToServer();

        }

    }, [pushNotificationToken])




    const sendPushTokenToServer = async () => {
        console.log("sending notification id to server....");
        const fetchNotificationIdURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/setnotificationid/${userId}/${pushNotificationToken}`
        try {
            const res = await axios.post(fetchNotificationIdURL);
        } catch (error) {
            console.log(error)
        }


    }





    useFocusEffect(
        React.useCallback(() => {
            setCategoryameToSend(null)
            getUserCurrentLocationAndFecthPosts();
            setRestartComponent(Date.now)
            let categories = [
                { label: 'Sport', value: 'Sport', icon: () => <Icon name="dribbble" size={22} color="#000000" /> },
                { label: 'Study', value: 'Study', icon: () => <Icon name="book" size={24} color="#000000" /> },
                { label: 'Mental', value: 'Mental', icon: () => <Icon name="phone" size={24} color="#000000" /> },
                { label: 'Elder People', value: 'Elder', icon: () => <MaterialIcons name="elderly" size={24} color="#000000" /> },
                { label: 'General', value: 'General', icon: () => <Icon name="hearto" size={24} color="#000000" /> },
            ]
            setCategoriesToShow(categories)
            setPostsFilteredObj(null)

            setNewComment(false)

        }, [newComment])
    )


    const checkPushNotifications = async () => {

        try {
            var today = new Date().toDateString();
            const lastTimeTokenTaken = await AsyncStorage.getItem('lastTimeTokenTaken')

            if (lastTimeTokenTaken == null || lastTimeTokenTaken != today) {
                //GET TOKEN FROM EXPO
                console.log("getting user notificatin id")
                registerForPushNotificationsAsync()
                    .then((token) => {
                        console.log("the token is....");
                        console.log(token);
                        setPushNotificationToken(token.data)
                    });

                await AsyncStorage.setItem('lastTimeTokenTaken', today)
            }

        }
        catch (error) {
            console.log(error)
        }

    }







    const fetchPosts = async (obj) => {
        const body = JSON.stringify(obj)
        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const res = await axios.post(postsFetchURL, body, config);
            setPosts(res.data)

        } catch (err) {
            console.log(err)
        }


    }


    const fetchFilteredPosts = async (filteredPostObj) => {

        let obj = {
            filterActivated: true,
            meetingLocationLong: myLong,
            meetingLocationLat: myLat,
            categoryName: categoryNameToSend,
            ...filteredPostObj
        }
        fetchPosts(obj)


        // //In case we go to anoher screen so useFocus will be activated and will dend this obj to the server 
        setPostsFilteredObj(filteredPostObj);
        setIsFilterVisble(false)


    };

    const filterByCategory = (categoryName) => {
        let category = {
            categoryName
        }
        var obj;
        //NOW WE CHECK IF POSTS WERE ALREADY FILTERED
        if (postsFilteredObj != null) {
            obj = {
                ...postsFilteredObj,
                categoryName,
                filterActivated: true,
                meetingLocationLong: myLong,
                meetingLocationLat: myLat

            }
            fetchPosts(obj)

        } else {
            obj = {
                categoryName,
                filterActivated: false,
                meetingLocationLong: myLong,
                meetingLocationLat: myLat
            }
        }

        setCategoryameToSend(categoryName);
        fetchPosts(obj)

        return null;
    }






    let userName = useSelector(state => state.user.userName);



    if (userName === null || userName === undefined) {
        userName = 'Alan skverer'
    }
    let userFirstName = userName.split(" ")[0];
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    userFirstName = capitalizeFirstLetter(userFirstName)

    const showComments = (comments) => {
        setCommentsToShow(comments)

    }
    const toggleCommentsScreen = () => {
        setIsCommentsVisible(false)
        setCommentsToShow([])

    }




    const goToOtherUserProfile = (member_id) => {

        toggleCommentsScreen();
        // alert(member_id)
        if (userId == member_id) {
            props.navigation.navigate('MyProfile')
        }
        else {
            props.navigation.navigate('OtherUserProfileScreen', {
                userId: member_id
            })
        }
    }

    const goToChatWithUser = async (currentMemberId, member_id) => {

        const getChatRoomIdUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/chat/getChatRoomId/${currentMemberId}/${member_id}`


        try {

            const res = await axios(getChatRoomIdUrl);
            const { chatRoomId, otherMemberName, otherMemberId, otherMemberImage } = res.data

            props.navigation.navigate('ChatWithOtherUser', {
                chatRoomId: chatRoomId,
                otherMemberName: otherMemberName,
                otherMemberImage: otherMemberImage,
                otherMemberId: member_id

            })

        } catch (error) {
            console.log(error)

        }

    }

    const getUserCurrentLocationAndFecthPosts = async () => {

        var obj;
        if (userLong == null) {


            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {

                return;
            }

            let location = await Location.getCurrentPositionAsync({});


            let regionName = await Location.reverseGeocodeAsync({ longitude: location.coords.longitude, latitude: location.coords.latitude });
            obj = {
                filterActivated: false,
                meetingLocationLong: location.coords.longitude,
                meetingLocationLat: location.coords.latitude
            }
            setCurrentLocationDB(location.coords.latitude, location.coords.longitude,)
            fetchPosts(obj)
            setMyLat(location.coords.latitude);
            setMyLong(location.coords.longitude);
            dispatch({
                type: RECEIVED_USER_COORDINATES,
                payload: {
                    userLong: location.coords.longitude,
                    userLat: location.coords.latitude
                }
            });
            setTimeout(() => {
                setIsReady(true)
                setSpinner(false)
            }, 800);



        }
        else {

            obj = {
                filterActivated: false,
                meetingLocationLong: userLong,
                meetingLocationLat: userLat
            }
            fetchPosts(obj)
            setTimeout(() => {
                setIsReady(true)
                setSpinner(false)
            }, 800);

        }








    }

    const setCurrentLocationDB = async (lat, long) => {

        try {
            const setCurrentLocationDBUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/addcurrentlocation/${userId}/${lat}/${long}/`

            const res = await axios.post(setCurrentLocationDBUrl);

        } catch (error) {
            console.log(error)
        }


    }

    if (!isReady) {
        return (
            <View>

                <AppLoading
                    startAsync={getUserCurrentLocationAndFecthPosts}
                    onFinish={() => console.log("finished app loading")}
                    onError={console.warn}
                />
                <Spinner
                    visible={spinner}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
            </View>
        );
    }


    if (!fontsLoad) {
        return (
            <View></View>
        );

    }

    return (
        <KeyboardAvoidingView style={styles.container}  >


            <MyOverlay isVisible={isFilterVisible} onBackdropPress={() => setIsFilterVisble(false)}  >
                <FeedFilterScreen closeFilter={() => setIsFilterVisble(false)} sendFilteredObj={(filteredPostObj => fetchFilteredPosts(filteredPostObj))} />
            </MyOverlay>
            <MyOverlay isVisible={isCommentsVisible} onBackdropPress={() => toggleCommentsScreen()}   >
                <CommentsScreens comments={commentsToShow} goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)} />
            </MyOverlay>



            <Appbar.Header style={{ backgroundColor: '#3b5998', marginHorizontal: windowWidth / 70 }} >
                <Appbar.Content title="Feed" />
                {newNotificationFromRedux ? <Badge
                    size={10}
                    style={{ position: 'absolute', top: 14, right: 60 }}
                /> : null}


                <Appbar.Action icon="bell" onPress={() => { props.navigation.navigate('Notifications') }} />
                <Appbar.Action icon="trophy" onPress={() => { props.navigation.navigate('TrhopyScreen') }} />


            </Appbar.Header>



            <View style={styles.inner}>


                <View style={styles.selectCategoryContainer} key={restartComponent} >
                    <DropDownPicker
                        placeholder="Select Category"
                        style={{ backgroundColor: '#fff' }}
                        items={categoriesToShow}
                        containerStyle={styles.dropDownContainer}
                        itemStyle={{
                            justifyContent: 'flex-start', marginTop: 1, borderBottomWidth: 0, borderColor: 'black', paddingBottom: 20
                        }}
                        onChangeItem={item => filterByCategory(item.value)}

                    />
                    <TouchableOpacity onPress={() => setIsFilterVisble(true)} style={{ flex: 1 }}>

                        <Icon name='filter' size={32} style={styles.filterICon} />
                    </TouchableOpacity>
                </View>

                {posts.length > 0 ?
                    <ScrollView contentContainerStyle={styles.postsContainer}>
                        {posts.map((post) => {
                            return <View key={post.postId}>
                                <View><Post post={post} showComments={(comments) => showComments(comments)}
                                    refreshPage={() => setNewComment(true)} currentMemberId={userId}
                                    goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)}
                                    goToChatWithUser={(currentMemberId, member_id) => goToChatWithUser(currentMemberId, member_id)} />
                                </View>
                                <View style={{ margin: windowWidth / 70 }}>

                                </View>
                            </View>
                        })}


                    </ScrollView> :
                    <View style={{ marginHorizontal: windowWidth / 10, maxWidth: windowWidth / 1.3, marginTop: windowWidth / 10 }}>
                        <Text style={{ textAlign: 'center', fontSize: 18 }}>We couldn't find posts that matches your posts filter request</Text>
                        <TouchableOpacity onPress={() => setIsFilterVisble(true)
                        }><Text style={{ textAlign: 'center', fontSize: 18 }}>Click here to try again</Text></TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, marginTop: 20 }}>
                            <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                            <View>
                                <Text style={{ width: 50, textAlign: 'center', fontSize: 16 }}>OR</Text>
                            </View>
                            <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                        </View>
                        <View style={{ marginHorizontal: windowWidth / 14, maxWidth: windowWidth / 1.2 }}>
                            <TouchableOpacity onPress={() => props.navigation.navigate('EditFeedSettingsScreen')
                            }><Text style={{ textAlign: 'center', fontSize: 18 }}>Click here to update your feed settings</Text></TouchableOpacity>
                        </View>
                    </View>}

                {posts.length <= 2 && posts.length != 0 ? <View style={{ marginHorizontal: windowWidth / 10, maxWidth: windowWidth / 1.2 }}>
                    <Text style={{ textAlign: 'center', fontSize: 16 }}>couldn't find what you're looking for?</Text>

                    <TouchableOpacity onPress={() => props.navigation.navigate('EditFeedSettingsScreen')}>
                        <Text style={{ textAlign: 'center', fontSize: 16 }}>Click here to update your feed settings</Text>
                    </TouchableOpacity>
                </View>
                    : null}

            </View>
        </KeyboardAvoidingView >
    )


}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d9d9d9',

    },
    inner: {
        padding: windowWidth / 90,

        flex: 1,
    },
    categoryContainer: {
        flex: 1,
        marginTop: 30,
        marginBottom: 60,

    },

    barContainer: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: windowHeight / 22,
        flexDirection: 'row',
        marginHorizontal: windowHeight / 40


    },
    barText: {
        color: "#ffffff",
        fontSize: 24,
        marginTop: windowHeight / 200,
        fontFamily: 'Ubuntu_300Light',
    },
    bellIcon: {
        color: '#ffffff',
        fontSize: 28
    },
    selectCategoryContainer:
    {

        marginVertical: windowHeight / 80,

        flexDirection: 'row',

    }, dropDownContainer: {

        width: '85%',
        height: windowHeight / 15,

    },
    filterICon: { marginLeft: windowWidth / 25, marginTop: windowHeight / 100 },

    postsContainer: {

        justifyContent: 'flex-start',

    },
    userGreetingText: {
        fontSize: 18
    },
    spinnerTextStyle: {
        color: '#FFF'
    },


})
