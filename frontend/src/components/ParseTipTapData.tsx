import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import Link from '@tiptap/extension-link';

export const TiptapEditor = ({ initialContent }: { initialContent: any }) => {
  console.log('Initial content:', initialContent);

  const defaultContent = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "SkillSphere is a fast-growing technology company that specializes in delivering top-notch digital solutions."
          }
        ]
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "We are committed to innovation, teamwork, and delivering the best experience to our customers."
          }
        ]
      },
    ],
  };

  const content = initialContent && initialContent.type === "doc" ? initialContent : defaultContent;

  const editor = useEditor({
    extensions: [
      StarterKit,
      OrderedList.configure({
        keepMarks: true,
        keepAttributes: true,
      }),
      BulletList.configure({
        keepMarks: true,
        keepAttributes: true,
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
        validate: (href) => /^https?:\/\//.test(href),
      }),
    ],
    content, // Content assigned here
    editorProps: {
      attributes: {
        class: 'focus:outline-none editor-content max-w-full rounded-lg p-4 ',
      },
    },
    editable: false, // Set to false for read-only
  });

  useEffect(() => {
    if (editor && content) {
      
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <div className="editor-container">
      {editor ? <EditorContent editor={editor} /> : <p>Loading editor...</p>}
    </div>
  );
};
