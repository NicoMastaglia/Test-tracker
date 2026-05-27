



// filtro di ricerca riutilizzabile, prende in input la stringa di ricerca, la lista da filtrare e le chiavi su cui effettuare la ricerca
export const filterSearch = (search,list,keys) =>{
    const normalizedSearch = search.trim().toLowerCase(); 

    if(!normalizedSearch) return list; 
    
    return list.filter((item)=>{
       
        return keys.some((key)=>
             String(item[key] ?? "").toLowerCase().includes(normalizedSearch)
        )
    })
}


 