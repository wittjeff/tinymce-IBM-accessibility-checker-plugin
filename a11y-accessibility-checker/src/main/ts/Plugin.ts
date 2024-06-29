import { Editor, TinyMCE } from 'tinymce';

declare const tinymce: TinyMCE;

const setup = (editor: Editor): void => {
  editor.ui.registry.addButton('a11y-accessibility-checker', {
    text: 'Accessibility Checker',
    onAction: () => {
      const content = editor.getContent();

      // Open the initial checking dialog
      const dialog = editor.windowManager.open({
        title: 'Accessibility Checker',
        body: {
          type: 'panel',
          items: [
            {
              type: 'htmlpanel', // Use an HTML panel to show the checking status
              html: '<p id="a11y-status">Checking...</p>'
            }
          ]
        },
        buttons: [],
        onClose: () => {}
      });

      fetch('/check-accessibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ html: content })
      })
      .then(response => {
        if (response.ok) {
          return response.blob();
        } else {
          return response.text().then(error => { throw new Error(error); });
        }
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.xslx';
        a.click();
        URL.revokeObjectURL(url);

        // Update the dialog content
        dialog.redial({
          title: 'Accessibility Checker',
          body: {
            type: 'panel',
            items: [
              {
                type: 'htmlpanel',
                html: '<p id="a11y-status">Download ready</p>'
              }
            ]
          },
          buttons: [
            {
              type: 'cancel',
              text: 'Close',
              primary: true
            }
          ]
        });
      })
      .catch(error => {
        // Update the dialog content in case of error
        dialog.redial({
          title: 'Accessibility Checker',
          body: {
            type: 'panel',
            items: [
              {
                type: 'htmlpanel',
                html: `<p id="a11y-status">Error: ${error.message}</p>`
              }
            ]
          },
          buttons: [
            {
              type: 'cancel',
              text: 'Close',
              primary: true
            }
          ]
        });
      });
    }
  });
};

export default (): void => {
  tinymce.PluginManager.add('a11y-accessibility-checker', setup);
};
