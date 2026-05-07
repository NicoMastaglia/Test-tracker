import React,{useState,useEffect, use}from "react";
import { useParams } from "react-router-dom";
import { testResults } from "../fake_data/data";
import { Table, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import CheckListTable from "@/Components/features/sessions/CheckListTable";
import {Box, Typography} from "@mui/material";
const SessionsTests = () =>{


  

  let {id}  = useParams()


  const [lista,setLista] = useState([])

useEffect(() => {
        const filtered = testResults.filter((item) => item.session_id === parseInt(id));
        setLista(filtered);
    }, [id]);
//   const [search,setSearch] = useState('')
  const [modal,setModal] = useState(false)
  const [selectedTask,setSelectedTask] = useState(null)
  
  
  
  
  const changeStatus = (id, type) => {
    console.log(id)
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
  
//   const addItem = () =>{
  
//       const newItem = {
//           id : lista.length + 1,
//           description: "New Test Item",
//           is_tested: false,
//           outcome: null,
//           note: "",
//           modify: false
//       };
  
//       setLista((prevState)=>(
//         [...prevState, newItem]
//       ))
//       } 
  
  const deleteItem = (id) =>{
  
  const newList = lista.filter((item)=>item.id!== id)
  
  setLista(newList)
  }
  
  
  const filterSearch = () =>{
  
      return lista.filter((item)=> item.description.toLowerCase().includes(search.toLowerCase()))
  
      
  
  }
  
//   const renderdList = filterSearch()
  
//   const handleChange = (e) =>{
//     setSearch(e.target.value)
  
  
//   }
  
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
     

    <Box sx={{ p: 4, backgroundColor: '#f5f5f5', minHeight: '100vh'}}>
        <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 1 }}>
          Dettagli Sessione {id}
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
          Visualizza e gestisci i test associati alla sessione.
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
          Qui puoi monitorare lo stato dei test, modificare descrizioni e note, e visualizzare i risultati.
        </Typography>

        <CheckListTable 
        lista={lista}
        changeStatus={changeStatus}
        deleteItem={deleteItem}
        modal={modal}
        selectedTask={selectedTask}
        modifyTask={modifyTask}
        setModal={setModal}
        setSelectedTask={setSelectedTask}

/>

</Box>


  

  )

}

export default SessionsTests;