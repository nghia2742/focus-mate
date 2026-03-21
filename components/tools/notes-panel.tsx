"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { ChevronLeft, FileText, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';
import remarkGfm from 'remark-gfm';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: any;
}

export function NotesPanel() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notes"),
      where("userId", "==", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Note));
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateNote = async () => {
    if (!user) return;
    const docRef = await addDoc(collection(db, "notes"), {
      userId: user.uid,
      title: "New Note",
      content: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setActiveNoteId(docRef.id);
    setEditedTitle("New Note");
    setEditedContent("");
    setIsPreview(false);
  };

  const toogleEdit = (note: Note) => {
    setActiveNoteId(note.id);
    setEditedTitle(note.title);
    setEditedContent(note.content);
    setIsPreview(false);
  }

  const handleSave = async () => {
    if (!activeNoteId || !user) return;

    await updateDoc(doc(db, "notes", activeNoteId), {
      title: editedTitle,
      content: editedContent,
      updatedAt: serverTimestamp(),
    });
  };

  const handleDelete = async (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    if (confirm("Delete this note?")) {
      await deleteDoc(doc(db, "notes", noteId));
      if (activeNoteId === noteId) {
        setActiveNoteId(null);
      }
    }
  };

  if (!user) return <div className="glass p-4 rounded-xl text-center text-white/50">Sign in to use Notes</div>;

  return (
    <div className="glass rounded-xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex gap-2 items-center">
          {activeNoteId && (
            <Button variant="ghost" size="icon" className="h-6 w-6 mr-1" onClick={() => setActiveNoteId(null)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          Notes
        </h3>
        {!activeNoteId ? (
          <Button size="sm" onClick={handleCreateNote} className="glass hover:bg-white/10">
            <Plus className="h-4 w-4 mr-1" /> New
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsPreview(!isPreview)}
              className={cn("h-8 w-8 p-0", isPreview && "bg-white/20")}
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0 hover:text-green-400">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {!activeNoteId ? (
          <div className="grid gap-2">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => toogleEdit(note)}
                className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors group flex justify-between items-start"
              >
                <div>
                  <h4 className="font-medium text-white truncate w-48">{note.title || "Untitled"}</h4>
                  <p className="text-xs text-white/50 truncate w-48 mt-1">
                    {note.content ? note.content.slice(0, 50) + "..." : "No content"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-red-400 -mr-1"
                  onClick={(e) => handleDelete(e, note.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {notes.length === 0 && (
              <div className="text-center text-white/40 mt-10">No notes yet.</div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full gap-4">
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="bg-transparent text-xl font-bold text-white border-none outline-none placeholder:text-white/30"
              placeholder="Note Title"
            />

            {isPreview ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{editedContent}</ReactMarkdown>
              </div>
            ) : (
              <TextareaAutosize
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white/90 border-none outline-none resize-none placeholder:text-white/30"
                placeholder="Type your note here... (Markdown supported)"
                minRows={10}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
