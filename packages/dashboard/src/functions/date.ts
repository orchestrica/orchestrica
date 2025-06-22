/**
 * 주어진 Date를 YYYY-MM-DD 형태로 반환
 * @param date 
 * @returns 
 */
export function formatDateToYYYYMMDD(date: Date | string | number): string {
    const targetDate = new Date(date);
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * 주어진 Date로부터 현재까지의 경과 시간을 상대시간 형태로 반환한다.
 * @param date Date 인스턴스
 * @returns "x minutes ago" | "x hours ago" | "x days ago" 등
 */
export function timeAgo(date: Date | string | number): string {
    const now = new Date();
    const targetDate = new Date(date);
    const diffMs = now.getTime() - targetDate.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    return `${days} day${days !== 1 ? 's' : ''} ago`;
}