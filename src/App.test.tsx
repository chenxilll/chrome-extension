import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import * as sinon from 'sinon';
import * as chrome from 'sinon-chrome';
import 'jest-sinon';
import App from './App';

(global as any).chrome = chrome;

describe('App', () => {
  afterEach(() => {
    chrome.flush();
  });

  test('renders logo', () => {
    render(<App />);
    expect(screen.getByText('Tabs')).toBeInTheDocument();
  });  

  test('filters tabs based on selected thresholds', async () => {
    // Mock the storage local get method
    const getMock = jest.spyOn(chrome.storage.local, 'get');
    getMock.mockImplementation((keys, callback) => {
      callback({ tabs: [] }); // Mocking an empty tab list
    });

    // Render the app
    render(<App />);

    // Check if the logo is rendered
    expect(screen.getByText('Tabs')).toBeInTheDocument();

    // Simulate clicking on threshold buttons
    fireEvent.click(screen.getByText('Over a week'));
    fireEvent.click(screen.getByText('More than half a day'));
    fireEvent.click(screen.getByText('More than 20s'));
    fireEvent.click(screen.getByText('More than 10s'));
    fireEvent.click(screen.getByText('Recent'));

    // Restore the original implementation of chrome storage local get
    getMock.mockRestore();
  });
});
