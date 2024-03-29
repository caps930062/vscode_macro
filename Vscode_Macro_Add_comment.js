const vscode = require('vscode');

/**
 * Macro configuration settings
 * { [name: string]: {              ... Name of the macro
 *    no: number,                   ... Order of the macro
 *    func: ()=> string | undefined ... Name of the body of the macro function
 *  }
 * }
 */
module.exports.macroCommands = {
  TestMacro: {
    no: 1,
    func: testFunc
  }
};

/**
 * TestMacro(asynchronous)
 */
async function testFunc() {
  var editor = vscode.window.activeTextEditor;
  if (!editor) {
    // Return an error message if necessary.
    await vscode.window.showInformationMessage('ERROR');
    return 'Editor is not opening.';
  }

  var selection    = editor.selection;
  var EditDoc      = editor.document;
  var languageId   = EditDoc.languageId
  var selStartLine = selection.start.line;
  var selEndLine   = selection.end.line;
  //var selStartChar = selection.start.character;

  // get selected scope next/previous line content
  var StartLinePre = EditDoc.getText(new vscode.Range(selStartLine - 1, 0, selStartLine - 1, 48));
  var EndLineNext  = EditDoc.getText(new vscode.Range(selEndLine + 1, 0, selEndLine + 1, 48));

  // get time
  var currentdate = new Date(); 
  var datetime =    (currentdate.getFullYear() % 100).toString().padStart(2, '0')
                  + (currentdate.getMonth() + 1)     .toString().padStart(2, '0')
                  +  currentdate.getDate()           .toString().padStart(2, '0') + " @ " 
                  +  currentdate.getHours()          .toString().padStart(2, '0')
                  +  currentdate.getMinutes()        .toString().padStart(2, '0');

  // get current file type
  //vscode.window.showInformationMessage (EditDoc.languageId);
  if (languageId == 'c' || languageId == 'cpp' || languageId == 'javascript' || languageId == 'asl')
  {
    var InsertTopString    = "//[-start-" + datetime + "test-add]//";
    var InsertButtonString = "//[-End-" + datetime + "test-add]//";
  }
  if (languageId == 'edk2_dec' || languageId == 'edk2_dsc' || languageId == 'edk2_fdf' || languageId == 'edk2_inf')
  {
    var InsertTopString    = "#[-start-" + datetime + "test-add]#";
    var InsertButtonString = "#[-end-" + datetime + "test-add]#";
  }

  // check the selected scope has been comment out or not. 
  //var InsertString = "text";
  if (StartLinePre.includes("test-add"))
    var Check1 = true;
  if (EndLineNext.includes("test-add"))
    var Check2 = true;

  // move or add commit out.
  if (!(Check1 && Check2)) {
    editor.edit( 
      editBuilder => {
        editBuilder.insert(new vscode.Position(selStartLine  , 0), InsertTopString + "\n");
        editBuilder.insert(new vscode.Position(selEndLine + 1, 0), InsertButtonString + "\n");
      }
    );
  } else {
    editor.edit( 
      editBuilder => {
        editBuilder.delete(new vscode.Range(selStartLine - 1, 0, selStartLine, 0));
        editBuilder.delete(new vscode.Range(selEndLine + 1 , 0, selEndLine + 2, 0 ));
      }
    );
  }
}