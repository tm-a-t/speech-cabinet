import { type Editor, Extension, type Range } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

function handler(
  editor: Editor,
  dataTransferItems: DataTransferItemList,
  pos: Range,
) {
  let anyPasted = false;
  for (const item of dataTransferItems) {
    if (item.type == "text/html") {
      // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
      return false;
    }
    if (
      item.kind != "file" ||
      !["image/png", "image/jpeg", "image/gif", "image/webp"].includes(
        item.type,
      )
    ) {
      continue;
    }
    anyPasted = true;
    const file = item.getAsFile()!;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      editor
        .chain()
        .insertContentAt(pos, {
          type: "image",
          attrs: {
            src: fileReader.result,
          },
        })
        .focus()
        .run();
    };
  }
  return anyPasted;
}

export const FileHandler = Extension.create({
  name: "fileHandler",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("fileHandler"),
        props: {
          handleDrop: (view, event) => {
            const pos = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });
            const range = pos
              ? { from: pos.pos, to: pos.pos }
              : view.state.selection;
            if (!event.dataTransfer) {
              return false;
            }
            return handler(this.editor, event.dataTransfer.items, range);
          },
          handlePaste: (view, event) => {
            if (!event.clipboardData) {
              return false;
            }
            return handler(
              this.editor,
              event.clipboardData.items,
              view.state.selection,
            );
          },
        },
      }),
    ];
  },
});
