// @flow
import React from 'react';
import type { Element } from 'react';
import Img from 'gatsby-image';
import { Paper } from '@mui/material';
import {css} from '@emotion/react'; 

type Props = {|
  edges: [],
  onOpenModal: (number) => mixed
|};

const paintingsStyle = css`
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'center',
	alignItems: 'center',
	overflow: 'hidden',
	thumbnail: {
		margin: 10,
		width: 300,
		height: 200,
		cursor: 'pointer'
	}
`;

export default function Paintings({ edges, onOpenModal }: Props): Element<'div'> {
  return (
    <div css={paintingsStyle}>
      {edges.map(({ node }, index) => (
        <Paper key={index} css={paintingsStyle} onClick={() => onOpenModal(index)}>
          <Img {...node.small} />
        </Paper>
      ))}
    </div>
  );
}
