import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import orderDetailsReducer, { getOrderDetails, OrderDetailState, clearOrderDetails } from './orderDetailsSlice';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

jest.mock('@api');

const mockOrderData: { orders: TOrder[] } = {
  orders: [
    {
      _id: '1',
      status: 'done',
      name: 'Order 1',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-02',
      number: 12345,
      ingredients: ['1', '2', '3']
    }
  ]
};

describe('orderDetailsSlice', () => {
  let store: EnhancedStore<{ orderDetail: OrderDetailState }>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        orderDetail: orderDetailsReducer,
      }
    });
  });

  it('должен вернуть начальное состояние', () => {
    const initialState: OrderDetailState = {
      order: null,
      loading: false,
      error: null,
      orderIngredients: []
    };
    expect(store.getState().orderDetail).toEqual(initialState);
  });

  it('должен обрабатывать getOrderDetails.pending', () => {
    store.dispatch({ type: getOrderDetails.pending.type });
    const state = store.getState().orderDetail;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать getOrderDetails.fulfilled', async () => {
    (getOrderByNumberApi as jest.Mock).mockResolvedValueOnce(mockOrderData);

    await store.dispatch(getOrderDetails(12345) as any);

    const state = store.getState().orderDetail;
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.order).toEqual(mockOrderData.orders[0]);
    expect(state.orderIngredients).toEqual(mockOrderData.orders[0].ingredients);
  });

  it('должен обрабатывать getOrderDetails.rejected', async () => {
    const errorMessage = 'Ошибка загрузки заказа';
    (getOrderByNumberApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(getOrderDetails(12345) as any);

    const state = store.getState().orderDetail;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('должен обрабатывать clearOrderDetails', () => {
    store.dispatch(clearOrderDetails());
    const state = store.getState().orderDetail;
    expect(state.order).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orderIngredients).toEqual([]);
  });
});
