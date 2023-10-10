// Import React dependencies.
import React, { useCallback, useState } from "react";
// Import the Slate editor factory.
import { Transforms, createEditor, Editor, Element } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

import CustomEditor from "./components/CustomEditor";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

const App = () => {
  const [editor] = useState(() => withReact(createEditor()));

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
    <Slate editor={editor} initialValue={initialValue}>
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
