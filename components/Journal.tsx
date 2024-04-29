import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

interface JournalEntry {
    id: string;
    date: string;
    entry: string;
}

const Journal: React.FC = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [newEntry, setNewEntry] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'journal'), where('userId', '==', auth.currentUser?.uid)),
            (snapshot) => {
                const entriesList: JournalEntry[] = [];
                snapshot.forEach((doc) => {
                    entriesList.push({
                        id: doc.id,
                        date: doc.data().date,
                        entry: doc.data().entry,
                    });
                });
                setEntries(entriesList);
            }
        );

        return () => unsubscribe();
    }, []);

    const handleAddEntry = async () => {
        try {
            const date = new Date().toDateString();
            await addDoc(collection(db, 'journal'), {
                date,
                entry: newEntry,
                userId: auth.currentUser?.uid,
            });
            alert('Entry saved successfully!');
            setNewEntry('');
            setModalVisible(false);
        } catch (error) {
            console.error('Error adding journal entry:', error);
        }
    };

    const handleDeleteEntry = async (id: string) => {
        Alert.alert(
            "Delete Entry",
            "Are you sure you want to delete this entry?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { 
                    text: "OK", 
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'journal', id));
                        } catch (error) {
                            console.error('Error deleting journal entry:', error);
                        }
                    } 
                }
            ]
        );
    };

    const handleViewEntry = (entry: JournalEntry) => {
        setSelectedEntry(entry);
        setModalVisible(true);
    };

    const renderItem = ({ item }: { item: JournalEntry }) => (
        <View style={styles.entryContainer}>
            <Text style={styles.entryDate}>{item.date}</Text>
            <TouchableOpacity onPress={() => handleViewEntry(item)}>
                <MaterialCommunityIcons name="eye" size={24} color="blue" />
            </TouchableOpacity>
            <MaterialCommunityIcons name="delete" size={24} color="red" onPress={() => handleDeleteEntry(item.id)} />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Write something here..."
                multiline
                value={newEntry}
                onChangeText={setNewEntry}
            />
            <TouchableOpacity onPress={() => handleAddEntry()} style={styles.addButton}>
                <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <FlatList
                data={entries}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>{selectedEntry?.date}</Text>
                        <Text style={styles.modalText}>{selectedEntry?.entry}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goHomeButton}>
                <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0ead6',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    entryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    entryDate: {
        fontSize: 18,
        color: '#654321',
    },
    entryText: {
        fontSize: 16,
        color: 'blue',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#654321',
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#8b4513',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    goHomeButton: {
        backgroundColor: '#8b4513',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    addButton: {
        backgroundColor: '#8b4513',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginBottom: 10,
    },
});

export default Journal;
