import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
    const [editingEntryContent, setEditingEntryContent] = useState('');

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
            if (editingEntryId) {
                await updateDoc(doc(db, 'journal', editingEntryId), {
                    entry: editingEntryContent,
                });
            } else {
                await addDoc(collection(db, 'journal'), {
                    date,
                    entry: newEntry,
                    userId: auth.currentUser?.uid,
                });
            }
            setNewEntry('');
            setEditingEntryId(null);
            setEditingEntryContent('');
            setModalVisible(false);
        } catch (error) {
            console.error('Error adding/editing journal entry:', error);
        }
    };

    const handleDeleteEntry = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'journal', id));
        } catch (error) {
            console.error('Error deleting journal entry:', error);
        }
    };

    const handleEditEntry = async (entry: JournalEntry) => {
        try {
            const entryDoc = await getDoc(doc(db, 'journal', entry.id));
            if (entryDoc.exists()) {
                setEditingEntryId(entry.id);
                setEditingEntryContent(entryDoc.data()?.entry || '');
                setModalVisible(true);
            }
        } catch (error) {
            console.error('Error fetching entry for editing:', error);
        }
    };

    const renderItem = ({ item }: { item: JournalEntry }) => (
        <TouchableOpacity
            onPress={() => handleEditEntry(item)}
            style={styles.entryContainer}
        >
            <Text style={styles.entryDate}>{item.date}</Text>
            <TouchableOpacity onPress={() => handleDeleteEntry(item.id)}>
                <MaterialCommunityIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.addButton}
            >
                <Text style={styles.buttonText}>Write entry</Text>
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
                        <TextInput
                            value={editingEntryContent}
                            onChangeText={setEditingEntryContent}
                            placeholder="Write your entry here"
                            multiline
                            style={styles.entryInput}
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={[styles.modalButton, styles.cancelButton]}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleAddEntry}
                                style={[styles.modalButton, styles.saveButton]}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity
            onPress={() => navigation.goBack()}
                style={styles.goHomeButton}>
                <Text style={styles.buttonText}>Go Home</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    },
    addButton: {
        backgroundColor: '#3498db',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
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
    entryInput: {
        height: 200,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        width: '45%',
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: 'red',
    },
    saveButton: {
        backgroundColor: 'green',
    },
    goHomeButton: {
        backgroundColor: '#3498db',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});

export default Journal;
