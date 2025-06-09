'use client';

import React,{ useState } from 'react';
import api from '@/lib/api'; // Your authenticated Axios instance
import axios from 'axios';

type NotificationFormState = {
    message: string;
};

export default function NotificationForm() {
    const [formData, setFormData] = useState<NotificationFormState>({ message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ message: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await api.post('/notifications/', formData); // token auto-attached by interceptor
            setFormData({ message: '' });
            setSuccess('Notification sent successfully!');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.error('Error sending notification:', err);
                setError(err.response?.data?.detail || 'Failed to send notification');
            } else {
                console.error('Unexpected error:', err);
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded space-y-4">
            <h2 className="text-xl font-bold">Send a Notification</h2>

            <div>
                <label htmlFor="message" className="block font-medium">Message</label>
                <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {loading ? 'Sending...' : 'Send Notification'}
            </button>

            {success && <p className="text-green-600">{success}</p>}
            {error && <p className="text-red-600">{error}</p>}
        </form>
    );
}
