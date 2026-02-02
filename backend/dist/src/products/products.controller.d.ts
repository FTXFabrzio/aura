import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getProducts(): Promise<{
        id: number;
        name: string;
        slug: string;
        apiKeySecret: string;
        createdAt: Date | null;
    }[]>;
    createProduct(body: {
        name: string;
        slug: string;
        apiKeySecret: string;
    }): Promise<{
        id: number;
        name: string;
        slug: string;
        apiKeySecret: string;
        createdAt: Date | null;
    }>;
}
