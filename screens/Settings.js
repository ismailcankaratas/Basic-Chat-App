import React, { useEffect, useState } from 'react'
import { View } from 'react-native';
import { Avatar, Button, Subheading, Title } from 'react-native-paper';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { authentication } from '../firebase/firebase-config';

export default function Settings() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    useEffect(() => {
        onAuthStateChanged(authentication, user => {
            setName(user?.displayName ?? "");
            setEmail(user?.email ?? "");
        })
    }, []);
    return (
        <View style={{ alignItems: "center", marginTop: 16 }}>
            <Avatar.Text label={(name) ? name[0].toUpperCase() : ""} />
            <Title>{name}</Title>
            <Subheading>{email}</Subheading>
            <Button onPress={() => signOut(authentication)}>Sign Out</Button>
        </View>
    )
}
