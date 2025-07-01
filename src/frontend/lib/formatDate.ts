import { format, formatDistanceToNow, isThisWeek, isToday } from 'date-fns'

export function formatComplaintDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString)

    const diff = Date.now() - date.getTime()
    const minutes = diff / (1000 * 60)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${Math.floor(minutes)} mins ago`
    if (minutes < 1440) return formatDistanceToNow(date, { addSuffix: true }) // e.g. "4 hours ago"
    if (isToday(date)) return 'today'
    if (isThisWeek(date)) return 'this week'

    // Else fallback to a full date
    return format(date, 'd/M/yyyy') // e.g. 29/4/2025
}
