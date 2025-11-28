import { Modal, Form, Rate, Input, Button, Timeline } from 'antd';
import { UserOutlined, StarOutlined, MessageOutlined } from '@ant-design/icons';
import { formatForDisplay, formatForHistory } from '../../../utils/dateFormatter';
import { useEvaluationForm } from '../hooks/useEvaluationForm'; 
import ScoreDisplay from './ScoreDisplay';
const { TextArea } = Input;

const UserEvaluationModal = ({ visible, onClose, user, initialData, evaluationMonth, evaluationType, canEdit }) => {
        const {
        form,
        loading,
        displayScore,
        isEditing,
        scoreDescription,
        handleFormSubmit,
        handleValuesChange,
    } = useEvaluationForm({ visible, onClose, user, initialData, evaluationMonth, evaluationType, canEdit });

    const fullName = user ? `${user.first_name} ${user.last_name}` : '';
    const typeText = evaluationType === 'SUPERIOR' ? 'Üst Rəhbər' : 'Yuxarı İdarəetmə';
    
    const modalTitle = evaluationMonth
        ? `${typeText} Dəyərləndirməsi (${formatForDisplay(evaluationMonth)}) - ${fullName}`
        : `Dəyərləndirmə - ${fullName}`;

    const modalFooter = canEdit
        ? [
            <Button key="back" onClick={() => onClose(false)}> Ləğv Et </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
                {isEditing ? 'Dəyərləndirməni Yenilə' : 'Dəyərləndirməni Qeyd Et'}
            </Button>,
          ]
        : [<Button key="close" type="primary" onClick={() => onClose(false)}>Bağla</Button>];

    return (
        <Modal
            open={visible}
            onCancel={() => onClose(false)}
            title={modalTitle}
            width={600}
            footer={modalFooter}
            className="flush-scrollbar user-kpi-system-modal"
            bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
                onValuesChange={handleValuesChange}
            >
                <div className="space-y-6 py-6 pl-6 pr-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center text-blue-700">
                            <UserOutlined className="mr-2" />
                            <span className="font-medium">{typeText} Dəyərləndirməsi (1-10 şkala)</span>
                        </div>
                        <p className="text-sm text-blue-600 mt-1">
                            Bu dəyərləndirmə işçinin seçilən ay üzrə ümumi performansını əks etdirir.
                        </p>
                    </div>

                    <ScoreDisplay score={displayScore} />

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Qiymətləndirmə (1-10 arası):
                        </label>
                        <div className="flex flex-col items-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                            <div className="mb-4 flex items-center">
                                <StarOutlined className="text-yellow-500 text-xl mr-2" />
                                <span className="text-gray-700 font-medium">Dəyərləndirin:</span>
                            </div>
                            <div className="w-full max-w-md">
                                <Form.Item name="score" noStyle>
                                    <Rate
                                        count={10}
                                        style={{ fontSize: "32px" }}
                                        className="flex justify-center"
                                        disabled={!canEdit}
                                    />
                                </Form.Item>
                                <div className="flex justify-between text-xs text-gray-400 mt-3 px-2">
                                    {[...Array(10)].map((_, i) => (
                                        <span key={i}>{i + 1}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <div className={`text-lg font-semibold transition-colors duration-300 ${scoreDescription.className}`}>
                                {scoreDescription.text}
                            </div>
                        </div>
                    </div>
                    
                    {canEdit ? (
                        <Form.Item name="comment" label={ <span className="flex items-center text-sm font-medium text-gray-700"> <MessageOutlined className="mr-2 text-blue-500" /> Qeyd: </span> }>
                            <TextArea 
                                placeholder="Qeydlərinizi buraya yaza bilərsiniz..." 
                                rows={4} 
                                className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </Form.Item>
                    ) : (
                        initialData?.comment && (
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <MessageOutlined className="mr-2 text-blue-500" /> Rəhbərin Qeydi:
                                </label>
                                <div className="p-3 bg-gray-100 rounded-md border border-gray-200">
                                    <p className="text-gray-800 whitespace-pre-wrap">{initialData.comment}</p>
                                </div>
                            </div>
                        )
                    )}

                    {isEditing && initialData?.history?.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-md font-semibold text-gray-700 mb-3">Dəyişiklik Tarixçəsi</h4>
                            <Timeline>
                                {initialData.history.map((entry, index) => (
                                    <Timeline.Item key={index}>
                                        <p className="text-sm text-gray-600">
                                            <strong>{entry.updated_by_name}</strong> tərəfindən dəyişdirildi
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {formatForHistory(entry.timestamp)}
                                        </p>
                                        <div className="mt-1">
                                            <span className="text-red-500 line-through">{entry.previous_score} bal</span>
                                            <span className="mx-2">→</span>
                                            <span className="text-green-600 font-bold">{entry.new_score} bal</span>
                                        </div>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        </div>
                    )}
                </div>
            </Form>
        </Modal>
    );
};

export default UserEvaluationModal;