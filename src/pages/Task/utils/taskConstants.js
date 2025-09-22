import dayjs from 'dayjs';

export const STATUS_COLORS = {
  Gözləmədə: 'orange', Təsdiqlənib: 'green', 'Davam edir': 'processing', Tamamlanıb: 'success', 'Ləğv edilib': 'red'
};

export const PRIORITY_COLORS = {
  'Çox vacib': 'red', Yüksək: 'volcano', Orta: 'gold', Aşağı: 'lime'
};

export const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Gözləmədə' }, { value: 'TODO', label: 'Təsdiqlənib' },
  { value: 'CANCELLED', label: 'Ləğv edilib' },{ value: 'IN_PROGRESS', label: 'Davam edir' },
  { value: 'DONE', label: 'Tamamlanıb' }
];

export const PRIORITY_OPTIONS = [
  { value: 'CRITICAL', label: 'Çox vacib' }, { value: 'HIGH', label: 'Yüksək' },
  { value: 'MEDIUM', label: 'Orta' }, { value: 'LOW', label: 'Aşağı' }
];

export const STATUS_TRANSITIONS = {
  'TODO': { next: 'IN_PROGRESS', label: 'İcraya başla', color: 'processing' },
  'IN_PROGRESS': { next: 'DONE', label: 'Tamamla', color: 'success' }
};


// Form konfiqurasiyasını funksiya edirik ki, dinamik olsun
export const getFormConfig = (users, usersLoading, permissions) => {
  const allFields = [
    { name: 'title', label: 'Başlıq', type: 'text', rules: [{ required: true, message: 'Başlıq daxil edin!' }], span: 24 },
    { name: 'description', label: 'Təsvir', type: 'textarea', span: 24 },
    { name: 'start_date', label: 'Başlama tarixi', type: 'datepicker', span: 12 },
    { name: 'due_date', label: 'Bitmə tarixi', type: 'datepicker', span: 12 },
    { 
      name: 'assignee', label: 'İcraçı', type: 'select', rules: [{ required: true, message: 'İcraçı seçin!' }], 
      options: users.map(user => ({
        value: user.id,
        label: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username
      })), 
      loading: usersLoading, span: 12 
    },
    { name: 'priority', label: 'Prioritet', type: 'select', rules: [{ required: true, message: 'Prioritet seçin!' }], options: PRIORITY_OPTIONS, span: 12 }
  ];

  if (permissions?.userRole === 'admin' || permissions?.userRole === 'top_management') {
    allFields.splice(4, 0, { 
        name: 'status',
        label: 'Status',
        type: 'select',
        options: STATUS_OPTIONS,
        span: 12
    });
  }

  // Sahələri icazələrə görə gizlət
  const hiddenFields = permissions.formConfig?.hideFields || [];
  return allFields.filter(field => !hiddenFields.includes(field.name));
};

// Detallar üçün
export const generateDetailsItems = (record) => !record ? [] : [
    { key: 'title', label: 'Başlıq', value: record.title },
    { key: 'description', label: 'Təsvir', value: record.description || '-' },
    { key: 'assignee', label: 'İcraçı', value: record.assignee_details || '-' },
    { key: 'created_by', label: 'Yaradan', value: record.created_by_details || '-' },
    { key: 'priority', label: 'Prioritet', value: record.priority_display || '-' },
    { key: 'status', label: 'Status', value: record.status_display || '-' },
    { key: 'start_date', label: 'Başlama tarixi', value: record.start_date ? dayjs(record.start_date).format('DD MMMM YYYY') : '-' },
    { key: 'due_date', label: 'Bitmə tarixi', value: record.due_date ? dayjs(record.due_date).format('DD MMMM YYYY') : '-' },
    { key: 'created_at', label: 'Yaradılma tarixi', value: record.created_at ? dayjs(record.created_at).format('DD MMMM YYYY HH:mm') : '-' }
];