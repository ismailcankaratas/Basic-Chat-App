import React, { useState } from 'react'
import { View } from 'react-native';
import { Button, Subheading, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { authentication } from '../firebase/firebase-config';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const navigation = useNavigation();

    const createAccount = async () => {
        setIsLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(authentication, email, password)
            await updateProfile(response.user, { displayName: name });
            setIsLoading(false);
            navigation.popToTop();
        } catch (error) {
            setIsLoading(false);
            setError(error.message)
        }
    }

    return (
        <View style={{ margin: 16 }}>
            {
                !!error && (
                    <Subheading style={{ color: "red", textAlign: "center" }}>{error}</Subheading>
                )
            }
            <TextInput label="Name"
                value={name}
                onChangeText={text => setName(text)} />
            <TextInput label="Email"
                style={{ marginTop: 12 }}
                value={email} onChangeText={text => setEmail(text)}
                keyboardType="email-address"
            />
            <TextInput label="Password"
                style={{ marginTop: 12 }}
                value={password} onChangeText={text => setPassword(text)}
                secureTextEntry
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
                <Button compact onPress={() => navigation.navigate("SignIn")}>Sign In</Button>
                <Button mode='contained' onPress={() => createAccount()} loading={isLoading}>Sign Up</Button>
            </View>
        </View>
    )
}
