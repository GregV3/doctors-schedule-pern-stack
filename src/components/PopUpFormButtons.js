import React from 'react';

// Returns one of three buttons in the pop up form
export function PopUpFormButtons(props) {
    return <button id={props.id} className='buttons' type="submit" disabled={ props.isDisabled ? true : false} >{props.description}</button>
}