import { text } from '@fortawesome/fontawesome-svg-core';
import React from 'react'
import { KeyboardAvoidingView } from 'react-native';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements';
import { Divider } from 'react-native-elements';
import FontAwsome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { windowHeight, windowWidth } from '../../utils/Dimentions';

const Comment = (props) => {
    const { id, text, commentingMemberImage, commentingMemberName, commentingMemberId } = props.comment;



    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.commentContainer}>
                <View style={{ backgroundColor: 'white', padding: 5, marginTop: windowHeight / 80 }}>
                    <Avatar

                        size='medium'
                        rounded
                        source={{
                            uri:
                                commentingMemberImage,
                        }}
                    />
                </View>
                <View style={styles.comment}>
                    <View >
                        <View style={styles.userNameContainer}>
                            <TouchableOpacity onPress={() => props.goToOtherUserProfile(commentingMemberId)}>
                                <Text style={styles.userName}>{commentingMemberName}</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.commentText}>{text}</Text>

                    </View>
                </View>

            </View>
        </KeyboardAvoidingView>

    )
}

export default Comment

const styles = StyleSheet.create({

    container: {
        marginVertical: windowHeight / 50,
        flex: 1,

    },
    commentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',

    },
    comment: {
        backgroundColor: '#EDEDED',
        width: windowWidth / 1.5,
        borderRadius: 16,
        marginTop: windowHeight / 60,
        height: '100%'
    },

    userNameContainer: {
        marginTop: windowWidth / 80,
        marginLeft: windowWidth / 50,
    },
    userName:
    {
        fontSize: 16,
        fontWeight: 'bold'
    },
    commentText: {
        marginTop: windowWidth / 80,
        marginLeft: windowWidth / 50,

    },
    postDateText: {
        color: 'black'
    },
    postCityName: {
        color: 'blue'

    },
    postBtnContainer: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginBottom: 5,
        marginTop: 10

    },
    postBtn: {
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginHorizontal: 10
    },
    btnText: { marginLeft: 5 },
    commentsContainer: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'flex-end'
    },

    userImage: {

    }

})
