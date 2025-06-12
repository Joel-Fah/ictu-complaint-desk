import { Extension } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';

export const MaxLengthExtension = Extension.create({
    name: 'maxLength',

    addOptions() {
        return {
            maxLength: 2000,
        };
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handleTextInput: (view, from, to, text) => {
                        const currentText = view.state.doc.textContent;
                        const nextLength = currentText.length + text.length - (to - from);
                        if (nextLength > this.options.maxLength) {
                            return true; // block input
                        }
                        return false;
                    },

                    handlePaste: (view, event) => {
                        const paste = event.clipboardData?.getData('text/plain') ?? '';
                        const currentText = view.state.doc.textContent;
                        const nextLength = currentText.length + paste.length;
                        if (nextLength > this.options.maxLength) {
                            event.preventDefault();
                            return true;
                        }
                        return false;
                    },
                },
            }),
        ];
    },
});
