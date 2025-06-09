{/**
 export const setAccessToken = (token: string) => {
 if (typeof window === 'undefined') return null;
 return localStorage.setItem('access_token', token);
 };
 **/}
export const getAccessToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
};
export const removeAccessToken = ( ) => {
    if (typeof window === 'undefined') return null;
    return localStorage.removeItem('access_token');
};