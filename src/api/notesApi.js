import apiClient from './apiClient'; 

const notesApi = {
  getNotes: (params) => {
    return apiClient.get('/tasks/notes/', { params });
  },

  saveNote: (noteData) => {
    if (noteData.id) {
      return apiClient.put(`/tasks/notes/${noteData.id}/`, noteData);
    }
    return apiClient.post('/tasks/notes/', noteData);
  },

  deleteNote: (noteId) => {
    return apiClient.delete(`/tasks/notes/${noteId}/`);
  },
};

export default notesApi;