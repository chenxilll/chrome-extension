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

  it('renders Tab Collector header', async () => {
    chrome.storage.local.get.withArgs('tabs').yields({ tabs: [] });

    render(<App />);
    const headerElement = await screen.findByText(/Tab Collector/i);
    expect(headerElement).toBeInTheDocument();

    expect(chrome.storage.local.get).toHaveBeenCalledWith('tabs');
  });

  it('renders sample tab when tabs are undefined in chrome storage', async () => {
    chrome.storage.local.get.withArgs('tabs').yields({ tabs: undefined });

    render(<App />);
    const tabElements = await screen.findAllByRole('listitem');
    expect(tabElements).toHaveLength(1);
    expect(tabElements[0]).toHaveTextContent('Sample tab');
  });

  it('renders tabs from chrome storage', async () => {
    const mocktabs = [
      { id: 1, text: 'Tab 1' },
      { id: 2, text: 'Tab 2' },
    ];
    chrome.storage.local.get.withArgs('tabs').yields({ tabs: mocktabs });

    render(<App />);
    const tabElements = await screen.findAllByRole('listitem');
    expect(tabElements).toHaveLength(2);
    expect(tabElements[0]).toHaveTextContent('Tab 1');
    expect(tabElements[1]).toHaveTextContent('Tab 2');
  });

  it('updates tab in chrome storage when edited', async () => {
    const mocktabs = [
      { id: 1, text: 'Sample tab' },
      { id: 2, text: 'Tab 2' },
    ];
    chrome.storage.local.get.withArgs('tabs').yields({ tabs: mocktabs });

    render(<App />);
    const editButtons = await screen.findAllByText('Edit');
    expect(editButtons).toHaveLength(2);
    const editButton = editButtons[0];
    fireEvent.click(editButton);

    const textArea = await screen.findByDisplayValue('Sample tab');
    fireEvent.change(textArea, { target: { value: 'Updated tab' } });

    const saveButton = await screen.findByText('Save');
    fireEvent.click(saveButton);

    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      tabs: [{ id: 1, text: 'Updated tab' }, { id: 2, text: 'Tab 2' }],
    });
  });

  it('removes tab from chrome storage when deleted', async () => {
    const mocktabs = [{ id: 1, text: 'Tab to delete' }];
    chrome.storage.local.get.withArgs('tabs').yields({ tabs: mocktabs });

    render(<App />);
    const deleteButton = await screen.findByText('Delete');
    fireEvent.click(deleteButton);

    expect(chrome.storage.local.set).toHaveBeenCalledWith({ tabs: [] });
  });

  it('sets initial state with sample tab when local storage is empty', async () => {
    chrome.storage.local.get.withArgs('tabs').yields({});

    render(<App />);
    const tabElements = await screen.findAllByRole('listitem');
    expect(tabElements).toHaveLength(1);
    expect(tabElements[0]).toHaveTextContent('Sample tab');
  });

  it('sets initial state with empty array when tabs key is an empty array in local storage', async () => {
    chrome.storage.local.get.withArgs('tabs').yields({ tabs: [] });

    render(<App />);
    const tabElements = screen.queryAllByRole('listitem');
    expect(tabElements).toHaveLength(0);
  });

  /*it('handles edited tab with no changes', async () => {
    const mocktabs = [{ id: 1, text: 'Sample tab' }];
    chrome.storage.local.get.withArgs('tabs').yields({ tabs: mocktabs });

    render(<App />);
    const editButton = await screen.findByText('Edit');
    fireEvent.click(editButton);

    const saveButton = await screen.findByText('Save');
    fireEvent.click(saveButton);

    expect(chrome.storage.local.set).not.toHaveBeenCalled();
  });*/
});