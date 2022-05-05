import React, { useState, useEffect } from 'react'
import { View } from 'react-native';
import { List, Avatar, Divider, FAB, Button, Portal, Dialog, TextInput } from 'react-native-paper';
import { authentication, db } from '../firebase/firebase-config';
import { collection, doc, setDoc, query, where, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function ChatList() {
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        onAuthStateChanged(authentication, user => {
            setEmail(user?.email ?? '');
        })
    }, []);

    const createChat = async () => {
        if (!email || !userEmail) return;
        setIsLoading(true)
        const chatsRef = collection(db, "chats");
        const response = await setDoc(doc(chatsRef), {
            users: [email, userEmail]
        });
        setIsLoading(false)
        setIsDialogVisible(false);
        navigation.navigate("Chat", { chatId: response.id })
    }
    useEffect(() => {
        const q = query(collection(db, "chats"), where('users', "array-contains", email));
        onSnapshot(q, (querySnapshot) => {
            setChats(querySnapshot.docs);
        });
    }, [email]);

    return (
        <View style={{ flex: 1 }}>
            {chats.map((chat) => (
                <React.Fragment>
                    <List.Item
                        title={chat.data().users.find((x) => x !== email)}
                        description={(chat.data().messages) ? chat.data().messages[0].text : ""}
                        left={() => <Avatar.Text
                            label={chat.data().users.find((x) => x !== email)
                                .split("").reduce((prev) => prev).toUpperCase()} size={56} />}
                        onPress={() => navigation.navigate('Chat', { chatId: chat.id })}
                    />
                    <Divider inset />
                </React.Fragment>
            ))}




            <FAB icon="plus" onPress={() => setIsDialogVisible(true)} style={{ position: "absolute", bottom: 16, right: 16 }} />

            <Portal>
                <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
                    <Dialog.Title>New Chat</Dialog.Title>
                    <Dialog.Content>
                        <TextInput label="Enter user email" value={userEmail} keyboardType="email-address" onChangeText={(text) => setUserEmail(text)} />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setIsDialogVisible(false)}>Cancel</Button>
                        <Button onPress={() => createChat()} loading={isLoading}>Save</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}
