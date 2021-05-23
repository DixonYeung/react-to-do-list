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
    const [activeButton, setActiveButton] = useState();


    useEffect(() => {
        if(localStorage.getItem('todolist_record')){
            setRecordList(JSON.parse(localStorage.getItem('todolist_record')));
        }
        else{
            Axios.get("https://dizzon-webapp-server.herokuapp.com/api/todolist").then((response) => {
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
        if( temp[temp.length - 1].id ){
        temp.push({
            "userId": 1,
            "id": temp[temp.length - 1].id + 1,
            "title": newRecord,
            "completed": false
        });
        }
        else{
            temp.push({
            "userId": 1,
            "id": 0,
            "title": newRecord,
            "completed": false
        });
        }
        setRecordList(temp);
        localStorage.setItem('todolist_record', JSON.stringify(temp));
        setRecordList(JSON.parse(localStorage.getItem('todolist_record')));
        setNewRecord('');
    }

    const handleClear = ()=>{
        let temp = [...recordList];
        temp.map((data, i) => {
            data.completed = false;
        });
        setRecordList(temp);
        localStorage.setItem('todolist_record', JSON.stringify(temp));
        setRecordList(JSON.parse(localStorage.getItem('todolist_record')));
    }

    const handleButtonClick = (e)=>{
        if(activeButton){
            activeButton.classList.remove('click');
        }
        e.target.classList.add('click');
        setActiveButton(e.target);
    }
    

    return <div className="App">
        <h1>To do list</h1> 
        <div className="container">
        <div className="tickParent"><input type='text' className='whatToDo' placeholder='what to do ?' onChange={(e)=>handleInputChange(e)} value={newRecord}></input><button onClick={()=>handleAdd()}>Add</button></div>
        
        {recordList.map((r, i) => {
            return <div className={`tickParent ${status == VIEW.SHOWALL ? ' show' : ''} ${status == VIEW.SHOWACTIVE ? r.completed == false ? ' show' : 'collapse' : ''} ${status == VIEW.SHOWCOMPLETED ? r.completed == true ? ' show' : 'collapse' : ''}`}>
                <input className="tick" type="checkbox" checked={r.completed} onChange={() => handleChange(i)}></input>
                <div className="toDoListItem">{r.title}</div>
                <div className="crossmark" onClick={()=> handleDelete(i)}></div>
            </div>
        })}
        </div>

        <button onClick={(e)=> { setStatus(VIEW.SHOWALL); handleButtonClick(e); } }>All</button>
        <button onClick={(e)=> { setStatus(VIEW.SHOWACTIVE); handleButtonClick(e); } }>Active</button>
        <button onClick={(e)=> { setStatus(VIEW.SHOWCOMPLETED); handleButtonClick(e); } }>Completed</button>
        <button onClick={(e)=> { handleClear(); handleButtonClick(e); } }>Clear</button>
    </div>
    
    
}

export default App;
