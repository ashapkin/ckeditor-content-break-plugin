//TODO: copy-pasted element creates multiple instances
(function () {
    var element_html = '<div id="preview_break" style="visibility:hidden;" contenteditable="false"><!--PreviewBreak--></div>';
    var get_preview_element = function (editor) {
        if (editor.document) {
            return editor.document.findOne('#preview_break');
        }
    };
    var remove_existing_element = function (editor) {
        var existing = get_preview_element(editor);
        if (existing) {
            existing.remove();
        }
    };
    var set_editable_false = function (editor) {
        var element = get_preview_element(editor);
        if (element) {
            element.setAttribute('contenteditable', "false");
        }
    };
    var get_pre_body_level_ancestor = function (element, body_element) {
        if (!element) {
            return null;
        }
        if (element.getParent().equals(body_element)) {
            return element;
        }
        return get_pre_body_level_ancestor(element.getParent(), body_element)
    };
    CKEDITOR.plugins.add('previewtag', {
        icons: 'previewtag',
        onLoad: function () {
            CKEDITOR.addCss(
                '#preview_break {' +
                'visibility: visible !important; border: 0; border-top: 1px dashed #8c8c8c; text-align:center; margin: 0 -15px 0 -15px;' +
                '}' +
                '#preview_break:before {' +
                'content: "\u2702" ; display: inline-block; position: relative; top: -17px; padding: 0 3px; color: #8c8c8c; font-size: 20px;' +
                '}'
            );
        },
        init: function (editor) {
            editor.addCommand('insertPreviewTag', {
                exec: function (editor) {
                    var start_element = editor.getSelection().getStartElement(),
                        editable_block = get_pre_body_level_ancestor(start_element, editor.document.getBody()),
                        element = CKEDITOR.dom.element.createFromHtml(element_html),
                        range = editor.createRange();
                    remove_existing_element(editor);
                    range.setStartAt(editable_block, CKEDITOR.POSITION_AFTER_END);
                    range.collapse(true);
                    editor.editable().insertElementIntoRange(element, range);
                }

            });
            editor.ui.addButton('PreviewTag', {
                label: 'Preview Tag',
                command: 'insertPreviewTag',
                toolbar: 'insert'
            });
            editor.on('mode', function () {
                set_editable_false(editor);
            });
            editor.on('instanceReady', function () {
                set_editable_false(editor);
            });
        }
    });
})();