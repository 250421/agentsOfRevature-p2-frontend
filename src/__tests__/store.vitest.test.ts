import { describe, it, expect, beforeEach, vi } from 'vitest';
import useStore, { setState as directSetState, getState as directGetState, type Store } from '../store';

describe('Zustand Store (useStore)', () => {
  const getStoreState = () => useStore.getState();

  beforeEach(() => {
    // Reset the store to its initial state before each test
    // We use the direct setState export for this, ensuring a clean slate.
    directSetState({
      loggedIn: false,
      username: '',
    });
    // Clear any mock call history if we were spying on actions (not strictly needed here yet)
    vi.clearAllMocks(); 
  });

  it('should have correct initial state', () => {
    const state = getStoreState();
    expect(state.loggedIn).toBe(false);
    expect(state.username).toBe('');
  });

  it('login action should set loggedIn to true', () => {
    const { login } = getStoreState();
    login();
    expect(getStoreState().loggedIn).toBe(true);
  });

  it('logout action should set loggedIn to false', () => {
    // First, set to loggedIn true to test logout
    directSetState({ loggedIn: true });
    
    const { logout } = getStoreState();
    logout();
    expect(getStoreState().loggedIn).toBe(false);
  });

  it('setUsername action should update username', () => {
    const { setUsername } = getStoreState();
    const newUsername = 'Agent007';
    setUsername(newUsername);
    expect(getStoreState().username).toBe(newUsername);
  });

  it('login and logout should correctly toggle loggedIn state', () => {
    const { login, logout } = getStoreState();

    // Initial state check (already done in another test, but good for flow)
    expect(getStoreState().loggedIn).toBe(false);

    // Login
    login();
    expect(getStoreState().loggedIn).toBe(true);

    // Logout
    logout();
    expect(getStoreState().loggedIn).toBe(false);
  });

  it('direct getState should return the current state', () => {
    directSetState({ loggedIn: true, username: 'TestUserDirect' });
    const state = directGetState();
    expect(state.loggedIn).toBe(true);
    expect(state.username).toBe('TestUserDirect');
  });
});