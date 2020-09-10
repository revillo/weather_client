import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('App Renders', () => {
  const { getByText } = render(<App />);
  const logoText = getByText(/tmwa./i);
  expect(logoText).toBeInTheDocument();
});
