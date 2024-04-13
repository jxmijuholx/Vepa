import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig';

const JournalEntryScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const { entryId, entryContent } = route.params;
    const [editedEntry, setEditedEntry] = useState(entryContent);

    const handleSaveEntry = async () => {
        try {
            await updateDoc(doc(db, 'journal', entryId), { entry: editedEntry });
            navigation.goBack();
        } catch (error) {
            console.error('Error updating journal entry:', error);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TextInput
                value={editedEntry}
                onChangeText={setEditedEntry}
                placeholder="Write your entry here"
                multiline
                style={{ height: '80%', borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 }}
            />
            <TouchableOpacity onPress={handleSaveEntry} style={{ backgroundColor: 'green', padding: 10, borderRadius: 5 }}>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Save</Text>
            </TouchableOpacity>
        </View>
    );
};

export default JournalEntryScreen;
