import React, { useState, useEffect } from "react";
import './App.css';
import Axios from "axios";

function App() {
    const VIEW = {
        SHOWALL: 'SHOWALL',
        SHOWCOMPLETED: 'SHOWCOMPLETED',
        SHOWACTIVE: 'SHOWACTIVE'
    }
    const [recordList, setRecordList] = useState([]);
    const [newRecord, setNewRecord] = useState('');


      const [status, setStatus] = useState(VIEW.SHOWALL);



    useEffect(() => {
        if(localStorage.getItem('todolist_record')){
            setRecordList(JSON.parse(localStorage.getItem('todolist_record')));
        }
        else{
            Axios.get("https://jsonplaceholder.typicode.com/todos").then((response) => {
                if (response.data.length > 0) {
                    let temp = [];
                    response.data.map((r, i) => {
                        if (i >= 10) return;
                        temp.push(r);
                    })
                    
                    localStorage.setItem('todolist_record', JSON.stringify(temp));
                    setRecordList(JSON.parse(localStorage.getItem('todolist_record')));
                }
                else {
                    console.log("error fetching todo list from jsonplaceholder.typicode.com");
                }
            });
        }
    }, []);

    Axios.defaults.withCredentials = true;



    const handleChange = (i)=>{
        let temp = [...recordList];
        temp[i].completed = !temp[i].completed;
        setRecordList(temp);
        localStorage.setItem('todolist_record', JSON.stringify(recordList));
        setRecordList(JSON.parse(localStorage.getItem('todolist_record')));
    }

    const handleDelete = (i) => {
        let temp = [...recordList];
        temp.splice(i,1);
        setRecordList(temp);
        localStorage.setItem('todolist_record', JSON.stringify(temp));
        setRecordList(JSON.parse(localStorage.getItem('todolist_record')));
    }
    
    const handleInputChange = (e) => {
        setNewRecord(e.target.value);
    }

    const handleAdd = ()=>{
        let temp = [...recordList];
        temp.push({
            "userId": 1,
            "id": temp[temp.length - 1].id + 1,
            "title": newRecord,
            "completed": false
        });
        setRecordList(temp);
        localStorage.setItem('todolist_record', JSON.stringify(temp));
        setRecordList(JSON.parse(localStorage.getItem('todolist_record')));
        setNewRecord('');
    }

    

    return <div className="App">
        <h1>To do list</h1>
        { recordList.length > 0 ? 
        <div className="container">
        <div className="tickParent"><input type='text' className='whatToDo' placeholder='what to do ?' onChange={(e)=>handleInputChange(e)} value={newRecord}></input><button onClick={()=>handleAdd()}>Add</button></div>
        {recordList.map((r, i) => {
            return <div className={`tickParent ${status == VIEW.SHOWALL ? ' show' : ''} ${status == VIEW.SHOWACTIVE ? r.completed == false ? ' show' : 'collapse' : ''} ${status == VIEW.SHOWCOMPLETED ? r.completed == true ? ' show' : 'collapse' : ''}`}>
                <input className="tick" type="checkbox" checked={r.completed} onChange={() => handleChange(i)}></input>
                <div className="toDoListItem">{r.title}</div>
                <div className="crossmark" onClick={()=> handleDelete(i)}></div>
            </div>
        })}
        
        </div> : 
        <div>loading...</div> 
        }

        <button onClick={()=>setStatus(VIEW.SHOWALL)}>All</button>
        <button onClick={()=>setStatus(VIEW.SHOWACTIVE)}>Active</button>
        <button onClick={()=>setStatus(VIEW.SHOWCOMPLETED)}>Completed</button>
    </div>
    
    
}

export default App;
