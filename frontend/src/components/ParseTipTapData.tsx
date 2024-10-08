import { useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import Link from '@tiptap/extension-link';

const defaultContent = {
  type: "doc",
  content: [],
};

export const TiptapEditor = ({ initialContent }: { initialContent: any }) => {
  // Memoize the content to prevent unnecessary recalculations
  const content = useMemo(() => {
    return initialContent && initialContent.type === "doc" 
      ? initialContent 
      : defaultContent;
  }, [initialContent]);

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
    content,
    editorProps: {
      attributes: {
        class: 'focus:outline-none editor-content max-w-full rounded-lg',
      },
    },
    editable: false,
  });

  // Only update content when initialContent changes
  useEffect(() => {
    if (editor && initialContent !== editor.getJSON()) {
      editor.commands.setContent(content);
    }
  }, [initialContent, editor]);

  return (
    <div className="editor-container">
      {editor ? <EditorContent editor={editor} /> : <p>Loading editor...</p>}
    </div>
  );
};