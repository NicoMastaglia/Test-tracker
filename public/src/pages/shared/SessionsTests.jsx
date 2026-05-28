// import React,{useState,useEffect, use}from "react";
// import { useParams } from "react-router-dom";
// import { testResults } from "../fake_data/data";
// import { Table, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
// import CheckListTable from "@/Components/features/checkList/CheckListTable";
// import {Box, Typography} from "@mui/material";
// const SessionsTests = () =>{


//   let {id}  = useParams()


//   const [lista,setLista] = useState([])

// useEffect(() => {
//         const filtered = testResults.filter((item) => item.session_id === parseInt(id));
//         setLista(filtered);
//     }, [id]);
//   const [modal,setModal] = useState(false)
//   const [selectedTask,setSelectedTask] = useState(null)
  
//   const changeStatus = (id, type) => {
//     const updatedList = lista.map((item) => {
//       if (item.id === id) {
//         return {
//           ...item,
//           is_tested: true,
//           outcome: type
//         };
//       }
//       return item;
//     });
  
//     setLista(updatedList);
//   };
  
//   const deleteItem = (id) =>{
  
//   const newList = lista.filter((item)=>item.id!== id)
  
//   setLista(newList)
//   }
  
//   const modifyTask = (id) =>{
      
//       let newList = lista.map((item) => {
//           return item.id === id ? {...item, description: selectedTask?.description, 
//               note : selectedTask?.note
//           } : item;
//       });
//       setLista(newList);
//       setModal(false);
//   }
  
//   useEffect(()=>{
  
  
//   },[lista])
  
//   return (
     
//         <div className="flex flex-col gap-4 m-6">
    
//         <div className="mb-6">
//   <h4 className="scroll-m-20 text-xl font-bold tracking-tight text-[#333] mb-1">
//     Dettagli Sessione {id}
//   </h4>
  
//   <p className="text-base text-[#666] leading-7">
//     Visualizza e gestisci i test associati alla sessione.
//   </p>
  
//   <p className="text-base text-[#666] leading-7 mt-2">
//     Qui puoi monitorare lo stato dei test, modificare descrizioni e note, e visualizzare i risultati.
//   </p>
// </div>
        
        

//         <CheckListTable 
//         lista={lista}
//         changeStatus={changeStatus}
//         deleteItem={deleteItem}
//         modal={modal}
//         selectedTask={selectedTask}
//         modifyTask={modifyTask}
//         setModal={setModal}
//         setSelectedTask={setSelectedTask}

// />



//       </div>
//   )

// }

// export default SessionsTests;
// import React,{useState,useEffect, use}from "react";
// import { useParams } from "react-router-dom";
// import { testResults } from "../fake_data/data";
// import { Table, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
// import CheckListTable from "@/Components/features/sessions/CheckListTable";
// import {Box, Typography} from "@mui/material";
// const SessionsTests = () =>{


  

//   let {id}  = useParams()


//   const [lista,setLista] = useState([])

// useEffect(() => {
//         const filtered = testResults.filter((item) => item.session_id === parseInt(id));
//         setLista(filtered);
//     }, [id]);
// //   const [search,setSearch] = useState('')
//   const [modal,setModal] = useState(false)
//   const [selectedTask,setSelectedTask] = useState(null)
  
  
  
  
//   const changeStatus = (id, type) => {
//     console.log(id)
//     const updatedList = lista.map((item) => {
//       if (item.id === id) {
//         return {
//           ...item,
//           is_tested: true,
//           outcome: type
//         };
//       }
//       return item;
//     });
  
//     setLista(updatedList);
//   };
  
// //   const addItem = () =>{
  
// //       const newItem = {
// //           id : lista.length + 1,
// //           description: "New Test Item",
// //           is_tested: false,
// //           outcome: null,
// //           note: "",
// //           modify: false
// //       };
  
// //       setLista((prevState)=>(
// //         [...prevState, newItem]
// //       ))
// //       } 
  
//   const deleteItem = (id) =>{
  
//   const newList = lista.filter((item)=>item.id!== id)
  
//   setLista(newList)
//   }
  
  
//   const filterSearch = () =>{
  
//       return lista.filter((item)=> item.description.toLowerCase().includes(search.toLowerCase()))
  
      
  
//   }
  
// //   const renderdList = filterSearch()
  
// //   const handleChange = (e) =>{
// //     setSearch(e.target.value)
  
  
// //   }
  
//   const modifyTask = (id) =>{
      
//       // setSelectedTask(lista.find((item)=>item.id ===id))
  
//       let newList = lista.map((item) => {
//           return item.id === id ? {...item, description: selectedTask?.description, 
//               note : selectedTask?.note
//           } : item;
//       });
//       setLista(newList);
//       setModal(false);
  
//   }
  
//   useEffect(()=>{
  
  
//   },[lista])

//   return (
     
//         <div className="flex flex-col gap-4 m-6">
    
//         <div className="mb-6">
//   <h4 className="scroll-m-20 text-xl font-bold tracking-tight text-[#333] mb-1">
//     Dettagli Sessione {id}
//   </h4>
  
//   <p className="text-base text-[#666] leading-7">
//     Visualizza e gestisci i test associati alla sessione.
//   </p>
  
//   <p className="text-base text-[#666] leading-7 mt-2">
//     Qui puoi monitorare lo stato dei test, modificare descrizioni e note, e visualizzare i risultati.
//   </p>
// </div>
        
        

//         <CheckListTable 
//         lista={lista}
//         changeStatus={changeStatus}
//         deleteItem={deleteItem}
//         modal={modal}
//         selectedTask={selectedTask}
//         modifyTask={modifyTask}
//         setModal={setModal}
//         setSelectedTask={setSelectedTask}

// />



//       </div>
//   )

// }

// export default SessionsTests;
