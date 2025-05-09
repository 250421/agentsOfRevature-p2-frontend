export interface Auth {
    id: number;
    username: string;
    role: "user" | "admin";
}