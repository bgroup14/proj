import React from 'react'
import { Fragment } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Comment from '../components/Comment';


const CommentsScreens = (props) => {


    return (
        <Fragment>
            <KeyboardAvoidingView style={styles.container} >
                <ScrollView style={styles.postsContainer}>
                    {props.comments.map((comment) => {
                        return <Comment comment={comment} key={comment.text} goToOtherUserProfile={(member_id) => props.goToOtherUserProfile(member_id)} />
                    })}
                </ScrollView>
            </KeyboardAvoidingView>
        </Fragment>
    )
}

export default CommentsScreens

const styles = StyleSheet.create({

})
