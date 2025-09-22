import React, {useEffect} from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/Navigation/AppNavigator';
import {initNotifications} from './src/Services/Notification';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

async function requestAndroidNotificationPermission() {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        ); 
        if(granted == PermissionsAndroid.RESULTS.GRANTED){
            console.log("Notification Permission Granted.");
        } else{
            console.log("Notification Permission Denied.");
        }
    }
}

export default function App(){
    useEffect(() => {
        initNotifications();
        requestAndroidNotificationPermission();
    }, []);

    return (
        <GestureHandlerRootView style = {{flex: 1}}>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}