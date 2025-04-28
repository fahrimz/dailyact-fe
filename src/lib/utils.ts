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