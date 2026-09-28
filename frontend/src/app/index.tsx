import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

import { API_URL } from '../config/api';

type Message = {
  _id: string;
  username: string;
  text: string;
  createdAt: string;
};

export default function HomeScreen() {
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');

  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  // Load previous messages from MongoDB
  const loadMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/messages`);

      setMessages(response.data);
    } catch (error) {
      console.log('Failed to load messages:', error);

      Alert.alert(
        'Connection Error',
        'Could not connect to the backend.'
      );
    }
  };

  // Join chat
  const joinChat = async () => {
    if (!username.trim()) {
      Alert.alert(
        'Username required',
        'Please enter your username.'
      );
      return;
    }

    await loadMessages();

    const newSocket = io(API_URL);

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    // Receive new messages instantly
    newSocket.on('newMessage', (message: Message) => {
      setMessages((previousMessages) => {
        const alreadyExists = previousMessages.some(
          (item) => item._id === message._id
        );

        if (alreadyExists) {
          return previousMessages;
        }

        return [...previousMessages, message];
      });
    });

    setSocket(newSocket);
    setJoined(true);
  };

  // Send message
const sendMessage = async () => {
  console.log('SEND BUTTON PRESSED');
  console.log('Username:', username);
  console.log('Text:', text);
  console.log('API URL:', API_URL);

  if (!text.trim()) {
    console.log('Message is empty');
    return;
  }

  try {
    console.log('Sending POST request...');

    const response = await axios.post(
      `${API_URL}/api/messages`,
      {
        username: username.trim(),
        text: text.trim(),
      }
    );

    console.log('MESSAGE SENT SUCCESSFULLY:', response.data);

    setText('');
  } catch (error) {
    console.error('SEND MESSAGE ERROR:', error);

    Alert.alert(
      'Error',
      'Could not send the message.'
    );
  }
};

  // Disconnect socket when leaving screen
  useEffect(() => {
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  // Format timestamp
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Username screen
  if (!joined) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.title}>
            Real-Time Chat
          </Text>

          <Text style={styles.subtitle}>
            Enter your username to join
          </Text>

          <TextInput
            style={styles.usernameInput}
            placeholder="Enter username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
          />

          <TouchableOpacity
            style={styles.joinButton}
            onPress={joinChat}
          >
            <Text style={styles.buttonText}>
              Join Chat
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Chat screen
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>
              Real-Time Chat
            </Text>

            <Text style={styles.username}>
              {username}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: connected
                    ? '#22c55e'
                    : '#ef4444',
                },
              ]}
            />

            <Text style={styles.statusText}>
              {connected ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item }) => {
            const isMine =
              item.username === username;

            return (
              <View
                style={[
                  styles.messageWrapper,
                  isMine
                    ? styles.myMessageWrapper
                    : styles.otherMessageWrapper,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isMine
                      ? styles.myMessage
                      : styles.otherMessage,
                  ]}
                >
                  {!isMine && (
                    <Text style={styles.sender}>
                      {item.username}
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.messageText,
                      isMine && styles.myMessageText,
                    ]}
                  >
                    {item.text}
                  </Text>

                  <Text
                    style={[
                      styles.time,
                      isMine && styles.myTime,
                    ]}
                  >
                    {formatTime(item.createdAt)}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        {/* Message input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={text}
            onChangeText={setText}
            onSubmitEditing={sendMessage}
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
          >
            <Text style={styles.sendText}>
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },

  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 10,
  },

  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 30,
  },

  usernameInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },

  joinButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  chatContainer: {
    flex: 1,
  },

  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  username: {
    color: '#6b7280',
    marginTop: 3,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 6,
  },

  statusText: {
    fontSize: 13,
    color: '#6b7280',
  },

  messageList: {
    padding: 15,
    paddingBottom: 20,
  },

  messageWrapper: {
    marginBottom: 12,
    flexDirection: 'row',
  },

  myMessageWrapper: {
    justifyContent: 'flex-end',
  },

  otherMessageWrapper: {
    justifyContent: 'flex-start',
  },

  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },

  myMessage: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },

  otherMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },

  sender: {
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 4,
  },

  messageText: {
    fontSize: 16,
    color: '#111827',
  },

  myMessageText: {
    color: '#fff',
  },

  time: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 5,
    textAlign: 'right',
  },

  myTime: {
    color: '#dbeafe',
  },

  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },

  messageInput: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 8,
    fontSize: 15,
  },

  sendButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },

  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
});