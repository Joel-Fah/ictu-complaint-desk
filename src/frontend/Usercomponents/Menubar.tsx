import './editor.css';
import Image from 'next/image';
import { Editor } from '@tiptap/react';

interface MenuBarProps {
    editor: Editor | null;
}

const MenuBar = ({ editor }: MenuBarProps) =>{
    if (!editor) return null;

    return (
        <div className="grid grid-cols-8 menu-bar p-2.5 bg-primary-100 border-b border-primary-950 gap-2 h-20 shadow-md">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`flex p-0.5 rounded-xl w-3/4 justify-center items-center ${editor.isActive('bold') ? 'is-active' : ''}`}
            >
                <Image src="/icons/text-bold.svg" alt="Bold Icon" width={24} height={24} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`flex p-0.5 rounded-xl w-3/4 justify-center items-center ${editor.isActive('italic') ? 'is-active' : ''}`}
            >
                <Image src="/icons/text-italic.svg" alt="Italic Icon" width={24} height={24} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`flex p-0.5 rounded-xl w-3/4 justify-center items-center ${editor.isActive('strike') ? 'is-active' : ''}`}
            >
                <Image src="/icons/text-strikethrough.svg" alt="Strikethrough Icon" width={24} height={24} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={`flex p-0.5 rounded-xl w-3/4 justify-center items-center ${editor.isActive('highlight') ? 'is-active' : ''}`}
            >
                <Image src="/icons/highlighter.svg" alt="Highlight Icon" width={24} height={24} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                className={`flex p-0.5 rounded-xl w-3/4 justify-center items-center ${editor.isActive('superscript') ? 'is-active' : ''}`}
            >
                <Image src="/icons/text-superscript.svg" alt="Superscript Icon" width={24} height={24} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                className={`flex p-0.5 rounded-xl w-3/4 justify-center items-center ${editor.isActive('subscript') ? 'is-active' : ''}`}
            >
                <Image src="/icons/text-subscript.svg" alt="Subscript Icon" width={24} height={24} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`flex p-0.5 rounded-xl w-3/4 justify-center items-center ${editor.isActive('bulletList') ? 'is-active' : ''}`}
            >
                <Image src="/icons/left-to-right-list-bullet.svg" alt="Bullet List Icon" width={24} height={24} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`flex p-0.5 rounded-xl w-3/4 justify-center items-center ${editor.isActive('orderedList') ? 'is-active' : ''}`}
            >
                <Image src="/icons/left-to-right-list-number.svg" alt="Ordered List Icon" width={24} height={24} />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`flex p-0.5 rounded-xl w-3/4 justify-center items-center ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`}
            >
                <Image src="/icons/text-align-left.svg" alt="Align Left Icon" width={24} height={24} />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`flex p-0.5 rounded-xl w-3/4 justify-center items-center ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`}
            >
                <Image src="/icons/text-align-justify-center.svg" alt="Align Center Icon" width={24} height={24} />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`flex p-0.5 rounded-xl w-3/4 justify-center items-center ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`}
            >
                <Image src="/icons/text-align-justify-right.svg" alt="Align Right Icon" width={24} height={24} />
            </button>

            {/* 👇 Replaced Heading Buttons with Select Dropdown */}
            <select
                value={
                    editor.isActive('heading', { level: 1 }) ? 'h1' :
                        editor.isActive('heading', { level: 2 }) ? 'h2' :
                            editor.isActive('heading', { level: 3 }) ? 'h3' :
                                editor.isActive('heading', { level: 4 }) ? 'h4' :
                                    editor.isActive('heading', { level: 5 }) ? 'h5' :
                                        editor.isActive('heading', { level: 6 }) ? 'h6' :
                                'paragraph'
                }
                onChange={(e) => {
                    const value = e.target.value;
                    const chain = editor.chain().focus();

                    if (value === 'paragraph') {
                        chain.setParagraph().run();
                    } else {
                        const level = parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6;
                        chain.toggleHeading({ level }).run();
                    }
                }}

                className="col-span-2 border-none w-16 bg-primary-100 text-sm border border-primary-900 focus:outline-none"
            >
                <option value="paragraph">Normal</option>
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
                <option value="h5">H5</option>
                <option value="h6">H6</option>
            </select>

            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`flex p-0.5 rounded-xl w-3/4 justify-center items-center ${editor.isActive('underline') ? 'is-active' : ''}`}
            >
                <Image src="/icons/text-underline.svg" alt="Underline Icon" width={24} height={24} />
            </button>
        </div>
    );
};

export default MenuBar;
