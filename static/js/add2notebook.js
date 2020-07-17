(() => {
  'use strict';

  if(!document.queryCommandSupported('copy')) {
    return;
  }

  if (sessionStorage.getItem("notebookJson") === null) {
    var notebookJson = { cells:[{cell_type: "markdown",metadata: {},source: [
    "# Easy ML PoCs Genrated Notebook\n",
    "\n",
    "Here are the cells you added to the notebook\n"]}], metadata: 
    {kernelspec:{display_name: "conda_python3",language: "python",
    name: "conda_python3"},language_info:
    {codemirror_mode: {name: "ipython",version: 3},
    file_extension: ".py",mimetype: "text/x-python",
    name: "python",nbconvert_exporter: "python",
    pygments_lexer: "ipython3",version: "3.6.5"}},
    nbformat: 4,nbformat_minor: 4};

    sessionStorage.setItem("notebookJson", JSON.stringify(notebookJson));
  }

  function flashCopyMessage(el, msg) {
    el.textContent = msg;
    setTimeout(() => {
      el.textContent = "Add to Notebook";
    }, 1000);
  }

  function add2notebook(code) {

    var notebookJson = JSON.parse(sessionStorage.getItem("notebookJson"));
    // console.log(notebookJson);
    var newcell = { cell_type: "code",execution_count: null,metadata: {},outputs: [],"source": code.split('\n').map(function(a) { return a+"\n" ; }) };
    //console.log(notebookJson);
    notebookJson.cells.push(newcell);
    sessionStorage.setItem("notebookJson", JSON.stringify(notebookJson));
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

        var text = codeEl.textContent || codeEl.innerText;
        //console.log(text);
        add2notebook(text);
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