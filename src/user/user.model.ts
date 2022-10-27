
export interface UserDTO {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
    level: string;
}

enum LevelStatus {
    STAFF = 'STAFF',
    PM = 'PM',
    ADMIN = 'ADMIN'
}