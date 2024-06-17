import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import orderReducer, { placeOrder, clearOrder, TInitialState } from './orderSlice';
import { orderBurgerApi } from '@api';

jest.mock('@api');

const localStorageMock = (function () {
  let store: { [key: string]: string } = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

const mockOrderData = {
  name: 'Order 1',
  order: {
    _id: '1',
    status: 'done',
    name: 'Order 1',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-02',
    number: 12345,
    ingredients: ['3', '8', '8']
  }
};

describe('orderSlice', () => {
  let store: EnhancedStore<{ order: TInitialState }>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        order: orderReducer,
      }
    });
  });

  it('должен вернуть начальное состояние', () => {
    const initialState: TInitialState = {
      isPending: false,
      name: '',
      order: null
    };
    expect(store.getState().order).toEqual(initialState);
  });

  it('должен обрабатывать placeOrder.pending', () => {
    store.dispatch({ type: placeOrder.pending.type });
    const state = store.getState().order;
    expect(state.isPending).toBe(true);
  });

  it('должен обрабатывать placeOrder.fulfilled', async () => {
    (orderBurgerApi as jest.Mock).mockResolvedValueOnce(mockOrderData);

    await store.dispatch(placeOrder(['3', '8', '8']) as any);

    const state = store.getState().order;
    expect(state.isPending).toBe(false);
    expect(state.name).toBe(mockOrderData.name);
    expect(state.order).toEqual(mockOrderData.order);
  });

  it('должен обрабатывать placeOrder.rejected', async () => {
    (orderBurgerApi as jest.Mock).mockRejectedValueOnce(new Error('Ошибка заказа'));

    await store.dispatch(placeOrder(['3', '8', '8']) as any);

    const state = store.getState().order;
    expect(state.isPending).toBe(false);
  });

  it('должен обрабатывать clearOrder', () => {
    store.dispatch(clearOrder());
    const state = store.getState().order;
    expect(state.order).toBeNull();
    expect(state.name).toBe('');
    expect(state.isPending).toBe(false);
  });
});
