const list = document.querySelector('#cards');
const form = document.querySelector('form');
const addApplication = (application,id,fireid) => {
    let time = application.created_at.toDate();
    let html = `
        <div class="jumbotron" id="${id}" data-id="${fireid}">
            <h2 class="display-4" name="title">${application.title}</h2>
            <p class="lead" name="body">${application.body}</p>
            <hr class="my-4">
            <p name="important">${application.important}</p>
            <p class="lead" name="time">${time}</p>
            <button class="btn btn btn-warning btn-sm my-2" id='applicationUpdate' value="edit">edit</button>
            <button class="btn btn-danger btn-sm my-2" id='applicationDelete' value="delete">delete</button>
          
        </div>
    `;

    list.innerHTML += html;
}
function updateView(){
    db.collection('application').get().then(snapshot => {
            let id = 0;
            snapshot.docs.forEach(doc => {
                addApplication(doc.data(),id,doc.id);
                id++;
            })
            }).catch(err => {
                console.log(err)
        })

}
updateView();

form.addEventListener('click', e => {
    e.preventDefault();
    if(e.target.value == 'add'){
    const now = new Date();

    const application = {
        title: form.title.value,
        body: form.body.value,
        important: form.important.value,
        created_at: firebase.firestore.Timestamp.fromDate(now)
    }
    db.collection('application').add(application).then(() => {
        console.log("application add")
        updateview();
    }).catch(err => {
        console.log(err)
        
    })

  }  else if(e.target.value === 'update'){
        let id = form.fireid.value;
        db.collection('application').doc(id).update({
            title: form.title.value,
            body: form.body.value,
            important: form.important.value,

        }).then(() => {
            console.log("application update"); 
        }).catch(err => {
            console.log(err)
        }).then(() => {
            console.log("hello");})
        
  }
    
})

function clearValue(){

    form.fireid.value = "";
    form.title.value = "";
    form.body.value = "";
    form.important.value = "";
    
}

function insertUpdateandedit(id,fireid){
    db.collection('application').get().then(snapshot => {
    form.title.value = snapshot.docs[id].data().title;   
    form.body.value = snapshot.docs[id].data().body;
    form.important.value = snapshot.docs[id].data().important;
    form.fireid.value = fireid;
    });
    
}
list.addEventListener('click', e => {
    const fireid = e.target.parentElement.getAttribute('data-id');
    // console.log("fireid", fireid)
    const id = e.target.parentElement.getAttribute('id');
   // console.log("id", id)
    if(e.target.value === 'delete'){
            db.collection('application').doc(fireid).delete().then(() => {
                console.log("application delete");
            }).catch(err => {
                console.log(err);
            })
    }
    if(e.target.value === 'edit'){

        insertUpdateandedit(id,fireid);
    }    
})
