import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import feedsReducer, { getFeeds, TFeedsState } from './feedsSlice';
import { TOrdersData } from '@utils-types';
import { getFeedsApi } from '@api';

jest.mock('@api');

const mockFeedsData: TOrdersData = {
  orders: [
    {
      _id: '1',
      status: 'done',
      name: 'Order 1',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      number: 1,
      ingredients: ['ingredient1', 'ingredient2']
    }
  ],
  total: 100,
  totalToday: 10
};

describe('feedsSlice', () => {
  let store: EnhancedStore<{ feeds: TFeedsState }>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        feeds: feedsReducer,
      }
    });
  });

  it('должен вернуть начальное состояние', () => {
    const initialState: TFeedsState = {
      orders: [],
      total: 0,
      totalToday: 0,
      feedsRequesting: false,
      feedsError: null
    };
    expect(store.getState().feeds).toEqual(initialState);
  });

  it('должен обрабатывать getFeeds.pending', () => {
    store.dispatch({ type: getFeeds.pending.type });
    expect(store.getState().feeds.feedsRequesting).toBe(true);
  });

  it('должен обрабатывать getFeeds.fulfilled', async () => {
    (getFeedsApi as jest.Mock).mockResolvedValueOnce(mockFeedsData);

    await store.dispatch(getFeeds() as any);

    const state = store.getState().feeds;
    expect(state.feedsRequesting).toBe(false);
    expect(state.orders).toEqual(mockFeedsData.orders);
    expect(state.total).toBe(mockFeedsData.total);
    expect(state.totalToday).toBe(mockFeedsData.totalToday);
  });

  it('должен обрабатывать getFeeds.rejected', async () => {
    const errorMessage = 'Ошибка загрузки';
    (getFeedsApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(getFeeds() as any);

    const state = store.getState().feeds;
    expect(state.feedsRequesting).toBe(false);
    expect(state.feedsError).toBe(errorMessage);
  });
});
