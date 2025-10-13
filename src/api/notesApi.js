import apiService from "./apiService";

const notesApi = {
  getNotes: (params) => {
    return apiService.get('/tasks/notes/', { params });
  },

  saveNote: (noteData) => {
    if (noteData.id) {
      return apiService.put(`/tasks/notes/${noteData.id}/`, noteData);
    }
    return apiService.post('/tasks/notes/', noteData);
  },

  deleteNote: (noteId) => {
    return apiService.delete(`/tasks/notes/${noteId}/`);
  },
};

export default notesApi;