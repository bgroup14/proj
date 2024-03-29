import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,

} from 'react-native'
import Svg, { Path } from 'react-native-svg'

import { moderateScale } from 'react-native-size-matters'
import { Avatar } from 'react-native-elements';
import { Alert } from 'react-native';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { Button } from 'react-native-elements';


// Props info list
// 1. mine (bool) => renders blue bubble on right
// 2. text (string) => renders text message
// 3. image (image file) => renders image inside bubble

const MessageBubble = (props) => {
    const { meetingMsg, meetingEventTitle, meetingDateLabel, meetingTimeLabel, meetingLocationLabel } = props.message;

    const otherMemberName = props.otherMemberName

    const fullName = otherMemberName.split(' ');



    const otherMemberFirstName = fullName[0];

    return (
        <View>
            {!meetingMsg ?
                <View style={[
                    styles.message,
                    props.mine ? styles.mine : styles.not_mine
                ]}
                >
                    <View
                        style={[
                            styles.cloud,
                            {
                                backgroundColor: props.mine ? '#dddddd' : '#007aff'
                            }
                        ]}
                    >


                        {
                            props.text
                                ?
                                <Text
                                    style={[
                                        styles.text,
                                        {
                                            color: props.mine ? 'black' : 'white'
                                        }
                                    ]}
                                >
                                    {props.text}
                                </Text>
                                :
                                null
                        }
                        <View
                            style={[
                                styles.arrow_container,
                                props.mine ? styles.arrow_left_container : styles.arrow_right_container
                            ]}
                        >
                            <Svg
                                style={props.mine ? styles.arrow_left : styles.arrow_right}
                                width={moderateScale(15.5, 0.6)}
                                height={moderateScale(17.5, 0.6)}
                                viewBox="32.484 17.5 15.515 17.5"
                                enable-background="new 32.485 17.5 15.515 17.5"
                            >
                                <Path
                                    d={props.mine
                                        ?
                                        "M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
                                        :
                                        "M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
                                    }
                                    fill={props.mine ? '#dddddd' : '#007AFF'}
                                    x="0"
                                    y="0"
                                />
                            </Svg>
                        </View>
                    </View>
                </View>
                :

                //MEETING MSG BUBBLE
                <View style={[
                    styles.message,
                    props.mine ? styles.mine : styles.not_mine
                ]}
                >
                    <View
                        style={[
                            styles.cloud,
                            {
                                backgroundColor: props.mine ? '#dddddd' : '#007aff',
                                width: windowWidth / 1.7
                            }
                        ]}
                    >


                        {
                            props.text
                                ?
                                <View>
                                    {props.mine ?
                                        <Text
                                            style={[
                                                styles.text,
                                                {
                                                    color: props.mine ? 'black' : 'white'
                                                }
                                            ]}>

                                            {`${otherMemberFirstName} sent you invitation for ${meetingEventTitle}`}
                                            {'\n'}

                                            {`${meetingDateLabel} at ${meetingTimeLabel}`}
                                            {'\n'}
                                            {meetingLocationLabel == "Zoom Meeting" ? meetingLocationLabel : "In " + meetingLocationLabel}

                                        </Text> :
                                        <Text
                                            style={[
                                                styles.text,
                                                {
                                                    color: props.mine ? 'black' : 'white'
                                                }
                                            ]}>

                                            {`You sent ${otherMemberFirstName} invitation for ${meetingEventTitle}`}
                                            {'\n'}

                                            {`${meetingDateLabel} at ${meetingTimeLabel}`}
                                            {'\n'}
                                            {meetingLocationLabel == "Zoom Meeting" ? meetingLocationLabel : "In " + meetingLocationLabel}


                                        </Text>}
                                    {props.mine ? <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        marginTop: windowHeight / 40
                                    }}>
                                        <Button
                                            title="Accept"
                                            type="outline"
                                            raised={true}
                                            buttonStyle={{ width: windowWidth / 5, maxHeight: 40 }}
                                            onPress={() => { props.meetingAnswer('Accept') }}
                                        />
                                        <Button
                                            title="Reject"
                                            type="outline"
                                            raised={true}
                                            buttonStyle={{ width: windowWidth / 5, maxHeight: 40 }}
                                            onPress={() => { props.meetingAnswer('Reject') }}

                                        />
                                    </View> : null}

                                </View>
                                :
                                null
                        }
                        <View
                            style={[
                                styles.arrow_container,
                                props.mine ? styles.arrow_left_container : styles.arrow_right_container
                            ]}
                        >
                            <Svg
                                style={props.mine ? styles.arrow_left : styles.arrow_right}
                                width={moderateScale(15.5, 0.6)}
                                height={moderateScale(17.5, 0.6)}
                                viewBox="32.484 17.5 15.515 17.5"
                                enable-background="new 32.485 17.5 15.515 17.5"
                            >
                                <Path
                                    d={props.mine
                                        ?
                                        "M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
                                        :
                                        "M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
                                    }
                                    fill={props.mine ? '#dddddd' : '#007AFF'}
                                    x="0"
                                    y="0"
                                />
                            </Svg>
                        </View>
                    </View>
                </View>
            }

        </View>
    )
}

export default MessageBubble

const styles = StyleSheet.create({
    message: {
        flexDirection: 'row',
        marginVertical: moderateScale(7, 2),
    },
    mine: {
        marginLeft: 20,

    },
    not_mine: {
        alignSelf: 'flex-end',
        marginRight: 10
    },
    cloud: {
        maxWidth: moderateScale(250, 2),
        paddingHorizontal: moderateScale(10, 2),
        paddingTop: moderateScale(5, 2),
        paddingBottom: moderateScale(7, 2),
        borderRadius: 20,

    },
    text: {
        paddingTop: 3,
        fontSize: 17,
        lineHeight: 22
    },
    arrow_container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        flex: 1,
    },
    arrow_left_container: {
        justifyContent: 'flex-end',
        alignItems: 'flex-start',

    },
    arrow_right_container: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    arrow_left: {
        left: moderateScale(-6, 0.5),
    },
    arrow_right: {
        right: moderateScale(-6, 0.5)
    }

})
