import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 

// ref: https://github.com/sumankalia/react-editorjs/blob/main/src/components/EditorCompoenent.js

const EditorJSComp = ({tools = {}, data, setEditorContent, readOnly = false}) => {

    /*  EditorJS data format: {"blocks":[]} 
        This format must be followed when supplying data to EditorJS    */

    const ejInstance = useRef();

    const initEditor = () => {
        const editor = new EditorJS({
            holder: 'editorjs',
            autofocus: true,
            //   data: DEFAULT_INITIAL_DATA,
            data,
            readOnly,
            onReady: () => {
                ejInstance.current = editor;
            },
            onChange: async () => {
                if(!readOnly){
                    let content = await editor.saver.save();
                    setEditorContent(content);
                }
            },
            tools,
        });

        // ejInstance.current = editor;
    };

      // This will run only once
    useEffect(() => {
        if (ejInstance.current === null) {
            initEditor();
        }

        return () => {
            ejInstance?.current?.destroy();
            ejInstance.current = null;
        };
    }, [data]);

    return <div id='editorjs' className="cdx-input"></div>;
}

export default EditorJSComp;