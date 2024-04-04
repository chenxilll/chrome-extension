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

  it('renders Snippet Collector header', async () => {
    chrome.storage.local.get.withArgs('snippets').yields({ snippets: [] });

    render(<App />);
    const headerElement = await screen.findByText(/Snippet Collector/i);
    expect(headerElement).toBeInTheDocument();

    expect(chrome.storage.local.get).toHaveBeenCalledWith('snippets');
  });

  it('renders sample snippet when snippets are undefined in chrome storage', async () => {
    chrome.storage.local.get.withArgs('snippets').yields({ snippets: undefined });

    render(<App />);
    const snippetElements = await screen.findAllByRole('listitem');
    expect(snippetElements).toHaveLength(1);
    expect(snippetElements[0]).toHaveTextContent('Sample snippet');
  });

  it('renders snippets from chrome storage', async () => {
    const mockSnippets = [
      { id: 1, text: 'Snippet 1' },
      { id: 2, text: 'Snippet 2' },
    ];
    chrome.storage.local.get.withArgs('snippets').yields({ snippets: mockSnippets });

    render(<App />);
    const snippetElements = await screen.findAllByRole('listitem');
    expect(snippetElements).toHaveLength(2);
    expect(snippetElements[0]).toHaveTextContent('Snippet 1');
    expect(snippetElements[1]).toHaveTextContent('Snippet 2');
  });

  it('updates snippet in chrome storage when edited', async () => {
    const mockSnippets = [
      { id: 1, text: 'Sample snippet' },
      { id: 2, text: 'Snippet 2' },
    ];
    chrome.storage.local.get.withArgs('snippets').yields({ snippets: mockSnippets });

    render(<App />);
    const editButtons = await screen.findAllByText('Edit');
    expect(editButtons).toHaveLength(2);
    const editButton = editButtons[0];
    fireEvent.click(editButton);

    const textArea = await screen.findByDisplayValue('Sample snippet');
    fireEvent.change(textArea, { target: { value: 'Updated snippet' } });

    const saveButton = await screen.findByText('Save');
    fireEvent.click(saveButton);

    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      snippets: [{ id: 1, text: 'Updated snippet' }, { id: 2, text: 'Snippet 2' }],
    });
  });

  it('removes snippet from chrome storage when deleted', async () => {
    const mockSnippets = [{ id: 1, text: 'Snippet to delete' }];
    chrome.storage.local.get.withArgs('snippets').yields({ snippets: mockSnippets });

    render(<App />);
    const deleteButton = await screen.findByText('Delete');
    fireEvent.click(deleteButton);

    expect(chrome.storage.local.set).toHaveBeenCalledWith({ snippets: [] });
  });

  it('sets initial state with sample snippet when local storage is empty', async () => {
    chrome.storage.local.get.withArgs('snippets').yields({});

    render(<App />);
    const snippetElements = await screen.findAllByRole('listitem');
    expect(snippetElements).toHaveLength(1);
    expect(snippetElements[0]).toHaveTextContent('Sample snippet');
  });

  it('sets initial state with empty array when snippets key is an empty array in local storage', async () => {
    chrome.storage.local.get.withArgs('snippets').yields({ snippets: [] });

    render(<App />);
    const snippetElements = screen.queryAllByRole('listitem');
    expect(snippetElements).toHaveLength(0);
  });

  /*it('handles edited snippet with no changes', async () => {
    const mockSnippets = [{ id: 1, text: 'Sample snippet' }];
    chrome.storage.local.get.withArgs('snippets').yields({ snippets: mockSnippets });

    render(<App />);
    const editButton = await screen.findByText('Edit');
    fireEvent.click(editButton);

    const saveButton = await screen.findByText('Save');
    fireEvent.click(saveButton);

    expect(chrome.storage.local.set).not.toHaveBeenCalled();
  });*/
});