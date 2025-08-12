"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BulletList, ListItem } from "@tiptap/extension-list";
import TextAlignExtension from "@tiptap/extension-text-align";
import ColorExtension from "@tiptap/extension-color";
import HighlightExtension from "@tiptap/extension-highlight";
import UnderlineExtension from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";

export default function TextEditor({
  content,
  setContent,
  preview,
}: {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  preview: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        listItem: false,
      }),
      UnderlineExtension,
      ColorExtension,
      HighlightExtension,
      BulletList,
      ListItem,
      TextAlignExtension.configure({
        types: ["heading", "paragraph"],
      }),
      Image,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
  });
  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        editor?.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const applyColor = (color: string) => {
    editor?.chain().focus().setColor(color).run();
  };

  return (
    <div className="w-full mx-auto p-4 space-y-4">
      <style jsx global>{`
        .tiptap-editor .tiptap ul,
        .tiptap ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin: 1rem 0 !important;
        }
        .tiptap-editor .tiptap ol,
        .tiptap ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin: 1rem 0 !important;
        }
        .tiptap-editor .tiptap ul li,
        .tiptap ul li,
        .tiptap-editor .tiptap ol li,
        .tiptap ol li {
          margin: 0.25em 0 !important;
          display: list-item !important;
        }
        .tiptap-editor .tiptap ul li p,
        .tiptap ul li p,
        .tiptap-editor .tiptap ol li p,
        .tiptap ol li p {
          margin: 0 !important;
          display: inline !important;
        }
        .tiptap-editor .tiptap ul li::marker,
        .tiptap ul li::marker,
        .tiptap-editor .tiptap ol li::marker,
        .tiptap ol li::marker {
          color: #000 !important;
        }
      `}</style>
      {preview ? (
        <div
          className="mt-4 min-h-[600px] border border-gray-300 p-6 rounded-2xl shadow-lg bg-white font-Roboto"
          dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }}
        />
      ) : (
        <div>
          {/* Toolbar */}
          <div className="bg-white border rounded-2xl shadow-md p-3 flex flex-wrap gap-2 items-center font-Roboto">
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`px-3 py-1 rounded-md ${
                editor?.isActive("bold")
                  ? "bg-primary2 text-white"
                  : "hover:bg-primary2 hover:text-white"
              }`}
            >
              B
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`px-3 py-1 rounded-md ${
                editor?.isActive("italic")
                  ? "bg-primary2 text-white"
                  : "hover:bg-primary2 hover:text-white"
              }`}
            >
              I
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={`px-3 py-1 rounded-md ${
                editor?.isActive("underline")
                  ? "bg-primary2 text-white"
                  : "hover:bg-primary2 hover:text-white"
              }`}
            >
              U
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={`px-3 py-1 rounded-md ${
                editor?.isActive("strike")
                  ? "bg-primary2 text-white"
                  : "hover:bg-primary2 hover:text-white"
              }`}
            >
              S
            </button>
            <button
              onClick={() => {
                editor?.chain().focus().toggleBulletList().run();
              }}
              className={`px-3 py-1 rounded-md ${
                editor?.isActive("bulletList")
                  ? "bg-primary2 text-white"
                  : "hover:bg-primary2 hover:text-white"
              }`}
            >
              • List
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleCode().run()}
              className={`px-3 py-1 rounded-md ${
                editor?.isActive("code")
                  ? "bg-primary2 text-white"
                  : "hover:bg-primary2 hover:text-white"
              }`}
            >
              {"</>"}
            </button>
            <button
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`px-3 py-1 rounded-md ${
                editor?.isActive("heading", { level: 1 })
                  ? "bg-primary2 text-white"
                  : "hover:bg-primary2 hover:text-white"
              }`}
            >
              H1
            </button>
            <button
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`px-3 py-1 rounded-md ${
                editor?.isActive("heading", { level: 2 })
                  ? "bg-primary2 text-white"
                  : "hover:bg-primary2 hover:text-white"
              }`}
            >
              H2
            </button>
            {/* Alignment Group */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={() =>
                  editor?.chain().focus().setTextAlign("left").run()
                }
                className={`px-3 py-1 rounded-md ${
                  editor?.isActive({ textAlign: "left" })
                    ? "bg-primary2 text-white"
                    : "hover:bg-primary2 hover:text-white"
                }`}
              >
                Left
              </button>
              <button
                onClick={() =>
                  editor?.chain().focus().setTextAlign("center").run()
                }
                className={`px-3 py-1 rounded-md ${
                  editor?.isActive({ textAlign: "center" })
                    ? "bg-primary2 text-white"
                    : "hover:bg-primary2 hover:text-white"
                }`}
              >
                Center
              </button>
              <button
                onClick={() =>
                  editor?.chain().focus().setTextAlign("right").run()
                }
                className={`px-3 py-1 rounded-md ${
                  editor?.isActive({ textAlign: "right" })
                    ? "bg-primary2 text-white"
                    : "hover:bg-primary2 hover:text-white"
                }`}
              >
                Right
              </button>
            </div>
            <button
              onClick={addImage}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Image
            </button>
          </div>
          {/* Editor with full page height */}
          <div className="mt-4 min-h-[600px] border border-gray-300 p-6 rounded-2xl shadow-lg bg-white font-Roboto">
            <EditorContent editor={editor} className="tiptap-editor" />
          </div>
        </div>
      )}
    </div>
  );
}
