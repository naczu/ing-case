import { createStore } from 'redux';
import { loadState, saveState } from '../utils/localStorage.js';

const initialState = {
  employees: [],
  displayMode: 'table',
  currentPage: 1,
  itemsPerPage: 10,
  searchQuery: '',
  initialized: false,
  error: null,
  locale: 'en'
};

function reducer(state = loadState() || initialState, action) {
  let newState;
  
  switch (action.type) {
    case 'INIT_APPLICATION':
      newState = {
        ...state,
        initialized: true,
        error: null
      };
      break;

    case 'ADD_EMPLOYEE':
      newState = {
        ...state,
        employees: [...state.employees, { ...action.payload, id: Date.now() }]
      };
      break;

    case 'UPDATE_EMPLOYEE':
      newState = {
        ...state,
        employees: state.employees.map(emp => 
          emp.id === action.payload.id ? action.payload : emp
        )
      };
      break;

    case 'DELETE_EMPLOYEE':
      newState = {
        ...state,
        employees: state.employees.filter(emp => emp.id !== action.payload)
      };
      break;

    case 'SET_DISPLAY_MODE':
      newState = {
        ...state,
        displayMode: action.payload
      };
      break;

    case 'SET_CURRENT_PAGE':
      newState = {
        ...state,
        currentPage: action.payload
      };
      break;

    case 'SET_SEARCH_QUERY':
      newState = {
        ...state,
        searchQuery: action.payload,
        currentPage: 1
      };
      break;

    case 'SET_ERROR':
      newState = {
        ...state,
        error: action.payload
      };
      break;

    case 'SET_LOCALE':
      newState = {
        ...state,
        locale: action.payload
      };
      break;

    default:
      return state;
  }

  saveState(newState);
  return newState;
}

export const store = createStore(reducer);