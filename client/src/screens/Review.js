import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { Avatar, } from 'react-native-elements';
import { Rating, AirbnbRating, Divider } from 'react-native-elements';
import { Button } from 'react-native-paper';
import { KeyboardAvoidingView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import * as Font from "expo-font";
import AddNotificationToDb from '../components/AddNotificationToDb';

const Review = (props) => {

    const { otherMemberImage, otherMemberId, otherMemberName, } = props.reviewObj
    let userId = useSelector(state => state.auth.userId);

    const [rating, setRating] = useState(3);
    const [reviewText, setReviewText] = useState(null);
    let userName = useSelector(state => state.user.userName);






    useEffect(() => {

        const loadFonts = async () => {
            await Font.loadAsync({
                'Roboto': require('native-base/Fonts/Roboto.ttf'),
                'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),

            })
            loadFonts();
        }

    }, [])


    const ratingCompleted = (rating) => {
        console.log("Rating is: " + rating)
        setRating(rating)
    }
    const reviewTextHandler = text => {
        setReviewText(text)
    }


    const addMemberInteraction = async (type) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        let body = {
            memberId: userId,
            otherMemberId: otherMemberId,
            type: type,
        }
        const addMemberInteractionUrl = 'https://proj.ruppin.ac.il/bgroup14/prod/api/member/addInteractionMember'
        try {
            const res = await axios.post(addMemberInteractionUrl, body, config);

        } catch (error) {
            console.log(error)
        }
    }

    const PushFromClient = async (pushObj) => {

        //GET OTHER USER TOKEN ID FROM SERVER
        const fetchOtherUserPushNotificationID = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/getnotificationid/${otherMemberId}`
        try {
            const res = await axios(fetchOtherUserPushNotificationID);

            var otherUserNotificationId = res.data;



        } catch (error) {

            console.log(error)
            return null
        }




        let push = {
            to: otherUserNotificationId,
            // to: "ExponentPushToken[bd3PgHK1A50SU4Iyk3fNpX]",
            title: "New review",
            body: `${userName} has given you a review`,
            badge: 3,
            data: pushObj,



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

    const submitReview = async () => {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        let review = {
            fromMemberId: userId,
            memberId: otherMemberId,
            text: reviewText,
            stars: rating
        }

        let type = `Review ${rating}`;
        addMemberInteraction(type)





        const body = JSON.stringify(review)



        const addReviewUrl = "https://proj.ruppin.ac.il/bgroup14/prod/api/member/addreview";


        try {
            const res = await axios.post(addReviewUrl, body, config);

            props.closeReview();


        } catch (error) {
            alert("error has occured, try again.")
            //ALERT ERROR
        }

        let now = Math.floor(Date.now() / 1000)
        let obj = {
            memberId: otherMemberId,
            notificationType: 'Review',
            notificationText: `Gave you a rating of ${rating} stars`,
            otherMemberId: userId,
            unixdate: now
        }

        AddNotificationToDb(obj)
        let pushObj = {
            functionToRun: "receivedNewReview",

        }
        PushFromClient(pushObj)




    }




    return (
        <KeyboardAvoidingView>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Volunteering Review</Text>
            </View>
            <Divider style={{ marginTop: windowHeight / 50 }} />
            <View style={styles.profileImageContainer}>
                <Avatar
                    size='large'
                    rounded
                    source={{
                        uri:
                            otherMemberImage,
                    }}
                />
            </View>
            <View style={styles.nameContainer}>
                <View >
                    <Text style={styles.name}>Rate the meeting with</Text>
                    <Text style={styles.name}>{otherMemberName}</Text>

                </View>
            </View>

            <View style={{ alignItems: 'center' }}>
                <AirbnbRating onFinishRating={ratingCompleted} />

                <View style={styles.inputContainer}>

                    <TextInput
                        // value={labelValue}
                        style={styles.input}
                        multiline={true}
                        placeholder="Additional Comments..."
                        placeholderTextColor="black"
                        maxLength={500}
                        onChangeText={(text) => reviewTextHandler(text)}
                    />
                </View>

            </View>
            <View style={styles.btnContainer}>
                <Button style={{ width: windowWidth / 2.7 }} labelStyle={{ color: '#3b5998' }} mode='outlined' uppercase={false} onPress={() => console.log("object")}>
                    No Thanks</Button>
                <Button style={{ width: windowWidth / 2.7, backgroundColor: '#3b5998' }} labelStyle={{ color: '#fff' }} mode='contained' uppercase={false} onPress={() => submitReview()}>
                    Submit Review</Button>
            </View>

        </KeyboardAvoidingView>
    )
}

export default Review

const styles = StyleSheet.create({
    header: {
        fontSize: 24,

        color: '#3b5998'
    },
    headerContainer: {
        marginTop: windowHeight / 50,
        alignItems: 'center',

    },
    profileImageContainer: {
        marginTop: windowHeight / 30,
        alignItems: 'center',

    },
    nameContainer: {

        marginTop: windowHeight / 60
    },
    name: {
        fontSize: 18,
        textAlign: 'center'

    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: windowHeight / 30
    },
    inputContainer: {

        width: windowWidth / 1.2,
        height: windowHeight / 8,
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#e6e6e6',
        marginTop: windowHeight / 40,
        borderRadius: 10
    },
    input: {

        padding: 10,
        fontSize: 16,

    },

})
