// utils/getBaseUrl.ts
export function getBaseUrl(): string {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    return apiUrl.replace(/\/api\/?$/, '');
}