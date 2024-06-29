import { Editor, TinyMCE } from 'tinymce';

declare const tinymce: TinyMCE;

const setup = (editor: Editor, url: string): void => {
  editor.ui.registry.addButton('a11y-accessibility-checker', {
    text: 'a-11-y-accessibility-checker button',
    onAction: () => {
      editor.setContent('<p>content added from a-11-y-accessibility-checker</p>');
    }
  });
};

export default (): void => {
  tinymce.PluginManager.add('a11y-accessibility-checker', setup);
};
