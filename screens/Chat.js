import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { authentication, db } from '../firebase/firebase-config';
import { GiftedChat } from 'react-native-gifted-chat';
import { onAuthStateChanged } from 'firebase/auth';
import { View } from 'react-native';

export default function Chat() {
    const route = useRoute();
    const chatId = route.params.chatId;
    const [messages, setMessages] = useState([]);
    const [uid, setUid] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        return onAuthStateChanged(authentication, user => {
            setUid(user?.uid);
            setName(user?.displayName);
        })
    }, []);

    useEffect(() => {
        const chat = doc(db, "chats", chatId);
        onSnapshot(chat, (snapshot) => {
            setMessages(snapshot.data()?.messages ?? [])
        })

    }, [route.params.chatId]);

    const onSend = async (m = []) => {
        const chatsRef = doc(db, "chats", chatId);

        await setDoc(chatsRef, {
            messages: GiftedChat.append(messages, m)
        }, { merge: true });
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <GiftedChat
                messages={messages.map(x => ({
                    ...x,
                    createdAt: x.createdAt?.toDate()
                }))}
                onSend={messages => onSend(messages)}
                user={{
                    _id: uid,
                    name: name
                }}
            />
        </View>
    )
}
