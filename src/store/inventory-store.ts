import { create } from 'zustand';

import { productBatchesSeed, storeProducts } from '../data/products';
import type { InventoryProduct, ProductBatch } from '../types/inventory';

// El backend de la tienda todavia no expone el bootstrap de inventario, por eso
// el store arranca con la misma semilla que usa la app movil y solo reemplaza
// los datos si la llamada llega a responder.
type InventoryState = {
    batches: ProductBatch[];
    isLoading: boolean;
    products: InventoryProduct[];
    loadInventory: () => Promise<void>;
    setInventory: (products: InventoryProduct[], batches: ProductBatch[]) => void;
};

export const useInventoryStore = create<InventoryState>((set) => ({
    batches: productBatchesSeed,
    isLoading: false,
    products: storeProducts,
    loadInventory: async () => {
        set({ isLoading: true });
        try {
            const bootstrap = await getStoreBootstrap();
            set({ batches: bootstrap.batches, isLoading: false, products: bootstrap.products });
        } catch {
            // Se conserva la semilla local cuando el endpoint no esta disponible.
            set({ isLoading: false });
        }
    },
    setInventory: (products, batches) => set(() => ({ batches, products })),
}));

type StoreBootstrap = {
    products: InventoryProduct[];
    batches: ProductBatch[];
};

const getStoreBootstrap = async (): Promise<StoreBootstrap> => {
    const Get = (await import('../api/Methodget')).default;
    //prettier-ignore
    const response = await Get<{ detail: StoreBootstrap }>('/api/AdminStore/Bootstrap');
    return response.detail;
};
