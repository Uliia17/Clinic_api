export interface IPaginatedResponse<T> {
    data: T[];
    totalItems: number;
    totalPages: number;
    prevPage: boolean; // булевий — є попередня сторінка
    nextPage: boolean; // булевий — є наступна сторінка
    page: number;
    pageSize: number;
}
