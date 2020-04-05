import React from 'react';
import {
    CSSTransition,
    TransitionGroup,
} from 'react-transition-group';

import Welcome from './Welcome'



export default function Public() {

    return (
        <TransitionGroup className="todo-list">
            <CSSTransition
              key={authState}
              timeout={500}
              classNames="item"
            >
            <Welcome/>
             
            </CSSTransition>
          ))}
        </TransitionGroup>
    )

}