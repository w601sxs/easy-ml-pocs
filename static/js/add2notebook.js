(() => {
  'use strict';

  if(!document.queryCommandSupported('copy')) {
    return;
  }

  function flashCopyMessage(el, msg) {
    el.textContent = msg;
    setTimeout(() => {
      el.textContent = "Add to Notebook";
    }, 1500);
  }

  function selectText(node) {
    let selection = window.getSelection();
    let range = document.createRange();
    if (node.childElementCount === 2) {
      // Skip the title.
      range.selectNodeContents(node.children[1]);
    } else {
      range.selectNodeContents(node);
    }
    selection.removeAllRanges();
    selection.addRange(range);
    return selection;
  }

  function addCopyButton(containerEl) {
    let copyBtn = document.createElement("button");
    copyBtn.className = "highlight-copy-btn";
    copyBtn.textContent = "Add to Notebook";

    let codeEl = containerEl.firstElementChild.firstElementChild;
    copyBtn.addEventListener('click', () => {
      try {
        let selection = selectText(codeEl);
        document.execCommand('copy');
        selection.removeAllRanges();

        flashCopyMessage(copyBtn, 'Added!')
      } catch(e) {
        console && console.log(e);
        flashCopyMessage(copyBtn, 'Failed :\'(')
      }
    });

    containerEl.firstElementChild.appendChild(copyBtn);

  }

  // Add copy button to code blocks
  let highlightBlocks = document.getElementsByClassName('highlight');
  Array.prototype.forEach.call(highlightBlocks, addCopyButton);
})();