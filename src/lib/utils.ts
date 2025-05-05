import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function readableDurationFromRange(startTime: string, endTime: string) {
	const end = new Date(endTime);
    const start = new Date(startTime);
    const durationMs = end.getTime() - start.getTime();
    return readableDuration(durationMs, 'ms');
}

/**
 * 
 * @param duration in second or milliseconds
 * @returns string of readable duration
 */
export function readableDuration(rawDuration: number, type: 's' | 'ms'): string {
	if (rawDuration === 0) return "";
	
	let duration = rawDuration;
	if (type == 's') {
		duration *= 1000;
	}

    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
    const parts = [];
    if (hours) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    if (minutes) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    if (seconds) parts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);
    return parts.join(" ");	
}

/**
 * Convert two date to a range string. If day is the same, only show "day, time - time". but if the day is different, show "day, time - day, time"
 * @param startTime
 * @param endTime
 * @returns string of readable range
 * @example "May 4, 13:00 - 14:00"
 * @example "May 4, 13:00 - May 5, 04:00"
 */
export function readableRange(startTime: string, endTime: string): string {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const startMonth = start.toLocaleString('en-US', { month: 'short' });
    const startDay = start.getDate();
    const startTime12h = start.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const endMonth = end.toLocaleString('en-US', { month: 'short' });
    const endDay = end.getDate();
    const endTime12h = end.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    if (startMonth === endMonth && startDay === endDay) {
        // Same day format
        return `${startMonth} ${startDay}, ${startTime12h} - ${endTime12h}`;
    } else {
        // Different day format
        return `${startMonth} ${startDay}, ${startTime12h} - ${endMonth} ${endDay}, ${endTime12h}`;
    }
}