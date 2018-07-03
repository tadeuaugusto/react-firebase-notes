import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import fire_config from './fire_config';
import Note from './Note/Note';
import NoteForm from './NoteForm/NoteForm';
import * as firebase from 'firebase';

/*
based on 'https://www.youtube.com/watch?v=-RtJroTMDf4' tutorial
*/
class App extends Component {
  constructor(props) {
    super(props);
    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);

    // 1. connect to firebase
    this.app = firebase.initializeApp(fire_config);
    this.database = this.app.database().ref().child('notes');

    this.state = {
      notes: []
    }
  }

  componentWillMount() {
    const previousNote = this.state.notes;

    // firebase data snapshot - child_added
    this.database.on('child_added', snap => {
      previousNote.push({
        id: snap.key,
        noteContent: snap.val().noteContent,
      })

      this.setState({
        notes: previousNote
      })
    })

    // firebase data snapshot - child_removed
    this.database.on('child_removed', snap => {
      for (var i = 0; i < previousNote.length; i++) {
        if (previousNote[i].id === snap.key) {
          previousNote.splice(i, 1);
        }
      }

      this.setState({
        notes: previousNote
      })
    })
  }

  // 2. add note
  addNote(note) {
    this.database.push().set({ noteContent: note })
  }

  // 3. remove note
  removeNote(noteId) {
    this.database.child(noteId).remove();
  }

  render() {
    return (
      <div className="App">
        <div className="notesWrapper">
          <div className="notesHeader">
            <div className="heading">
              <img src={logo} className="App-logo" alt="logo" />
            </div>
          </div>
          <div className="notesBody">
          {
            this.state.notes.map((note) => {
              return (
                <Note noteContent={note.noteContent}
                      noteId={note.id}
                      key={note.id}
                      removeNote={this.removeNote} />
              )
            })
          }
          </div>
          <div className="notesFooter">
            <NoteForm addNote={this.addNote} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
