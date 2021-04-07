import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Keyboard, KeyboardAvoidingView } from 'react-native';
import { getIconType } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwsome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Button } from 'react-native-elements';

import Post from '../components/Post';
import { useFocusEffect } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import MyOverlay from '../components/MyOverlay';







import MyLinearGradient from '../components/MyLinearGradient';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { Divider } from 'react-native-elements';
import axios from 'axios';
import { Avatar } from 'react-native-elements';
import FontAwsome from 'react-native-vector-icons/FontAwesome';




import { SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import FeedFilterScreen from './FeedFilterScreen';
import CommentsScreens from './CommentsScreens';
// import MessageBubble from '../components/MessageBubble';
import MessageBubble from '../components/MessageBubble';

import { NO_NEW_MESSAGE } from '../../store/actions/types';

import ScheduleMeeting from '../components/ScheduleMeeting';


// import MessageBubble from;






const ChatWithOtherUser = (props) => {


    let userName = useSelector(state => state.user.userName);
    let userImage = useSelector(state => state.user.userImage);
    let firstName = userName.split(" ")[0]
    const [newMessage, setNewMessage] = useState();
    const dispatch = useDispatch();
    const [isVisible, setIsvisble] = useState(false);
    let newMessageFromRedux = useSelector(state => state.chat.receivedMessage);




    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
        scrollView.current.scrollToEnd()


        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, [keyboardStatus]);

    const [keyboardStatus, setKeyboardStatus] = useState(undefined);
    const _keyboardDidShow = () => setKeyboardStatus("Keyboard Shown");
    const _keyboardDidHide = () => setKeyboardStatus("Keyboard Hidden");




    const { route, navigation } = props
    const scrollView = useRef()
    const [keyboadrdOpen, setKeyboadOpen] = useState(false);





    useFocusEffect(
        React.useCallback(() => {
            // console.log('ss')
            scrollView.current.scrollToEnd()
            fetchChatHistory()


        }, [keyboardStatus, newMessageFromRedux])
    )






    /* 2. Get the param */
    const { chatRoomId, otherMemberName, otherMemberImage, otherMemberId } = route.params;
    let userId = useSelector(state => state.auth.userId);
    const [chatHistory, setChatHistory] = useState([]);
    const [restartComponent, setRestartComponent] = useState(1);




    const fetchChatHistoryUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/chat/getChatHistory/${chatRoomId}/${userId}`



    const scrollDown = () => {
        setTimeout(() => {
            scrollView.current.scrollToEnd()
        }, 300);


    }
    const fetchChatHistory = async () => {
        // console.log("Fetching chat history...")
        const res = await axios(fetchChatHistoryUrl);
        setChatHistory(res.data)
        if (res.data.length > 0) {
            markLastMassageRead()
        }
        scrollDown();
        // console.log(res.data)
    }

    // const https://localhost:44303/api/chat/markLastMassageRead/4/157

    const markLastMassageRead = async () => {
        // console.log(chatHistory.length)
        // console.log("marking last msg as read...")
        const markLastMassageReadUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/chat/markLastMassageRead/${chatRoomId}/${userId}`
        try {
            const res = await axios.post(markLastMassageReadUrl);
            // console.log(res.data)
            if (res.data == "Message marked as read") {

                //DISPATCH MESSAGE WAS READ
                dispatch({
                    type: NO_NEW_MESSAGE,
                    //payload will be the what we recieve from the server
                    payload: null
                });

            }
        } catch (error) {
            console.log(error)
        }

    }


    const sendMessage = async () => {

        let newMessageToSend = {

            datetime: Math.round((new Date()).getTime() / 1000),
            fromMemberId: userId,
            toMemberId: otherMemberId,
            text: newMessage,
            chatRoomId
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }

            }
            let body = JSON.stringify(newMessageToSend);
            console.log(body)



            const sendChatMessageUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/chat/sendChatMessage`

            const res = await axios.post(sendChatMessageUrl, body, config);
            PushFromClient()
            setRestartComponent(Date.now)



        }
        catch (error) {

        }


    }


    const PushFromClient = async () => {

        //GET OTHER USER TOKEN ID FROM SERVER
        const fetchOtherUserPushNotificationID = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/getnotificationid/${otherMemberId}`
        try {
            // console.log("getting other memner push id with id: " + otherMemberId)
            const res = await axios(fetchOtherUserPushNotificationID);

            var otherUserNotificationId = res.data;



        } catch (error) {

            console.log(error)
            return null
        }

        let push = {
            to: otherUserNotificationId,
            // to: "ExponentPushToken[bd3PgHK1A50SU4Iyk3fNpX]",
            title: otherMemberName,
            body: newMessage,
            badge: 3,
            data: {
                functionToRun: "receivedNewMessage",
                chatRoomId: chatRoomId,
                otherMemberName: userName,
                otherMemberId: userId,
                otherMemberImage: userImage

            },



        };

        // POST adds a random id to the object sent
        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            body: JSON.stringify(push),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                if (json != null) {
                    console.log(`
                  returned from server\n
                  json.data= ${JSON.stringify(json.data)}`);

                } else {
                    alert('err json');
                }
            });
    }

    const inviteMeeting = (dateObj) => {
        // setIsvisble(false)
        // setHaveDateFromPicker(true)
        // setDateLabel(dateObj.dateLabel)
        // setTimeOFtheDay(dateObj.timeOFtheDay)
        // setUnixDate(dateObj.unixDate)
        let now = Math.floor(Date.now() / 1000)
        setIsvisble(false)
        let fromMemberId = userId;
        let toMemberId = otherMemberId;
        const meetingMsg = true;
        let meetingMsgDetails = {

            ...dateObj,
            chatRoomId,
            datetime: now,
            fromMemberId,
            toMemberId,
            meetingMsg
        }
        // console.log(meetingMsgDetails)
        let body = JSON.stringify(meetingMsgDetails);
        //  console.log(body)
        // console.log(otherMemberId)
        // console.log(userId)

        //ADD SERVER AXIOS MEETINGMSG
        //HERE I SHOULD SEND A SPECIAL CHAT MSG TO THE SERVER WITH THE MEETING INFO
        //IN C# MAYBE ADD TO CHAT HISTORY DTO ANOTHER DTO OF MEETINGiNFO SO OBJECT INSIDE AN OBJECT
        //THEN I SHOULD RE RENDER THE COMPENENT AND WHEN READING ALL THE CHAT HISTORY I SHOULD RENDER A SPECIAL BUBBLE FOR MEETING MSGS
        //IN MSG BUBBLE I SHOULD CHECK IF THE MEETING INFO OBJ !+ NULL - IF IT DOES SHOW A DIFFERENT MSG WITH TWO BUTTONS

    }

    return (
        <KeyboardAvoidingView style={styles.container} key={restartComponent}>


            <View style={styles.inner}>
                <MyLinearGradient firstColor="#00c6fb" secondColor="#005bea" height={90} />
                <MyOverlay isVisible={isVisible} onBackdropPress={() => setIsvisble(false)}  >
                    <ScheduleMeeting receiveDateFromDatePicker={(dateObj) => inviteMeeting(dateObj)} />

                </MyOverlay>
                {/* <MyLinearGradient firstColor="#f5f7fa" secondColor="#c3cfe2" height={80} /> */}
                <View >
                    <View>
                        <View style={styles.barContainer} >

                            <Avatar
                                size='small'
                                // avatarStyle={{ height: 59, }}
                                // containerStyle={{ marginTop: 10 }}
                                rounded
                                source={{
                                    uri:
                                        otherMemberImage
                                    // postCreatorImg,
                                }}
                            />
                            <Text style={styles.barText}>{otherMemberName}</Text>
                        </View>
                        <View style={styles.IconContainer}>
                            <Icon
                                style={styles.bellIcon}
                                name='calendar'
                                onPress={() => setIsvisble(true)}
                            />
                        </View>
                    </View>

                </View>


                <ScrollView style={{ marginTop: windowHeight / 20 }} ref={scrollView} >

                    {chatHistory.map((message) => {
                        //   console.log(message)
                        return <MessageBubble message={message} mine={!message.mine} text={message.text}
                            key={message.messageId}
                        />
                        // return <User user={user} key={user.memberId} goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)} />

                    })}


                </ScrollView>

                {/* <TouchableOpacity onPress={() => console.log(newMessage)}> */}
                <View style={styles.messageContainer} >
                    {/* <TextInput autoFocus={true} placeholder="Enter your comment here" multiline={true} style={styles.commentInput} numberOfLines={3} onChangeText={(text) => setComment(text)} /> */}
                    <TextInput onFocus={() => scrollView.current.scrollToEnd()} autoFocus={false} placeholder="Type a message..." multiline={true}
                        style={styles.commentInput} numberOfLines={3}
                        onChangeText={(text => setNewMessage(text))} />
                    {/* <TouchableOpacity onPress={() => publishComment()}> */}
                    <TouchableOpacity onPress={() => sendMessage()}>
                        <FontAwsome name='send-o' color='blue' style={{ marginTop: windowHeight / 50, marginRight: windowHeight / 50 }} size={22} />
                    </TouchableOpacity>
                </View>
                {/* </TouchableOpacity> */}
                {/* <TextInput placeholder='Message...' /> */}
            </View>


        </KeyboardAvoidingView >
    )
}

export default ChatWithOtherUser

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    inner: {
        padding: windowHeight / 45,

        flex: 1,
        //  justifyContent: "space-around"
    },
    barContainer: {

        // justifyContent: 'flex-',
        alignItems: 'center',
        //  marginLeft: 30,
        marginTop: windowHeight / 32,
        flexDirection: 'row',
        paddingLeft: windowWidth / 100,
        paddingRight: windowWidth / 100,

    },
    IconContainer: {
        //flex: 1,
        // flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
        // alignItems: 'flex-end',

        // justifyContent: 'flex-end'
        position: 'absolute',
        marginLeft: windowWidth / 1.3,
        marginTop: windowHeight / 26,
        // flexDirection: 'row',
        // paddingLeft: windowWidth / 100,
        // paddingRight: windowWidth / 100,


    },
    barText: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: windowWidth / 30
    },
    bellIcon: {
        color: '#ffffff',
        fontSize: 24
    },
    commentInput: {
        maxWidth: '90%'
    },
    messageContainer: {
        backgroundColor: '#D7D6D6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: windowWidth / 70,
        height: 60,
        borderRadius: 20
    }

})
