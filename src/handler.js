const { nanoid } = require('nanoid');
const notes = require('./notes');

// Menambahkan note
const addNoteHandler = (request, h) => {
    const {title, tags, body} = JSON.parse(request.payload);

    const id = nanoid(16);
    const createdAt = new Date().toISOString;
    const updateAt = createdAt;

    const newNote = {
        id,
        title,
        tags,
        body,
        createdAt,
        updateAt,
    }

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;
 
    if (isSuccess) {
        const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
            noteId: id,
        },
        });
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });
    return response;
};

// Menampilkan semua note
const getAllNotesHandler = () => ({
    status: 'success',
    data: {
      notes,
    },
});

//  Menampilkan note berdasarkan parameter url (id)
const getNotesByIdHandler = (request, h) => {
    const {id} = request.params;

    const note = notes.filter((note) => note.id === id)[0];
    console.log(note);

    if(note){
        return {
            status: 'success',
            data: {
                note,
            }
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'catatan tidak ditemukan',
    });
    return response;
};

// Mengedit note berdasarkan parameter url (id)
const editNoteByIdaHandler = (request, h) => {
    const {id} = request.params;
    const {title, tags, body} = JSON.parse(request.payload);
    console.log(title);
    const updateAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if(index !== -1){
        notes[index] = {
            ...notes[index],
            title, 
            tags,
            body,
            updateAt
        };

        const response = h.response({
            status: 'success',
            message: 'catatan berhasil diperbarui',
        });
        return response;
    }
    
    const response = h.response({
        status: 'fail',
        message: 'Id tidak ditemukan'
    });
    return response;
};

// Menghapus note berdasarkan parameter url (id)
const deleteNoteByIdHandler = (request, h) => {
    const {id} = request.params;
    const index = notes.findIndex((note) => note.id === id);

    if(index !== -1){
        notes.splice(index, 1);
        
        const response = h.response({
            status: 'success',
            message: 'berhasil menghapus note'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Id tidak ditemukan',
    }); 
    return response;
};

module.exports = {
    addNoteHandler,
    getAllNotesHandler,
    getNotesByIdHandler,
    editNoteByIdaHandler,
    deleteNoteByIdHandler,
};