export interface UserInterface {
    id: number;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
    __type: 'User';
}
