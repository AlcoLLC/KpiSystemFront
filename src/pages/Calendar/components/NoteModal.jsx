import { Modal, Input } from 'antd';

const { TextArea } = Input;

const NoteModal = ({ open, onOk, onCancel, noteInput, onNoteInputChange, selectedDate, editingNote }) => {
    return (
        <Modal
            title={editingNote ? 'Qeydi Redaktə et' : 'Yeni Qeyd Əlavə et'}
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            okText="Yadda saxla"
            cancelText="Ləğv et"
            okButtonProps={{ disabled: !noteInput.trim() }}
        >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{selectedDate.format('D MMMM YYYY')} tarixinə qeyd əlavə edin</p>
            <TextArea rows={4} value={noteInput} onChange={onNoteInputChange} placeholder="Məsələn: Həftəlik iclas, xatırlatma..." />
        </Modal>
    );
};

export default NoteModal;