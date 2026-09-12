# Mojian / 木间

A new, original notes-interface study with working interactions and browser
storage. Created with AI assistance for Seda's public portfolio; it is a
demonstration rather than a past client project.

[Open the interactive sample](https://449693691.github.io/quickfix-desk-demos/).

![Desktop interface](preview-desktop.png)

The interface supports creating and editing notes, searching title/body text,
favorites, topic filters, archive/undo, a reading view, and plain-text export.
Notes stay in the current browser's local storage. The sample has no cloud
account or synchronization service.

Built with HTML, CSS, JavaScript and inline SVG icons. The forest illustration
was AI-generated for the original [Quiet Light study](../atmospheric-video-demo/README.md)
and reused here. No third-party script or font is loaded by the page.

## Try locally

Serve this directory with any static web server, for example:

```sh
python -m http.server 8000 --bind 127.0.0.1 --directory docs
```

Then open `http://localhost:8000`. Use sample text when exploring the demo.
Browser storage is local to the browser and site address; exporting a note
creates a plain-text file you can keep independently.

## Verification

Checked in the installed Chrome browser at 1440×960 and 390×844:

- Created a note and edited its title and multiline body; both survived reload.
- Searched body text, displayed an empty result, and cleared the search.
- Added and removed favorites, including removing the selected item while
  viewing the favorites list.
- Archived a note, restored it, and used undo during the visible prompt.
- Exported a note and verified the downloaded title and complete body.
- Displayed HTML-like input as literal text in the reading view.
- Changed a topic from a filtered view and returned from the narrow editor
  to the selected note button, without focusing the search keyboard.
- Checked horizontal overflow, text-area clipping, image load state and
  browser console messages. The final checks showed no overflow/clipping
  and no console warnings or errors.

This is a Chrome viewport and interaction check. Physical-device testing,
screen-reader testing and a full accessibility audit have not been performed.

[Narrow layout preview](preview-mobile.png)

Code license: MIT, as with the repository's other demonstration code.
