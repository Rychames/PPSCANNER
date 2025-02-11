export interface SuccessResponse<Obj> {
    success: true;
    message: string;
    loading: boolean;
    data: Obj;
    error: null;
}
  
export interface ErrorResponse {
    success: false;
    message: string;
    loading: boolean;
    data: null;
    error: string[];
}