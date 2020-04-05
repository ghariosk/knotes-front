import React from 'react';

import {
    CSSTransition,
    TransitionGroup,
  } from 'react-transition-group';

import './Modal.css';


function Modal (props) {
    

    // The gray background
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      paddingTop: 50,
      zIndex: 2000,
      display: 'block',
      overflowY: 'scroll'
    };


    return (
        <TransitionGroup component={null}>
            {props.show && (
            <CSSTransition classNames="dialog" timeout={300}>
                    <div style={backdropStyle}>
                        <TransitionGroup className="todo-list">
                            {React.Children.map(props.children , (el, index) => {
                                if (index !== props.screenKey ) return;
                                return (
                                    <CSSTransition
                                        key={index}
                                        timeout={1000}
                                        classNames="item"
                                    >
                                        {el}
                                    </CSSTransition>

                                )

                            })}
                        </TransitionGroup>
                    </div>
                    </CSSTransition>
            )}
        </TransitionGroup>
    
    );
}




export default Modal;