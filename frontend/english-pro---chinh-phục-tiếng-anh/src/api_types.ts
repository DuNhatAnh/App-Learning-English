export interface UserStatsResponse {
    completedLessons: number;
    streak: number;
    totalMinutes: number;
    skills: { name: string; value: number }[];
}
