import axios from 'axios';

const API_BASE_URL = 'http://localhost:8089/api'; // Replace with your actual API base URL

export interface Document {
    id: number;
    title: string;
    text: string;
}

export const api = {
    async addDocument(document: Omit<Document, 'id'>): Promise<Document> {
        const response = await axios.post(`${API_BASE_URL}/documents`, document);
        return response.data;
    },

    async searchDocuments(query: string, maxResults: number = 3, algo: string = 'tfidf'): Promise<Document[]> {
        const response = await axios.get(`${API_BASE_URL}/documents/search`, {
            params: { query, maxResults, algo }
        });
        return response.data;
    },

    async getDocument(id: number): Promise<Document> {
        const response = await axios.get(`${API_BASE_URL}/documents/${id}`);
        return response.data;
    },

    async deleteDocument(id: number): Promise<void> {
        await axios.delete(`${API_BASE_URL}/documents/${id}`);
    }
};
