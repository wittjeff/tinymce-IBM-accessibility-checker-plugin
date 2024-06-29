import { TinyAssertions, TinyHooks, TinyUiActions } from '@ephox/mcagar';

import Plugin from '../../../main/ts/Plugin';

// This an example of a browser test of the editor.
describe('browser.PluginTest', () => {
  const hook = TinyHooks.bddSetup({
    plugins: 'a-11-y-accessibility-checker',
    toolbar: 'a-11-y-accessibility-checker'
  }, [ Plugin ]);

  it('test click on button', () => {
    const editor = hook.editor();
    TinyUiActions.clickOnToolbar(editor, 'button:contains("a-11-y-accessibility-checker button")');
    TinyAssertions.assertContent(editor, '<p>content added from a-11-y-accessibility-checker</p>');
  });
});
