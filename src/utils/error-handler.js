export class ApplicationError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'ApplicationError';
    this.originalError = originalError;
  }
}

export function handleInitializationError(error) {
  const errorDetails = {
    message: error.message || 'Unknown error occurred',
    name: error.name || 'Error',
    stack: error.stack,
    originalError: error.originalError
  };

  console.error('Application initialization failed:', errorDetails);
  
  try {
    const { store } = require('../store/store.js');
    store.dispatch({
      type: 'SET_ERROR',
      payload: errorDetails
    });
  } catch (storeError) {
    console.warn('Could not dispatch error to store:', storeError);
  }
  
  return new ApplicationError(
    errorDetails.message,
    error
  );
}