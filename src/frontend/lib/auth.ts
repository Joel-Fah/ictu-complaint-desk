export const logout = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/auth/logout/', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            localStorage.removeItem('access_token');
            window.location.href = '/';
        } else {
            console.error('Failed to log out:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred during logout:', error);
    }
};