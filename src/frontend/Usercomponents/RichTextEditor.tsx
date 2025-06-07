import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import MenuBar from "@/Usercomponents/Menubar";
import './editor.css';

const RichTextEditor = ({ value, onChange }: { value: string; onChange: (html: string) => void }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "What's wrong?",
                emptyEditorClass: 'is-editor-empty', // useful for styling
                showOnlyWhenEditable: true,
                showOnlyCurrent: true,
            }),
            Highlight,
            Superscript,
            Subscript,
            TextStyle,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            BulletList,
            OrderedList,
            ListItem,
            Color,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Heading,
            HorizontalRule,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
        immediatelyRender: false,
    });

    return (
        <div className='bg-primary-50'>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} spellCheck={true} className="prose max-w-none border bg-primary-50 h-[500px] p-10" />
        </div>
    );
};

export default RichTextEditor;
