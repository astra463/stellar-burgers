import { setCookie } from '../../src/utils/cookie';
describe('Конструктор работает корректно', () => {
  beforeEach(() => {
    // Перехват запроса и передача моковых данных
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  it('Булки добавляются корректно', () => {
    cy.get('[data-cy=ingredient-8').within(() => {
      cy.get('button').click();
    });

    // Проверяем, что появилась булочка вверху
    cy.get('[data-cy="bun-top"]')
      .should('exist')
      .within(() => {
        cy.get('.constructor-element__text').should(
          'contain',
          'Ингредиент 8 (верх)'
        );
      });

    // Проверяем, что появилась булочка внизу
    cy.get('[data-cy="bun-bottom"]')
      .should('exist')
      .within(() => {
        cy.get('.constructor-element__text').should(
          'contain',
          'Ингредиент 8 (низ)'
        );
      });
  });

  it('Ингредиенты добавляются корректно', () => {
    cy.get('[data-cy=ingredient-3').within(() => {
      cy.get('button').click();
    });

    cy.get('[data-cy="bun-ingredient-3"]')
      .should('exist')
      .within(() => {
        cy.get('.constructor-element__text').should('contain', 'Ингредиент 3');
      });
  });

  it('Модальное окно ингредиента открывается и закрывается по нажатию на крестик', () => {
    cy.get('[data-cy=ingredient-3').click();
    cy.get('[data-cy="Modal"]')
      .should('exist')
      .within(() => {
        cy.get('h3').should('contain', 'Ингредиент 3');
      });

    cy.get('[data-cy="closeModal"]').click();
    cy.get('[data-cy="Modal"]').should('not.exist');
  });

  it('Модальное окно ингредиента открывается и закрывается по нажатию на оверлей', () => {
    cy.get('[data-cy=ingredient-3').click();
    cy.get('[data-cy="Modal"]').should('exist');

    cy.get('[data-cy="modalOverlay"]').click('top', { force: true });
    cy.get('[data-cy="Modal"]').should('not.exist');
  });
});

describe('Оформление заказа происходит корректно', () => {
  beforeEach(() => {
    // Перехват запроса и передача моковых данных
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '/api/auth/user', { fixture: 'auth.json' }).as('auth');
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as('order');
    cy.visit('http://localhost:4000');
    window.localStorage.setItem('refreshToken', JSON.stringify('testRefresh'));
    cy.setCookie('accessToken', 'testAccess');
  });

  it('Оформляем заказ', () => {
    cy.get('[data-cy=ingredient-8').within(() => {
      cy.get('button').click();
    });
    cy.log('Добавили булочки');

    cy.get('[data-cy=ingredient-3').within(() => {
      cy.get('button').click();
    });
    cy.log('Добавили ингредиент');

    cy.get('[data-cy="orderButton"]').click();
    cy.log('Нажали кнопку оформления заказа');

    cy.wait('@order')
      .its('request.body')
      .should('deep.equal', { ingredients: ['3', '8', '8'] });
    cy.log('Запрос на сервер выполнен');

    cy.get('[data-cy="orderNumber"]').should('contain', '42682');

    cy.get('[data-cy="closeModal"]').click();
    cy.get('[data-cy="Modal"]').should('not.exist');

    cy.get('[data-cy="burger-constructor"]').within(() => {
      cy.get('div').should('contain', 'Выберите булки');
      cy.get('ul').should('contain', 'Выберите начинку');
    });
  });
});
