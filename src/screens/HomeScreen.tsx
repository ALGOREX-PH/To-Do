import React, { useRef } from 'react';
import {View, Text, StyleSheet, Animated, ScrollView, useColorScheme} from 'react-native';
import {SparklesIcon} from "lucide-react-native";

export default function HomeScreen() {
    const isDark = useColorScheme() === 'dark';

    return (
        <View style={[styles.mainContainer]}>
            <View style={styles.container}>
                <SparklesIcon size={50} style={[styles.logo]}/>
                <Text style={[styles.logo, {color: '#1e1e1e'}]}>magically</Text>
                <Text style={[styles.tagline, {color: '#1e1e1e'}]}>Android, iOS mobile apps in minutes</Text>
                <Text style={[styles.subtitle, {color: '#1e1e1e'}]}>AI will help you build your app</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    logo: { fontSize: 42, fontWeight: 'bold', marginBottom: 16 },
    tagline: { fontSize: 18, marginBottom: 8 },
    subtitle: { fontSize: 16 }
});
