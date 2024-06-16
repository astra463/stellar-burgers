import { IngredientsState, getIngredients } from './ingredientsSlice';
import ingredientsReducer from '../slices/ingredientsSlice';

describe('IngredientsSlice', () => {
  const initialState: IngredientsState = {
    ingredients: [],
    loading: false,
    error: undefined
  };

  it('should set loading state', () => {
    const action = { type: getIngredients.pending.type };

    const state = ingredientsReducer(initialState, action);
    
    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: undefined
    });
  });

  it('should set ingredients and reset loading state on fulfilled', () => {
    const ingredients = [{ id: 1, name: 'Bun' }];
    const action = {
      type: getIngredients.fulfilled.type,
      payload: ingredients
    };
    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      ingredients,
      loading: false,
      error: undefined
    });
  });

  it('should set error and reset loading state on rejected', () => {
    const error = 'Error message';
    const action = {
      type: getIngredients.rejected.type,
      error: { message: error }
    };
    const state = ingredientsReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error
    });
  });
});
