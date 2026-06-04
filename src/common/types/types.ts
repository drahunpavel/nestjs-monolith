export type User = {
    id: number;
    email: string;
}

export type ProductWithBrand = {
    id: number;
    title: string;
    description: string;
    brand: {
        title: string;
    };
}