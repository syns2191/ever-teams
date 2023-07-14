import { Editor, BaseEditor, Transforms, Element as SlateElement } from 'slate';
import { ReactEditor } from 'slate-react';
import { jsx } from 'slate-hyperscript';

export class TextEditorService {
	static toggleMark(
		editor: BaseEditor,
		format: string,
		isMarkActive: (editor: BaseEditor, format: string) => boolean
	) {
		const isActive = isMarkActive(editor, format);

		if (isActive) {
			Editor.removeMark(editor, format);
		} else {
			Editor.addMark(editor, format, true);
		}
	}

	static toggleBlock(
		editor: BaseEditor,
		format: string,
		isBlockActive: (editor: any, format: any, blockType?: string) => boolean,
		LIST_TYPES: string[],
		TEXT_ALIGN_TYPES: string[]
	) {
		const isActive = isBlockActive(
			editor,
			format,
			TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
		);

		const isList = LIST_TYPES.includes(format);

		Transforms.unwrapNodes(editor, {
			match: (n) =>
				!Editor.isEditor(n) &&
				SlateElement.isElement(n) &&
				//@ts-ignore
				LIST_TYPES.includes(n.type) &&
				!TEXT_ALIGN_TYPES.includes(format),
			split: true,
		});

		let newProperties: Partial<SlateElement>;
		if (TEXT_ALIGN_TYPES.includes(format)) {
			newProperties = {
				//@ts-ignore
				align: isActive ? undefined : format,
			};
		} else {
			newProperties = {
				//@ts-ignore
				type: isActive ? 'paragraph' : isList ? 'li' : format,
			};
		}
		Transforms.setNodes<SlateElement>(editor, newProperties);

		if (!isActive && isList) {
			const block = { type: format, children: [] };
			Transforms.wrapNodes(editor, block);
		}
	}
}

export const isHtml = (value: string): boolean => {
	const htmlRegex = /<([a-z][a-z0-9]*)\b[^>]*>(.*?)<\/\1>/i;
	return htmlRegex.test(value);
};

export const ELEMENT_NAME_TAG_MAP = {
	p: 'p',
	paragraph: 'p',
	h1: 'h1',
	h2: 'h2',
	h3: 'h3',
	h4: 'h4',
	h5: 'h5',
	h6: 'h6',
	ul: 'ul',
	ol: 'ol',
	li: 'li',
	blockquote: 'blockquote',
};

export const MARK_ELEMENT_TAG_MAP = {
	strikethrough: ['s'],
	bold: ['strong'],
	underline: ['u'],
	italic: ['i'],
	code: ['pre', 'code'],
};

interface ElementAttributes {
	[key: string]: string | null;
}

const ELEMENT_TAGS: { [key: string]: (el: HTMLElement) => ElementAttributes } =
	{
		A: (el) => ({ type: 'link', url: el.getAttribute('href') }),
		BLOCKQUOTE: () => ({ type: 'quote' }),
		H1: () => ({ type: 'h1' }),
		H2: () => ({ type: 'h2' }),
		// H3: () => ({ type: 'heading-three' }),
		// H4: () => ({ type: 'heading-four' }),
		// H5: () => ({ type: 'heading-five' }),
		// H6: () => ({ type: 'heading-six' }),
		// IMG: (el) => ({ type: 'image', url: el.getAttribute('src') }),
		LI: () => ({ type: 'li' }),
		OL: () => ({ type: 'ol' }),
		P: () => ({ type: 'paragraph' }),
		PRE: () => ({ type: 'code' }),
		UL: () => ({ type: 'ul' }),
	};

const TEXT_TAGS: { [key: string]: () => { [key: string]: boolean } } = {
	CODE: () => ({ code: true }),
	DEL: () => ({ strikethrough: true }),
	EM: () => ({ italic: true }),
	I: () => ({ italic: true }),
	S: () => ({ strikethrough: true }),
	STRONG: () => ({ bold: true }),
	U: () => ({ underline: true }),
};

export const deserialize = (el: any): any => {
	if (el.nodeType === 3) {
		return el.textContent;
	} else if (el.nodeType !== 1) {
		return null;
	} else if (el.nodeName === 'BR') {
		return '\n';
	}

	const { nodeName } = el;
	let parent = el;

	if (
		nodeName === 'PRE' &&
		el.childNodes[0] &&
		el.childNodes[0].nodeName === 'CODE'
	) {
		parent = el.childNodes[0];
	}
	let children = Array.from(parent.childNodes).map(deserialize).flat();

	if (children.length === 0) {
		children = [{ text: '' }];
	}

	if (el.nodeName === 'BODY') {
		return jsx('fragment', {}, children);
	}

	if (ELEMENT_TAGS[nodeName]) {
		//@ts-ignore
		const attrs = ELEMENT_TAGS[nodeName](el);
		return jsx('element', attrs, children);
	}

	if (TEXT_TAGS[nodeName]) {
		//@ts-ignore
		const attrs = TEXT_TAGS[nodeName](el);
		return children.map((child) => jsx('text', attrs, child));
	}

	return children;
};

export const withHtml = (editor: ReactEditor): ReactEditor => {
	const { insertData, isInline, isVoid } = editor;

	editor.isInline = (element: any) => {
		return element.type === 'link' ? true : isInline(element);
	};

	editor.isVoid = (element: any) => {
		return element.type === 'image' ? true : isVoid(element);
	};

	editor.insertData = (data) => {
		const html = data.getData('text/html');

		if (html) {
			const parsed = new DOMParser().parseFromString(html, 'text/html');
			const fragment = deserialize(parsed.body);
			Transforms.insertFragment(editor, fragment);
			return;
		}

		insertData(data);
	};

	return editor;
};