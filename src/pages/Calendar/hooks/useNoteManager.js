import { useState } from 'react';
import { message } from 'antd';
import notesApi from '../../../api/notesApi';

export function useNoteManager({ selectedDate, notes, setNotes }) {
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [noteInput, setNoteInput] = useState('');
    const [editingNote, setEditingNote] = useState(null);

    const handleOpenNoteModal = (note = null) => {
        setEditingNote(note);
        setNoteInput(note ? note.content : '');
        setIsNoteModalOpen(true);
    };

    const handleSaveNote = async () => {
        if (!noteInput.trim()) {
            message.warning('Qeyd boş ola bilməz.');
            return;
        }
        const noteData = { id: editingNote?.id, date: selectedDate.format('YYYY-MM-DD'), content: noteInput.trim() };
        
        try {
            const response = await notesApi.saveNote(noteData);
            if (editingNote) {
                setNotes(notes.map(n => n.id === editingNote.id ? response.data : n));
                message.success('Qeyd uğurla yeniləndi!');
            } else {
                setNotes([...notes, response.data]);
                message.success('Qeyd uğurla əlavə edildi!');
            }
        } catch (error) {
            message.error('Qeydi saxlamaq mümkün olmadı.');
            console.error("Note save error:", error);
        } finally {
            setIsNoteModalOpen(false);
            setNoteInput('');
            setEditingNote(null);
        }
    };

    const handleDeleteNote = async (noteToDelete) => {
        if (!noteToDelete) return;
        try {
            await notesApi.deleteNote(noteToDelete.id);
            setNotes(notes.filter(n => n.id !== noteToDelete.id));
            message.success('Qeyd silindi.');
        } catch (error) {
            message.error('Qeydi silmək mümkün olmadı.');
            console.error("Note delete error:", error);
        }
    };

    return {
        noteModalProps: {
            open: isNoteModalOpen,
            onOk: handleSaveNote,
            onCancel: () => setIsNoteModalOpen(false),
            noteInput,
            onNoteInputChange: (e) => setNoteInput(e.target.value),
            editingNote,
        },
        handleOpenNoteModal,
        handleDeleteNote,
    };
}