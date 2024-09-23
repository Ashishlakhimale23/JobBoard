import { useCallback } from 'react';
import { EditorContent, JSONContent, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from "@tiptap/extension-link";
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import '../App.css';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="mb-2">
      <div className="space-y-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active px-2 py-1 mr-1 bg-blue-600 text-white rounded-lg' : 'px-2 py-1 mr-1 bg-white text-black rounded-lg'}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active px-2 py-1 mr-1 bg-blue-600 text-white rounded-lg' : 'px-2 py-1 mr-1 bg-white text-black rounded-lg'}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active px-2 py-1 mr-1 bg-blue-600 text-white rounded-lg' : 'px-2 py-1 mr-1 bg-white text-black rounded-lg'}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active px-2 py-1 mr-1 bg-blue-600 text-white rounded-lg' : 'px-2 py-1 mr-1 bg-white text-black rounded-lg'}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active px-2 py-1 mr-1 bg-blue-600 text-white rounded-lg' : 'px-2 py-1 mr-1 bg-white text-black rounded-lg'}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active px-2 py-1 mr-1 bg-blue-600 text-white rounded-lg' : 'px-2 py-1 mr-1 bg-white text-black rounded-lg'}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active px-2 py-1 mr-1 bg-blue-600 text-white rounded-lg' : 'px-2 py-1 mr-1 bg-white text-black rounded-lg'}
        >
          Ordered list
        </button>
        <button 
          onClick={setLink}
          className={editor.isActive('link') ? 'is-active px-2 py-1 mr-1 bg-blue-600 text-white rounded-lg' : 'px-2 py-1 mr-1 bg-white text-black rounded-lg'}
        >
          Set link
        </button>
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          className='px-2 py-1 mr-1 bg-white text-black rounded-lg'
        >
          Unset link
        </button>
      </div>
    </div>
  );
};

export const TextEditor = ({initialContent,onUpdate}:{initialContent:JSONContent,onUpdate:(content:JSONContent)=>void}) => {
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
    content:initialContent,
    editorProps: {
      attributes: {
        class: 'focus:outline-none editor-content max-w-full min-h-40 focus:ring-2 rounded-lg p-4 focus:ring-blue-600',
      },
    },
    onUpdate({ editor }) {
      const jsonContent = editor.getJSON();
      onUpdate(jsonContent)
    },
  });

  return (
    <div className="">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="editor-content prose mt-4 max-w-full rounded-lg text-white bg-neutral-800/50"
      />
    </div>
  );
};
