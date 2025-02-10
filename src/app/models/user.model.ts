export interface SendFormUserManagerModel{
    role: 'COMMON' | 'MODERATOR' | 'ADMIN',
    is_active: boolean,
}

export interface SendFormUserModel{
    profile_image: File,
    first_name: string,
    last_name: string,
}

export interface UserModel{
    id?: number,
    profile_image: string,
    email: string,
    first_name: string,
    last_name: string,
    role: UserRole,
    is_active: boolean,

    isAdmin(): boolean;
    isModerator(): boolean;
    isCommon(): boolean;
}

export type UpdateSendFormUserManagerModel = Partial<SendFormUserManagerModel>;
export type UpdateSendFormUserModel = Partial<SendFormUserModel>;

export type UserRole = 'COMMON' | 'MODERATOR' | 'ADMIN';

export function userExtras(user: UserModel): UserModel {

    user.isAdmin = function () {
        if (user?.role === 'ADMIN'){
            return true
        }
        return false
    }

    user.isModerator = function () {
        if (user?.role === 'MODERATOR'){
            return true
        }
        else if (user?.role === 'ADMIN'){
            return true
        }
        return false
    }

    user.isCommon = function () {
        if (user?.role === 'COMMON'){
            return true
        }
        return false
    }

    return user

}

export function isAdmin(user: UserModel | null): boolean {
    if (user?.role === 'ADMIN'){
        return true
    }
    return false
}

export function isModerator(user: UserModel | null): boolean {
    if (user?.role === 'MODERATOR'){
        return true
    }
    else if (user?.role === 'ADMIN'){
        return true
    }
    return false
}

export function isCommon(user: UserModel | null): boolean {
    if (user?.role === 'COMMON'){
        return true
    }
    return false
}


