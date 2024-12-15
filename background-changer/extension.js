const vscode = require("vscode");
const acorn = require("acorn");

    function activate(context) {
        console.log("Debug: Erweiterung aktiviert!");

        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showInformationMessage("Kein aktiver Editor gefunden.");
            return;
        }

        const text = editor.document.getText();
        let ast;

        try {
            ast = acorn.parse(text, { ecmaVersion: "latest", locations: true });
        } catch (error) {
            vscode.window.showErrorMessage("Fehler beim Analysieren des Codes.");
            console.error(error);
            return;
        }

        const functionRanges = [];
        const decorations = [];

        const sectionDecoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: "rgba(173, 216, 230, 0.3)", // Hellblau, transparent
            isWholeLine: true,
        });

        const functionDecoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: "rgba(255, 223, 186, 0.3)", // Hellorange, transparent
            isWholeLine: true,
        });

        const sectionRegex = /<section[^>]*>[\s\S]*?<\/section>/g;
        const sectionRanges = [];

        let match;
        while ((match = sectionRegex.exec(text)) !== null) {
            const startPos = editor.document.positionAt(match.index);
            const endPos = editor.document.positionAt(match.index + match[0].length);
            const startLine = startPos.line;
            const endLine = endPos.line;

            for (let line = startLine; line <= endLine; line++) {
                const lineRange = editor.document.lineAt(line).range;
                sectionRanges.push({ range: lineRange });
            }
        }

        editor.setDecorations(sectionDecoration, sectionRanges);

        function findFunctions(node) {
            if (node.type === "FunctionDeclaration" || node.type === "FunctionExpression") {
                const startLine = node.loc.start.line - 1;
                const startLineText = editor.document.lineAt(startLine).text;
                const startCharacter = startLineText.search(/\S|$/); // Einrückung bestimmen

                const lineRange = new vscode.Range(
                    new vscode.Position(startLine, startCharacter), // Ab der Einrückung
                    editor.document.lineAt(startLine).range.end
                );

                // Dynamische Farben für die erste Zeile der Funktion
                const randomColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                    Math.random() * 255
                )}, ${Math.floor(Math.random() * 255)}, 0.3)`;

                const dynamicDecoration = vscode.window.createTextEditorDecorationType({
                    backgroundColor: randomColor,
                    border: "1px dashed rgba(0, 0, 0, 0.5)",
                });

                decorations.push({ decoration: dynamicDecoration, range: lineRange });

                // Gesamte Funktion markieren
                const endLine = node.loc.end.line - 1;
                for (let line = startLine; line <= endLine; line++) {
                    const functionLineRange = editor.document.lineAt(line).range;
                    functionRanges.push({ range: functionLineRange });
                }
            }

            for (const key in node) {
                const child = node[key];
                if (Array.isArray(child)) {
                    child.forEach(findFunctions);
                } else if (child && typeof child === "object" && child.type) {
                    findFunctions(child);
                }
            }
        }

        findFunctions(ast);

        editor.setDecorations(functionDecoration, functionRanges);

        decorations.forEach(({ decoration, range }) => {
            editor.setDecorations(decoration, [range]);
        });

        vscode.window.showInformationMessage("Sektionen und Funktionszeilen markiert!");
    }

function deactivate() {
    console.log("Debug: Erweiterung deaktiviert.");
}

module.exports = {
    activate,
    deactivate,
};
