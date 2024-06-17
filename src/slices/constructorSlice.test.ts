import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructorIngredients,
} from './constructorSlice';
import { TConstructorIngredient } from '@utils-types';

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: [] as TConstructorIngredient[],
  };

  it('should handle initial state', () => {
    expect(constructorReducer(undefined, { type: '@@UNKNOWN_ACTION' })).toEqual(initialState);
  });

  it('should handle addIngredient for bun', () => {
    const bun: TConstructorIngredient = {
      id: '1',
      _id: '1',
      name: 'Bun',
      type: 'bun',
      proteins: 10,
      fat: 20,
      carbohydrates: 30,
      calories: 400,
      price: 5,
      image: 'bun.png',
      image_large: 'bun_large.png',
      image_mobile: 'bun_mobile.png'
    };
    const actual = constructorReducer(initialState, addIngredient(bun));
    expect(actual.bun).toEqual(bun);
    expect(actual.ingredients).toEqual([]);
  });

  it('should handle addIngredient for non-bun', () => {
    const ingredient: TConstructorIngredient = {
      id: '2',
      _id: '2',
      name: 'Sauce',
      type: 'sauce',
      proteins: 5,
      fat: 5,
      carbohydrates: 5,
      calories: 100,
      price: 2,
      image: 'sauce.png',
      image_large: 'sauce_large.png',
      image_mobile: 'sauce_mobile.png'
    };
    const actual = constructorReducer(initialState, addIngredient(ingredient));
    expect(actual.ingredients).toEqual([ingredient]);
    expect(actual.bun).toBeNull();
  });

  it('should handle removeIngredient', () => {
    const initialStateWithIngredients = {
      bun: null,
      ingredients: [{
        id: '2',
        _id: '2',
        name: 'Sauce',
        type: 'sauce',
        proteins: 5,
        fat: 5,
        carbohydrates: 5,
        calories: 100,
        price: 2,
        image: 'sauce.png',
        image_large: 'sauce_large.png',
        image_mobile: 'sauce_mobile.png'
      }]
    };
    const actual = constructorReducer(initialStateWithIngredients, removeIngredient({ id: '2' }));
    expect(actual.ingredients).toEqual([]);
  });

  it('should handle moveIngredientUp', () => {
    const initialStateWithIngredients = {
      bun: null,
      ingredients: [
        {
          id: '1',
          _id: '1',
          name: 'Sauce 1',
          type: 'sauce',
          proteins: 5,
          fat: 5,
          carbohydrates: 5,
          calories: 100,
          price: 2,
          image: 'sauce1.png',
          image_large: 'sauce1_large.png',
          image_mobile: 'sauce1_mobile.png'
        },
        {
          id: '2',
          _id: '2',
          name: 'Sauce 2',
          type: 'sauce',
          proteins: 5,
          fat: 5,
          carbohydrates: 5,
          calories: 100,
          price: 2,
          image: 'sauce2.png',
          image_large: 'sauce2_large.png',
          image_mobile: 'sauce2_mobile.png'
        }
      ]
    };
    const actual = constructorReducer(initialStateWithIngredients, moveIngredientUp({ index: 1 }));
    expect(actual.ingredients).toEqual([
      {
        id: '2',
        _id: '2',
        name: 'Sauce 2',
        type: 'sauce',
        proteins: 5,
        fat: 5,
        carbohydrates: 5,
        calories: 100,
        price: 2,
        image: 'sauce2.png',
        image_large: 'sauce2_large.png',
        image_mobile: 'sauce2_mobile.png'
      },
      {
        id: '1',
        _id: '1',
        name: 'Sauce 1',
        type: 'sauce',
        proteins: 5,
        fat: 5,
        carbohydrates: 5,
        calories: 100,
        price: 2,
        image: 'sauce1.png',
        image_large: 'sauce1_large.png',
        image_mobile: 'sauce1_mobile.png'
      }
    ]);
  });

  it('should handle moveIngredientDown', () => {
    const initialStateWithIngredients = {
      bun: null,
      ingredients: [
        {
          id: '1',
          _id: '1',
          name: 'Sauce 1',
          type: 'sauce',
          proteins: 5,
          fat: 5,
          carbohydrates: 5,
          calories: 100,
          price: 2,
          image: 'sauce1.png',
          image_large: 'sauce1_large.png',
          image_mobile: 'sauce1_mobile.png'
        },
        {
          id: '2',
          _id: '2',
          name: 'Sauce 2',
          type: 'sauce',
          proteins: 5,
          fat: 5,
          carbohydrates: 5,
          calories: 100,
          price: 2,
          image: 'sauce2.png',
          image_large: 'sauce2_large.png',
          image_mobile: 'sauce2_mobile.png'
        }
      ]
    };
    const actual = constructorReducer(initialStateWithIngredients, moveIngredientDown({ index: 0 }));
    expect(actual.ingredients).toEqual([
      {
        id: '2',
        _id: '2',
        name: 'Sauce 2',
        type: 'sauce',
        proteins: 5,
        fat: 5,
        carbohydrates: 5,
        calories: 100,
        price: 2,
        image: 'sauce2.png',
        image_large: 'sauce2_large.png',
        image_mobile: 'sauce2_mobile.png'
      },
      {
        id: '1',
        _id: '1',
        name: 'Sauce 1',
        type: 'sauce',
        proteins: 5,
        fat: 5,
        carbohydrates: 5,
        calories: 100,
        price: 2,
        image: 'sauce1.png',
        image_large: 'sauce1_large.png',
        image_mobile: 'sauce1_mobile.png'
      }
    ]);
  });

  it('should handle clearConstructorIngredients', () => {
    const initialStateWithIngredients = {
      bun: {
        id: '1',
        _id: '1',
        name: 'Bun',
        type: 'bun',
        proteins: 10,
        fat: 20,
        carbohydrates: 30,
        calories: 400,
        price: 5,
        image: 'bun.png',
        image_large: 'bun_large.png',
        image_mobile: 'bun_mobile.png'
      },
      ingredients: [{
        id: '2',
        _id: '2',
        name: 'Sauce',
        type: 'sauce',
        proteins: 5,
        fat: 5,
        carbohydrates: 5,
        calories: 100,
        price: 2,
        image: 'sauce.png',
        image_large: 'sauce_large.png',
        image_mobile: 'sauce_mobile.png'
      }]
    };
    const actual = constructorReducer(initialStateWithIngredients, clearConstructorIngredients());
    expect(actual).toEqual(initialState);
  });
});
