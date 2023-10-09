import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react'
import { getStoredNotes } from '~/data/notes';
import styles from '~/styles/note-details.css';

export default function NoteDetailsPage() {
  const note = useLoaderData();

  return (
    <main id='note-details'>
      <header>
        <nav>
          <Link to="/notes">Back to all Notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id="note-details-content">{note.content}</p>
    </main>
  )
}

// `params` provient d'un paramère d'entrée d'une fonction `action`
export async function loader({params}) {
  const notes = await getStoredNotes();
  // correspondance avec le nom de fichier `notes.noteId.tsx`
  const noteId = params.noteId;
  const selectedNote = notes.find(note => note.id === noteId);

  if (!selectedNote) {
    throw json(
      { message: `Could not find note for id ${noteId}` },
      { status: 404 }
    );
  }
  return selectedNote;
}
export const meta = ({data}) => {
  return [
    { title: data.title },
    { description: "Manage your notes with ease." },
  ]
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}
