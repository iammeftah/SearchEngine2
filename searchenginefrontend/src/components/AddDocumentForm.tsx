import React, { useState, useRef, useCallback } from 'react';
import { Bold, Italic, Underline, Save, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, ChevronDown } from 'lucide-react';
import Toast from './Toast';
import Loader from './Loader';

interface AddDocumentFormProps {
    addDocument: (title: string, content: string) => Promise<void>;
}

const AddDocumentForm: React.FC<AddDocumentFormProps> = ({ addDocument }) => {
    const [title, setTitle] = useState('Untitled');
    const [isSaving, setIsSaving] = useState(false);
    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
    const [showListOptions, setShowListOptions] = useState(false);
    const [showFontSizes, setShowFontSizes] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'warning'>('success');
    const editorRef = useRef<HTMLDivElement>(null);

    const updateActiveFormats = useCallback(() => {
        const newActiveFormats = new Set<string>();
        if (document.queryCommandState('bold')) newActiveFormats.add('bold');
        if (document.queryCommandState('italic')) newActiveFormats.add('italic');
        if (document.queryCommandState('underline')) newActiveFormats.add('underline');
        if (document.queryCommandState('justifyLeft')) newActiveFormats.add('alignLeft');
        if (document.queryCommandState('justifyCenter')) newActiveFormats.add('alignCenter');
        if (document.queryCommandState('justifyRight')) newActiveFormats.add('alignRight');
        if (document.queryCommandState('insertOrderedList')) newActiveFormats.add('orderedList');
        if (document.queryCommandState('insertUnorderedList')) newActiveFormats.add('unorderedList');
        setActiveFormats(newActiveFormats);
    }, []);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleContentChange = useCallback(() => {
        updateActiveFormats();
    }, [updateActiveFormats]);

    const handleSave = async () => {
        if (title.trim() === 'Untitled' || title.trim() === '') {
            setToastMessage('Please provide a title for your document.');
            setToastType('warning');
            setShowToast(true);
            return;
        }

        if (!editorRef.current || editorRef.current.innerHTML.trim() === '') {
            setToastMessage('Please add some content to your document.');
            setToastType('warning');
            setShowToast(true);
            return;
        }

        setIsSaving(true);
        try {
            await addDocument(title, editorRef.current.innerHTML);
            setTitle('Untitled');
            if (editorRef.current) editorRef.current.innerHTML = '';
            setToastMessage('Document saved successfully!');
            setToastType('success');
            setShowToast(true);
        } catch (error) {
            console.error('Error saving document:', error);
            setToastMessage('Error saving document. Please try again.');
            setToastType('warning');
            setShowToast(true);
        }
        setIsSaving(false);
    };

    const handleFormatting = useCallback((format: string) => {
        if (editorRef.current) {
            editorRef.current.focus();

            switch (format) {
                case 'bold':
                case 'italic':
                case 'underline':
                    document.execCommand(format, false, '');
                    break;
                case 'alignLeft':
                case 'alignCenter':
                case 'alignRight':
                    document.execCommand('justify' + format.slice(5), false, '');
                    break;
                case 'heading-1':
                    document.execCommand('formatBlock', false, '<h1>');
                    break;
                case 'heading-2':
                    document.execCommand('formatBlock', false, '<h2>');
                    break;
                case 'heading-3':
                    document.execCommand('formatBlock', false, '<h3>');
                    break;
                case 'list-decimal':
                case 'list-alpha':
                case 'list-roman':
                case 'list-bullet':
                    formatList(format.split('-')[1]);
                    break;
                case 'fontSize-1':
                    document.execCommand('fontSize', false, '2'); // Small
                    break;
                case 'fontSize-2':
                    document.execCommand('fontSize', false, '3'); // Normal
                    break;
                case 'fontSize-3':
                    document.execCommand('fontSize', false, '5'); // Large
                    break;
                case 'fontSize-4':
                    document.execCommand('fontSize', false, '7'); // Extra Large
                    break;
            }
            updateActiveFormats();
        }
    }, [updateActiveFormats]);

    const formatList = (listType: string) => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const listContainer = range.commonAncestorContainer.parentElement?.closest('ol, ul');

        if (listContainer) {
            const newList = document.createElement(listType === 'bullet' ? 'ul' : 'ol') as HTMLOListElement | HTMLUListElement;
            Array.from(listContainer.children).forEach(item => {
                const newItem = document.createElement('li');
                newItem.innerHTML = item.innerHTML;
                newList.appendChild(newItem);
            });

            if (listType !== 'bullet') {
                switch (listType) {
                    case 'decimal':
                        newList.style.listStyleType = 'decimal';
                        break;
                    case 'alpha':
                        newList.style.listStyleType = 'lower-alpha';
                        break;
                    case 'roman':
                        newList.style.listStyleType = 'lower-roman';
                        break;
                }
            }

            listContainer.parentNode?.replaceChild(newList, listContainer);
        } else {
            document.execCommand(listType === 'bullet' ? 'insertUnorderedList' : 'insertOrderedList', false, '');
            const newList = selection.getRangeAt(0).commonAncestorContainer.parentElement?.closest('ol, ul') as HTMLOListElement | HTMLUListElement;
            if (newList && listType !== 'bullet') {
                switch (listType) {
                    case 'decimal':
                        newList.style.listStyleType = 'decimal';
                        break;
                    case 'alpha':
                        newList.style.listStyleType = 'lower-alpha';
                        break;
                    case 'roman':
                        newList.style.listStyleType = 'lower-roman';
                        break;
                }
            }
        }
    };

    const isFormatActive = useCallback((format: string) => {
        return activeFormats.has(format);
    }, [activeFormats]);

    const ListOptionsDropdown = () => (
        <div className="relative inline-block">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowListOptions(!showListOptions);
                    setShowFontSizes(false);
                }}
                className="flex items-center w-8 h-8 rounded-full px-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600"
            >
                <ListOrdered size={16} />
                <ChevronDown size={16} />
            </button>
            {showListOptions && (
                <div className="absolute z-50 w-32 mt-1 bg-white dark:bg-neutral-800 rounded shadow-lg border border-neutral-200 dark:border-neutral-700">
                    <button
                        className="w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-700"
                        onClick={() => {
                            formatList('decimal');
                            setShowListOptions(false);
                        }}
                    >
                        1, 2, 3
                    </button>
                    <button
                        className="w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-700"
                        onClick={() => {
                            formatList('alpha');
                            setShowListOptions(false);
                        }}
                    >
                        a, b, c
                    </button>
                    <button
                        className="w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        onClick={() => {
                            formatList('roman');
                            setShowListOptions(false);
                        }}
                    >
                        i, ii, iii
                    </button>
                </div>
            )}
        </div>
    );

    const FontSizeDropdown = () => (
        <div className="relative inline-block">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowFontSizes(!showFontSizes);
                    setShowListOptions(false);
                }}
                className="outline-none flex items-center justify-center px-2 h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600"
            >
                <span className="font-bold">T</span>
                <ChevronDown size={16} />
            </button>
            {showFontSizes && (
                <div className="absolute z-50 w-32 mt-1 bg-white dark:bg-neutral-800 rounded shadow-lg border border-neutral-200 dark:border-neutral-700">
                    <button
                        className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-700"
                        onClick={() => {
                            handleFormatting('fontSize-1');
                            setShowFontSizes(false);
                        }}
                    >
                        Small
                    </button>
                    <button
                        className="w-full px-3 py-2 text-base text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-700"
                        onClick={() => {
                            handleFormatting('fontSize-2');
                            setShowFontSizes(false);
                        }}
                    >
                        Normal
                    </button>
                    <button
                        className="w-full px-3 py-2 text-lg text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-700"
                        onClick={() => {
                            handleFormatting('fontSize-3');
                            setShowFontSizes(false);
                        }}
                    >
                        Large
                    </button>
                    <button
                        className="w-full px-3 py-2 text-xl text-left hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        onClick={() => {
                            handleFormatting('fontSize-4');
                            setShowFontSizes(false);
                        }}
                    >
                        Extra Large
                    </button>
                </div>
            )}
        </div>
    );

    React.useEffect(() => {
        const handleClickOutside = () => {
            setShowListOptions(false);
            setShowFontSizes(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen py-20 bg-white dark:bg-neutral-950">
            <form className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <div className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-2xl">
                    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 mb-8 text-neutral-600 dark:text-neutral-300 rounded-lg px-4 py-2 bg-white dark:bg-neutral-800">
                        <div className="flex items-center gap-2">
                            {[
                                { icon: Bold, format: 'bold', label: 'Bold' },
                                { icon: Italic, format: 'italic', label: 'Italic' },
                                { icon: Underline, format: 'underline', label: 'Underline' },
                                { icon: AlignLeft, format: 'alignLeft', label: 'Align Left' },
                                { icon: AlignCenter, format: 'alignCenter', label: 'Align Center' },
                                { icon: AlignRight, format: 'alignRight', label: 'Align Right' },
                                { icon: List, format: 'list-bullet', label: 'Bullet List' },
                            ].map(({ icon: Icon, format, label }) => (
                                <button
                                    key={format}
                                    type="button"
                                    className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                                        isFormatActive(format)
                                            ? 'bg-neutral-700 dark:bg-neutral-300 text-white dark:text-neutral-900'
                                            : 'bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                                    }`}
                                    onClick={()=> handleFormatting(format)}
                                    aria-label={label}
                                >
                                    <Icon size={16} />
                                </button>
                            ))}
                            <ListOptionsDropdown />
                            <FontSizeDropdown />
                        </div>
                        <div /> {/* Spacer */}
                        <button
                            type="button"
                            className="flex items-center h-8 px-2 rounded-full gap-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-100"
                            onClick={handleSave}
                        >
                            <Save size={16} />
                            <span>Save</span>
                        </button>
                    </div>

                    <div className="px-2">
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Untitled"
                            className="w-full text-4xl font-bold mb-4 bg-transparent border-none outline-none placeholder-neutral-400 dark:placeholder-neutral-500 text-neutral-900 dark:text-neutral-100 caret-neutral-500"
                        />
                    </div>

                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleContentChange}
                        onKeyUp={updateActiveFormats}
                        onMouseUp={updateActiveFormats}
                        className="px-6 min-h-[300px] outline-none text-neutral-900 dark:text-neutral-100 prose dark:prose-invert prose-lg max-w-none caret-neutral-900 dark:caret-neutral-100
              [&>*]:mb-4
              [&>p]:leading-relaxed
              [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:leading-tight
              [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:leading-tight
              [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:leading-tight
              [&>ol]:list-decimal [&>ul]:list-disc
              [&>ol,&>ul]:pl-8 [&>ol,&>ul]:mb-4
              [&>ol>li,&>ul>li]:pl-4 [&>ol>li,&>ul>li]:mb-2
              [&>ol>li::marker,&>ul>li::marker]:text-neutral-500
              [&>ol>li::marker]:mr-4
              [&>ul>li::marker]:mr-4
              [&>ol]:relative [&>ul]:relative
              [&>ol]:before:absolute [&>ol]:before:left-0 [&>ol]:before:top-0 [&>ol]:before:bottom-0 [&>ol]:before:w-8
              [&>ul]:before:absolute [&>ul]:before:left-0 [&>ul]:before:top-0 [&>ul]:before:bottom-0 [&>ul]:before:w-8
              [&>font[size='7']]:text-4xl
              [&>font[size='5']]:text-2xl
              [&>font[size='3']]:text-lg
              [&>font[size='2']]:text-base"
                    />

                    {isSaving && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center">
                            <Loader />
                        </div>
                    )}
                </div>
            </form>
            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
};

export default AddDocumentForm;

