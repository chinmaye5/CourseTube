'use client';

import { useState, useEffect } from 'react';
import {
    StickyNote,
    Bookmark,
    X,
    Save,
    Trash2,
    Clock,
    Edit2,
    Check
} from 'lucide-react';

interface Note {
    _id: string;
    note: string;
    chapterIndex: number;
    timestamp: number;
    createdAt: string;
}

interface BookmarkItem {
    _id: string;
    title: string;
    chapterIndex: number;
    timestamp: number;
    createdAt: string;
}

interface NotesBookmarksProps {
    videoId: string;
    currentChapter: number;
    chapters: any[];
    onSeekTo: (timestamp: number) => void;
}

export default function NotesBookmarks({ videoId, currentChapter, chapters, onSeekTo }: NotesBookmarksProps) {
    const [activeTab, setActiveTab] = useState<'notes' | 'bookmarks'>('notes');
    const [notes, setNotes] = useState<Note[]>([]);
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
    const [newNote, setNewNote] = useState('');
    const [newBookmarkTitle, setNewBookmarkTitle] = useState('');
    const [showNoteInput, setShowNoteInput] = useState(false);
    const [showBookmarkInput, setShowBookmarkInput] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editingNoteText, setEditingNoteText] = useState('');
    const [editingBookmarkId, setEditingBookmarkId] = useState<string | null>(null);
    const [editingBookmarkTitle, setEditingBookmarkTitle] = useState('');

    useEffect(() => {
        if (videoId) {
            loadNotes();
            loadBookmarks();
        }
    }, [videoId]);

    const loadNotes = async () => {
        try {
            const response = await fetch(`/api/save-note?videoId=${videoId}`);
            if (response.ok) {
                const data = await response.json();
                setNotes(data.notes);
            }
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    };

    const loadBookmarks = async () => {
        try {
            const response = await fetch(`/api/save-bookmark?videoId=${videoId}`);
            if (response.ok) {
                const data = await response.json();
                setBookmarks(data.bookmarks);
            }
        } catch (error) {
            console.error('Error loading bookmarks:', error);
        }
    };

    const saveNote = async () => {
        if (!newNote.trim()) return;

        try {
            const response = await fetch('/api/save-note', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    videoId,
                    chapterIndex: currentChapter,
                    note: newNote,
                    timestamp: Date.now()
                })
            });

            if (response.ok) {
                setNewNote('');
                setShowNoteInput(false);
                loadNotes();
            }
        } catch (error) {
            console.error('Error saving note:', error);
        }
    };

    const updateNote = async (noteId: string) => {
        if (!editingNoteText.trim()) return;

        try {
            const response = await fetch('/api/save-note', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    noteId,
                    note: editingNoteText
                })
            });

            if (response.ok) {
                setEditingNoteId(null);
                setEditingNoteText('');
                loadNotes();
            }
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const saveBookmark = async () => {
        try {
            const response = await fetch('/api/save-bookmark', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    videoId,
                    chapterIndex: currentChapter,
                    timestamp: chapters[currentChapter]?.timestamp || 0,
                    title: newBookmarkTitle || `Bookmark at ${chapters[currentChapter]?.title}`
                })
            });

            if (response.ok) {
                setNewBookmarkTitle('');
                setShowBookmarkInput(false);
                loadBookmarks();
            }
        } catch (error) {
            console.error('Error saving bookmark:', error);
        }
    };

    const updateBookmark = async (bookmarkId: string) => {
        if (!editingBookmarkTitle.trim()) return;

        try {
            const response = await fetch('/api/save-bookmark', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookmarkId,
                    title: editingBookmarkTitle
                })
            });

            if (response.ok) {
                setEditingBookmarkId(null);
                setEditingBookmarkTitle('');
                loadBookmarks();
            }
        } catch (error) {
            console.error('Error updating bookmark:', error);
        }
    };

    const deleteNote = async (noteId: string) => {
        try {
            const response = await fetch('/api/save-note', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ noteId })
            });

            if (response.ok) {
                loadNotes();
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const deleteBookmark = async (bookmarkId: string) => {
        try {
            const response = await fetch('/api/save-bookmark', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookmarkId })
            });

            if (response.ok) {
                loadBookmarks();
            }
        } catch (error) {
            console.error('Error deleting bookmark:', error);
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="h-full flex flex-col bg-background transition-colors duration-300">
            {/* Tabs */}
            <div className="flex border-b border-border-theme">
                <button
                    onClick={() => {
                        setActiveTab('notes');
                        loadNotes();
                    }}
                    className={`flex-1 px-4 py-3 font-semibold transition-colors ${activeTab === 'notes'
                        ? 'bg-surface-theme text-indigo-500 dark:text-indigo-400 border-b-2 border-indigo-500 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-foreground'
                        }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <StickyNote className="w-4 h-4" />
                        Notes
                    </div>
                </button>
                <button
                    onClick={() => {
                        setActiveTab('bookmarks');
                        loadBookmarks();
                    }}
                    className={`flex-1 px-4 py-3 font-semibold transition-colors ${activeTab === 'bookmarks'
                        ? 'bg-surface-theme text-indigo-500 dark:text-indigo-400 border-b-2 border-indigo-500 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-foreground'
                        }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <Bookmark className="w-4 h-4" />
                        Bookmarks
                    </div>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'notes' ? (
                    <div className="space-y-4">
                        {/* Add Note Button */}
                        {!showNoteInput && (
                            <button
                                onClick={() => setShowNoteInput(true)}
                                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                            >
                                <StickyNote className="w-4 h-4" />
                                Add Note
                            </button>
                        )}

                        {/* Note Input */}
                        {showNoteInput && (
                            <div className="bg-surface-theme rounded-lg p-4 border border-border-theme">
                                <textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Write your note here..."
                                    className="w-full bg-background text-foreground rounded-lg p-3 border border-border-theme focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none placeholder-slate-500"
                                    rows={4}
                                />
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={saveNote}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowNoteInput(false);
                                            setNewNote('');
                                        }}
                                        className="px-4 py-2 bg-card-theme hover:bg-surface-theme text-foreground rounded-lg font-semibold transition-colors border border-border-theme"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Notes List */}
                        {notes.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                <StickyNote className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="font-semibold text-lg">No notes yet</p>
                                <p className="text-sm mt-1">Add notes to remember important points</p>
                            </div>
                        ) : (
                            notes.map((note) => (
                                <div key={note._id} className="bg-surface-theme rounded-lg p-4 border border-border-theme hover:border-indigo-500/30 transition-colors shadow-sm">
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full uppercase tracking-wider">
                                            Chapter {note.chapterIndex + 1}
                                        </span>
                                        <div className="flex gap-2">
                                            {editingNoteId === note._id ? (
                                                <button
                                                    onClick={() => updateNote(note._id)}
                                                    className="text-emerald-500 hover:text-emerald-400 transition-colors p-1 hover:bg-emerald-500/10 rounded"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setEditingNoteId(note._id);
                                                        setEditingNoteText(note.note);
                                                    }}
                                                    className="text-blue-500 hover:text-blue-400 transition-colors p-1 hover:bg-blue-500/10 rounded"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNote(note._id)}
                                                className="text-slate-400 hover:text-rose-500 transition-colors p-1 hover:bg-rose-500/10 rounded"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    {editingNoteId === note._id ? (
                                        <textarea
                                            value={editingNoteText}
                                            onChange={(e) => setEditingNoteText(e.target.value)}
                                            className="w-full bg-background text-foreground rounded-lg p-3 border border-border-theme focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none text-sm mb-2"
                                            rows={3}
                                        />
                                    ) : (
                                        <p className="text-foreground/90 dark:text-slate-200 text-sm mb-3 leading-relaxed whitespace-pre-wrap">{note.note}</p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                            {new Date(note.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Add Bookmark Button */}
                        {!showBookmarkInput && (
                            <button
                                onClick={() => setShowBookmarkInput(true)}
                                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                            >
                                <Bookmark className="w-4 h-4" />
                                Add Bookmark
                            </button>
                        )}

                        {/* Bookmark Input */}
                        {showBookmarkInput && (
                            <div className="bg-surface-theme rounded-lg p-4 border border-border-theme">
                                <input
                                    type="text"
                                    value={newBookmarkTitle}
                                    onChange={(e) => setNewBookmarkTitle(e.target.value)}
                                    placeholder="Bookmark title (optional)"
                                    className="w-full bg-background text-foreground rounded-lg p-3 border border-border-theme focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500"
                                />
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={saveBookmark}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowBookmarkInput(false);
                                            setNewBookmarkTitle('');
                                        }}
                                        className="px-4 py-2 bg-card-theme hover:bg-surface-theme text-foreground rounded-lg font-semibold transition-colors border border-border-theme"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Bookmarks List */}
                        {bookmarks.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="font-medium">No bookmarks yet</p>
                                <p className="text-sm mt-1">Save important timestamps</p>
                            </div>
                        ) : (
                            bookmarks.map((bookmark) => (
                                <div
                                    key={bookmark._id}
                                    className="bg-surface-theme rounded-lg p-4 border border-border-theme hover:border-indigo-500/50 transition-all group shadow-sm"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1" onClick={() => onSeekTo(bookmark.timestamp)} style={{ cursor: 'pointer' }}>
                                            {editingBookmarkId === bookmark._id ? (
                                                <input
                                                    type="text"
                                                    value={editingBookmarkTitle}
                                                    onChange={(e) => setEditingBookmarkTitle(e.target.value)}
                                                    className="w-full bg-background text-foreground rounded-lg p-2 border border-border-theme focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-semibold mb-1"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <h4 className="text-foreground font-semibold text-sm mb-1 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">{bookmark.title}</h4>
                                            )}
                                            <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-2">
                                                <div className="flex items-center gap-1 bg-background px-2 py-0.5 rounded border border-border-theme">
                                                    <Clock className="w-3 h-3 text-indigo-500" />
                                                    <span>{formatTime(bookmark.timestamp)}</span>
                                                </div>
                                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                                <span className="text-slate-500 dark:text-slate-400">Chapter {bookmark.chapterIndex + 1}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 ml-2">
                                            {editingBookmarkId === bookmark._id ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateBookmark(bookmark._id);
                                                    }}
                                                    className="text-emerald-500 hover:text-emerald-400 transition-colors p-1.5 hover:bg-emerald-500/10 rounded"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingBookmarkId(bookmark._id);
                                                        setEditingBookmarkTitle(bookmark.title);
                                                    }}
                                                    className="text-blue-500 hover:text-blue-400 transition-colors p-1.5 hover:bg-blue-500/10 rounded"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteBookmark(bookmark._id);
                                                }}
                                                className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 hover:bg-rose-500/10 rounded"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
