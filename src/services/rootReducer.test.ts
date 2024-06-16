import { expect, test, describe } from '@jest/globals';
import { rootReducer } from './rootReducer';
import ingredientsReducer from '../slices/ingredientsSlice';
import constructorReducer from '../slices/constructorSlice';
import userReducer from '../slices/userSlice';
import feedsReducer from '../slices/feedsSlice';
import orderReducer from '../slices/orderSlice';
import orderDetails from '../slices/orderDetailsSlice';


describe('rootReducer', () => {
  it('initializes state correctly', () => {
    const initAction = { type: '@@INIT' };
    const state = rootReducer(undefined, initAction);

    expect(state).toEqual({
      burgerIngredients: ingredientsReducer(undefined, initAction),
      constructorItems: constructorReducer(undefined, initAction),
      user: userReducer(undefined, initAction),
      feeds: feedsReducer(undefined, initAction),
      order: orderReducer(undefined, initAction),
      orderDetails: orderDetails(undefined, initAction)
    })
  });

  it('handles unknown action', ()  => {
    const unknownAction = { type: '@@UNKNOWN_ACTION'  };
    const state = rootReducer(undefined, unknownAction);

    expect(state).toEqual({
      burgerIngredients: ingredientsReducer(undefined, unknownAction),
      constructorItems: constructorReducer(undefined, unknownAction),
      user: userReducer(undefined, unknownAction),
      feeds: feedsReducer(undefined, unknownAction),
      order: orderReducer(undefined, unknownAction),
      orderDetails: orderDetails(undefined, unknownAction)
    })
  })
});
