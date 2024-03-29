// Example of Bottom Sheet in React Native
// https://aboutreact.com/react-native-bottom-sheet/

// import React in our code
import React, { useState } from 'react';

// import all the components we are going to use
import { SafeAreaView, StyleSheet, View, Text, Button } from 'react-native';

//import basic react native components
import { BottomSheet } from 'react-native-btr';

//import to show social icons
import { SocialIcon } from 'react-native-elements';
import { windowHeight } from '../../utils/Dimentions';

const MyBottomSheet = (props) => {
    const [visible, setVisible] = useState(props.visible);


    const toggleBottomNavigationView = () => {
        props.toggle();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>


                <BottomSheet
                    visible={props.visible}
                    onBackButtonPress={toggleBottomNavigationView}
                    onBackdropPress={toggleBottomNavigationView}
                >
                    <View style={styles.bottomNavigationView}>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                            }}>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    padding: 5,
                                    fontSize: 15,
                                }}>
                                {props.header}
                            </Text>
                            {props.children}

                        </View>
                    </View>
                </BottomSheet>
            </View>
        </SafeAreaView>
    );
};

export default MyBottomSheet;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0F7FA',
    },
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: windowHeight / 6,

    },
});
