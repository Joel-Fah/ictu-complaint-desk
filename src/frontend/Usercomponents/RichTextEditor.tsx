import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
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
import MenuBar from '@/Usercomponents/Menubar';
import { MaxLengthExtension } from '@/app/extensions/MaxLengthExtension'; // Path assumed correct
import './editor.css';

const stripHtml = (html: string) =>
    new DOMParser().parseFromString(html, 'text/html').body.textContent || '';

const MAX_LENGTH = 2000;

const RichTextEditor = ({
                            value,
                            onChange,
                        }: {
    value: string;
    onChange: (html: string) => void;
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "What's wrong?",
            }),
            Highlight,
            Superscript,
            Subscript,
            TextStyle,
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            BulletList,
            OrderedList,
            ListItem,
            Color,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Heading,
            HorizontalRule,
            MaxLengthExtension.configure({ maxLength: MAX_LENGTH }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const plainText = editor.state.doc.textContent;
            if (plainText.length <= MAX_LENGTH) {
                onChange(html);
            }
        },
    });

    const charCount = editor ? stripHtml(editor.getHTML()).length : 0;

    return (
        <div className="bg-primary-50">
            <MenuBar editor={editor} />
            <EditorContent
                editor={editor}
                className="prose max-w-none border bg-primary-50 h-[500px] p-4 overflow-y-auto"
            />
            <p
                className={`text-xs mt-2 text-right ${
                    charCount > MAX_LENGTH ? 'text-red-500' : 'text-gray-500'
                }`}
            >
                {charCount}/{MAX_LENGTH} characters
            </p>
        </div>
    );
};

export default RichTextEditor;
