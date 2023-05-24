class Notes {
    
    /*
    {id:0, content:'',style: '',align: '', status: false}
    */
    _notes;

    constructor(){
        this._notes = [];
    }

    getNotes(){
        return this._notes;
    }

    setNotes(notes){
        this._notes = notes;
    }

    addNotes(note){
        note['id'] = this.genNextId();
        this._notes.push(note)
    }

    getNote(id){
        for(let i=0;i<this._notes.length;i++) {
            if(this._notes[i].id === id) {
                return this._notes[i]
            }
        }
        return null;
    }

    getNoteIndex(id) {
        for(let i=0;i<this._notes.length;i++) {
            if(this._notes[i].id === id) {
                return i
            }
        }
        return null;
    }

    deleteNote(id){
        const i = this.getNoteIndex(id)
        this._notes.splice(i,1);
    }

    updateNote(id,item) {
        const i = this.getNoteIndex(id);
        this._notes.splice(i,1,item);
    }

    genNextId(){
        let maxId = 0;
        for(let i=0;i<this._notes.length;i++) {
            if(maxId<this._notes[i].id) {
                maxId+=1;
            }
        }
        return +maxId+1;
    }

    saveToLocalStorage(){
        const data = JSON.stringify(this._notes);
        localStorage.setItem("notes",data);
    }

    loadFromLocalStorage(){
        let data = localStorage.getItem("notes");
        if(!data) { this._notes = []; return}
        
        this._notes = JSON.parse(data);
    }
}