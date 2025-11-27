export type CategoriesResponse = {
    id: number;
    name: string;
    description: string;
    status: boolean;
}

export type CategoriesCreate = {
    name: string;
    description: string;
}

export type CategoriesUpdate = {
    id: number;
    name: string;
    description: string;
}

export type CategoriesDelete = {
    id: number;
}