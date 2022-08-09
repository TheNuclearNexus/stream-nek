import React from 'react'
import styled from 'styled-components'
const SquareBox = styled.button`
width: 128px;
height: 128px;

border: none;
border-radius: 32px;

overflow: hidden;
white-space: wrap;
text-overflow: "-";

font-size: 18px;
font-weight: bold;

background-image: linear-gradient(#badc58, #6ab04c);
user-select: none;
cursor: pointer;
font-family: Swansea;
:hover {
    filter: brightness(0.9);
}
:active {
    filter: brightness(0.75);
    transform: scale(0.95);
}
color: #130f40;
`
export default SquareBox;