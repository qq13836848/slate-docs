// Import React dependencies.
import React, { useCallback, useMemo, useState } from "react";
// Import the Slate editor factory.
import { createEditor } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

import CustomEditor from "./components/CustomEditor";

const App = () => {
  const [editor] = useState(() => withReact(createEditor()));

  const initialValue = useMemo(() => {
    return (
      JSON.parse(localStorage.getItem("content")) || [
        {
          type: "paragraph",
          children: [{ text: "A line of text in a paragraph." }],
        },
      ]
    );
  }, []);

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value) => {
        console.log(value);
        const isAstChange = editor.operations.some(
          (op) => op.type !== "set_selection"
        );
        if (isAstChange) {
          const content = JSON.stringify(value);
          localStorage.setItem("content", content);
        }
      }}
    >
      <div>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            CustomEditor.toggleBoldMrk(editor);
          }}
        >
          Bold
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            CustomEditor.toggleCodeBlock(editor);
          }}
        >
          Code Block
        </button>
      </div>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(e) => {
          if (!e.ctrlKey) {
            return;
          }

          switch (e.key) {
            case "`":
              e.preventDefault();
              CustomEditor.toggleCodeBlock(editor);
              break;
            case "b": {
              e.preventDefault();
              CustomEditor.toggleBoldMrk(editor);
              break;
            }
            default:
              break;
          }
        }}
      />
    </Slate>
  );
};

const Leaf = (props) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
};

const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};

export default App;
