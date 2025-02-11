export interface SendFormUserManagerModel {
    role: UserRole;
    is_active: boolean;
}

export interface SendFormUserModel {
    profile_image: File;
    first_name: string;
    last_name: string;
}

export interface UserModel {
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
      return this.role === 'ADMIN';
    };
  
    user.isModerator = function () {
      return this.role === 'MODERATOR' || this.role === 'ADMIN';
    };
  
    user.isCommon = function () {
      return this.role === 'COMMON';
    };

    return user;
  }

export interface ApiError {
    message: string;
    status?: number;
    data?: unknown;
}

export function isApiError(error: unknown): error is ApiError {
    return typeof error === 'object' && error !== null && 'message' in error;
}

export function handleError(error: unknown): ApiError {
    if (isApiError(error)) return error;
    if (error instanceof Error) return { message: error.message };
    return { message: 'Erro desconhecido' };
}
