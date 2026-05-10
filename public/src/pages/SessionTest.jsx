
import { useState,useEffect} from "react";
import CheckListItem from "../Components/features/sessions/CheckListItem";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@mui/material";
import { projects} from "@/fake_data/data";
// const sessions = [
//   {
//     id: 1,
//     name: "Session 1",
//     checklist: [
//       {
//         id: 1,
//         description: "Login funziona",
//         is_tested: false,
//         outcome: null,
//         note: ""
//       }
//     ]
//   },
//   {
//     id: 2,
//     name: "Session 2",
//     checklist: [{
//          id: 1,
//         description: "Login funziona",
//         is_tested: false,
//         outcome: null,
//         note: ""
//     }]
//   }
// ];


const SessionTest = () =>{
const [lista,setLista] = useState(projects)
const [search,setSearch] = useState('')
const [modal,setModal] = useState(false)
const [selectedTask,setSelectedTask] = useState(null)




const changeStatus = (id, type) => {
  const updatedList = lista.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        is_tested: true, // Il test è stato eseguito
        outcome: type    // 'pass' o 'fail'
      };
    }
    return item;
  });

  setLista(updatedList);
};

const addItem = () =>{

    const newItem = {
        id : lista.length + 1,
        description: "New Test Item",
        is_tested: false,
        outcome: null,
        note: "",
        modify: false
    };

    setLista((prevState)=>(
		[...prevState, newItem]
    ))
    } 

const deleteItem = (id) =>{

const newList = lista.filter((item)=>item.id!== id)

setLista(newList)
}


const filterSearch = () =>{

    return lista.filter((item)=> item.description.toLowerCase().includes(search.toLowerCase()))

    

}

const renderdList = filterSearch()

const handleChange = (e) =>{
  setSearch(e.target.value)


}

const modifyTask = (id) =>{
    
    // setSelectedTask(lista.find((item)=>item.id ===id))

    let newList = lista.map((item) => {
        return item.id === id ? {...item, description: selectedTask?.description, 
            note : selectedTask?.note
        } : item;
    });
    setLista(newList);
    setModal(false);

}

useEffect(()=>{


},[lista])
    return (
        <div >
            <h1>Session Test</h1>
              
              <div>
                 {/* <button onClick={addItem} style={addButtonStyle}>Add Test Item</button> */}
                 <Button onClick={addItem} variant="contained" color="primary"> Add Test Item</Button>
            <TextField 
  label="Search"
  variant="outlined"
  size="small"
  value={search}
  onChange={handleChange}
/>
            

              </div>
           
             <TableContainer component={Paper} style={{ marginTop: "20px" }}>
               <Table>
                 <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Note</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
             <TableBody>

            {renderdList && renderdList.length > 0 ?
                renderdList.map((item) => {
                    return (
                     <CheckListItem 
                      key={item.id}
                      item={item}
                      changeStatus={changeStatus}
                      deleteItem={deleteItem}
                      modal={modal}
                      selectedTask={selectedTask}
                      modifyTask={modifyTask}
                      setModal={setModal}
                      setSelectedTask={setSelectedTask}


                     />
                    )
                })
                : <TableRow>
          <TableCell colSpan={5} align="center">
            No items found
          </TableCell>
        </TableRow>}

                 </TableBody>  

                </Table>
              </TableContainer>
        </div>
    )
    
}

export default SessionTest;