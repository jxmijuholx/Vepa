import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';


interface Todo {
    id: string;
    title: string;
    done: boolean;
}

function TodoList({ navigation }: { navigation: any }) {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'todos'), where('userId', '==', auth.currentUser?.uid)),
            (snapshot) => {
                const todosList: Todo[] = [];
                snapshot.forEach((doc) => {
                    todosList.push({
                        id: doc.id,
                        title: doc.data().title,
                        done: doc.data().done || false,
                    });
                });
                setTodos(todosList);
            }
        );

        return () => unsubscribe();
    }, []);

    const handleAddTodo = async () => {
        try {
            await addDoc(collection(db, 'todos'), {
                title: newTodo,
                done: false,
                userId: auth.currentUser?.uid,
            });
            setNewTodo('');
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const handleDeleteTodo = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'todos', id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const handleDoneTodo = async (id: string) => {
        try {
            const updatedTodos = todos.map(todo =>
                todo.id === id ? { ...todo, done: !todo.done } : todo
            );
            setTodos(updatedTodos);
            await updateDoc(doc(db, 'todos', id), { done: !todos.find(todo => todo.id === id)?.done });
        } catch (error) {
            console.error('Error marking todo as done:', error);
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={styles.contentContainer}>
                    <Text style={styles.heading}>Todo List</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={newTodo}
                            onChangeText={setNewTodo}
                            placeholder="Enter new todo"
                            style={styles.input}
                        />
                        <TouchableOpacity onPress={handleAddTodo} style={styles.addButton}>
                            <Text style={styles.buttonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={todos}
                        renderItem={({ item }) => (
                            <View style={styles.todoItem}>
                                <TouchableOpacity onPress={() => handleDoneTodo(item.id)}>
                                    <MaterialCommunityIcons
                                        name={item.done ? "checkbox-marked" : "checkbox-blank-outline"}
                                        size={24} color={item.done ? "green" : "black"} />
                                </TouchableOpacity>
                                <Text style={[styles.todoText, item.done && styles.doneText]}>{item.title}</Text>
                                <TouchableOpacity onPress={() => handleDeleteTodo(item.id)}>
                                    <MaterialCommunityIcons name="trash-can-outline" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item) => item.id}
                    />
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.goBackButton}>
                        <Text style={styles.buttonText}>Home</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4d3319',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    contentContainer: {
        flexGrow: 1,
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: '#e6ccb3',
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccbba8',
        borderWidth: 1,
        marginRight: 10,
        paddingHorizontal: 10,
        color: '#e6ccb3',
    },
    addButton: {
        backgroundColor: '#8c7355',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#e6ccb3',
        fontSize: 18,
        textAlign: 'center',
    },
    todoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    todoText: {
        flex: 1,
        fontSize: 18,
        color: '#e6ccb3',
    },
    doneText: {
        textDecorationLine: 'line-through',
    },
    goBackButton: {
        backgroundColor: '#8c7355',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
        justifyContent: 'center',
    },
});


export default TodoList;