import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill';

// import { Delta } from 'quill';
/*
    DON'T FORGET TO IMPORT THIS THREE CSS MODULES IN app.css or style.css which will imported App.js or App.jsx

    @import '~quill/dist/quill.core.css';
    @import '~quill/dist/quill.bubble.css';
    @import '~quill/dist/quill.snow.css';

    .ql-editor {
      font-size: 16px;
    }

    TOTO: CHECK OUT https://codepen.io/eped22/pen/wvoWeQv
*/

// Editor is an uncontrolled React component
const Editor = forwardRef( ({ readOnly, defaultValue, onTextChange, onSelectionChange, withToolBar = true }, ref) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
        onTextChangeRef.current = onTextChange;
        onSelectionChangeRef.current = onSelectionChange;
    });

    /*  For toggling readOnly mode
    useEffect(() => {
        ref.current?.enable(!readOnly);
    }, [ref, readOnly]);
    */
    useEffect(() => {
        const container = containerRef.current;
        const editorContainer = container.appendChild(
          container.ownerDocument.createElement('div'),
        );
        const quill = new Quill(editorContainer, {
            theme: withToolBar ? 'snow' : 'bubble',
            readOnly,
        });

        ref.current = quill;

        if (defaultValueRef.current) {
            quill.setContents(defaultValueRef.current);
        }

        quill.on(Quill.events.TEXT_CHANGE, (...args) => {
            onTextChangeRef.current?.(...args);
        });

        quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
            onSelectionChangeRef.current?.(...args);
        });

        return () => {
            ref.current = null;
            container.innerHTML = '';
        };
    }, [ref]);

    return <div ref={containerRef}></div>;
});

Editor.displayName = 'Editor';

export default Editor;