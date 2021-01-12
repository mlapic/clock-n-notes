// Clock stuff

function timeAndDate() {
  let today = new Date();
  let h = ('0' + today.getHours()).slice(-2);
  let m = ('0' + today.getMinutes()).slice(-2);
  let s = ('0' + today.getSeconds()).slice(-2);
  let options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
  document.getElementById('clock').innerHTML =
    h + ':' + m + ':' + s + '<br>' + 
    today.toLocaleDateString(localStorage.lang, options);
}

if(!localStorage.lang) {
  localStorage.setItem('lang', navigator.language);
}

timeAndDate();
setInterval(timeAndDate, 1000);


// Notes

let notes = [];

if(!localStorage.notes) {
  localStorage.setItem('notes', []);
} else {
  notes = JSON.parse(localStorage.notes);
}



const noteDialogOverlay = document.getElementById('noteDialogOverlay');
const noteTextArea = document.getElementById('noteTextArea');

let selected = -1;

// opens note overlay
document.getElementById('addNewNoteBtn').addEventListener('click', function () {
  noteDialogOverlay.style.height = '100%';
  noteTextArea.value = '';
});

// closes note overlay
document.getElementById('noteDialog_CloseBtn').addEventListener('click', function () {
  noteDialogOverlay.style.height = '0';
  selected = -1;
});




// save note
document.getElementById('noteDialog_SaveBtn').addEventListener('click', function () {
  let newNote = noteTextArea.value;

  if( selected >= 0 ) {

    // update selected note
    notes[selected] = newNote;

    selected = -1;

  } else {

    if(newNote.startsWith('!')) {
      
      if(newNote.startsWith('!setlang')) {
        localStorage.lang = newNote.split(' ')[1];
      } else {
        // add new note to notes array
        notes.push(newNote);
      }
    
    } else {
      // add new note to notes array
      notes.push(newNote);
    }
    
  }

  // print
  rePrint();

  // close note dialog overlay
  noteDialogOverlay.style.height = '0';
});


// delete note
document.getElementById('noteDialog_DeleteBtn').addEventListener('click', function () {

  if(selected >= 0) {
    notes.splice(selected, 1);
    selected = -1;
    rePrint();
  }

  // close note dialog overlay
  noteDialogOverlay.style.height = '0';

});

// creates notes in #notes div and sets click event listeners
function print() {
  
  notes.forEach( function(item, index) {

    let noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.id = index;
    let noteText = document.createTextNode(item);
    noteDiv.appendChild(noteText);
    document.getElementById('notes').appendChild(noteDiv);
  
    noteDiv.addEventListener('click', function() {
      this.toggleAttribute('selected');
      noteDialogOverlay.style.height = '100%';
      noteTextArea.value = this.textContent;
      selected = this.id;
    } );
  } );
}


function rePrint() {
  document.getElementById('notes').innerHTML = '';
  print();
  localStorage.setItem('notes', JSON.stringify(notes));
}

if(notes)
  print();
