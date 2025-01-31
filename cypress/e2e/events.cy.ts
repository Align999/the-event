describe('Event Features', () => {
    beforeEach(() => {
      // Setup test user authentication
      cy.intercept('POST', '/auth/v1/token', {
        body: {
          access_token: 'test-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'test-refresh-token'
        }
      });
    });
  
    it('creates a new event', () => {
      cy.visit('/events/new');
      cy.get('input[name="title"]').type('Test Event');
      cy.get('textarea[name="description"]').type('Test Description');
      cy.get('input[name="startDate"]').type('2025-02-01T10:00');
      cy.get('input[name="endDate"]').type('2025-02-01T12:00');
      cy.get('button[type="submit"]').click();
      
      // Assert success message
      cy.contains('Event created successfully');
    });
  
    it('displays event list', () => {
      cy.visit('/events');
      cy.get('[data-testid="event-list"]').should('exist');
    });
  });