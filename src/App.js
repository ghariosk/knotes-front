import React from 'react';

import './App.css';

import Router from './Routes';

import { AuthProvider } from './flux/auth/store';
import { NotesProvider } from './flux/notes/store';
import { FriendsProvider } from './flux/friends/store';



function App() {
  return (
    <div className="App">
        <AuthProvider>
          <NotesProvider>
            <FriendsProvider>
              <Router/>
            </FriendsProvider>
          </NotesProvider>
        </AuthProvider>
    </div>
  );
}

export default App;
