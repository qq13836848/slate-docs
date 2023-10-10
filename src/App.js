// Import React dependencies.
import React, { useState } from "react";
// Import the Slate editor factory.
import { createEditor } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

const App = () => {
  const [editor] = useState(() => withReact(createEditor()));
  return (
    // Add the editable component inside the context.
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        onKeyDown={(e) => {
          if (e.key === "&") {
            e.preventDefault();
            editor.insertText(" and ");
          }
        }}
      />
    </Slate>
  );
};

export default App;
