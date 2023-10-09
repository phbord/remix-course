import { json, redirect } from "@remix-run/node";
import { Link, isRouteErrorResponse, useLoaderData, useRouteError } from "@remix-run/react";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "~/components/NoteList";
import { getStoredNotes, storeNotes } from '~/data/notes';

export default function NotesPage() {
  const notes = useLoaderData();
  
  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  )
}

export async function loader() {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    throw json(
      {
        message: "Could not find any notes."
      }, {
        status: 404,
        statusText: 'Not found'
      }
    );
  }
  return json(notes);
}

export async function action({request, params}) {
  const formData = await request.formData();
  // 2 versions
  /* const noteData = {
    title: formData.get('title'),
    content: formData.get('content'),
  }; */
  const noteData = Object.fromEntries(formData);
  
  if (noteData.title.trim().length < 5) {
    return {message: "Invalid title - must be at least 5 characteres long."}
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  //await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000))
  return redirect('/notes');
}

export function ErrorBoundary() {
  const error = useRouteError();

  // Equivaut à `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    const message = error.data?.message || 'Data not found.';
    return(
      <main>
        <NewNote />
        <p className="info-message">{message}</p>
      </main>
    )
  }

  return (
    <main className="error">
      <h1>An error related to your notes occurred!</h1>
      <p>{error.message}</p>
      <p>Back to <Link to="/">safety</Link>!</p>
    </main>
  )
}

export const meta = () => {
  return [
    { title: "All notes" },
    { description: 'Manage your notes with ease.' }
  ]
}

export function Links() {
  return [...newNoteLinks(), ...noteListLinks()]
}