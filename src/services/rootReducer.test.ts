import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import ingredientsReducer from '../slices/ingredientsSlice';
import constructorReducer from '../slices/constructorSlice';
import userReducer from '../slices/userSlice';
import feedsReducer from '../slices/feedsSlice';
import orderReducer from '../slices/orderSlice';
import orderDetailsReducer from '../slices/orderDetailsSlice';

describe('rootReducer', () => {
  it('initializes state correctly', () => {
    const store = configureStore({ reducer: rootReducer });

    const initialState = store.getState();
    expect(initialState).toEqual({
      burgerIngredients: ingredientsReducer(undefined, { type: '@@INIT' }),
      constructorItems: constructorReducer(undefined, { type: '@@INIT' }),
      user: userReducer(undefined, { type: '@@INIT' }),
      feeds: feedsReducer(undefined, { type: '@@INIT' }),
      order: orderReducer(undefined, { type: '@@INIT' }),
      orderDetails: orderDetailsReducer(undefined, { type: '@@INIT' })
    });
  });

  it('handles unknown action', () => {
    const store = configureStore({ reducer: rootReducer });

    store.dispatch({ type: '@@UNKNOWN_ACTION' });

    const stateAfterUnknownAction = store.getState();
    expect(stateAfterUnknownAction).toEqual({
      burgerIngredients: ingredientsReducer(undefined, { type: '@@UNKNOWN_ACTION' }),
      constructorItems: constructorReducer(undefined, { type: '@@UNKNOWN_ACTION' }),
      user: userReducer(undefined, { type: '@@UNKNOWN_ACTION' }),
      feeds: feedsReducer(undefined, { type: '@@UNKNOWN_ACTION' }),
      order: orderReducer(undefined, { type: '@@UNKNOWN_ACTION' }),
      orderDetails: orderDetailsReducer(undefined, { type: '@@UNKNOWN_ACTION' })
    });
  });
});
