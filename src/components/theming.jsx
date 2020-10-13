// @flow
import React from 'react';
import type { Element } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../utils/theme';

type Props = {|
  children: Element<any>
|};

export default function Theming({ children }: Props): Element<typeof ThemeProvider> {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}