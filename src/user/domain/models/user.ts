export class User {
    constructor(
        public email: string,
        public passwordHash: string,
        public username: string,
        public id_user?: number,
        public createdAt?: Date
    ) {}
}