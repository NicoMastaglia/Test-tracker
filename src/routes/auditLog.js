const express = require("express");
const router = express.Router();
const checkSuperadmin = require("../middleware/checkSuperadmin");
const db = require("../database/db");





router.get('/',checkSuperadmin,async (req,res)=>{

    const limit = Math.min(Number(req.query.limit) || 50, 200);


    try{
        const [activities] = await db.execute(
      `SELECT u.id as user_id ,a.id, a.action, a.details, a.timestamp, a.project_id, u.nome, u.cognome
       FROM audit_log a
       LEFT JOIN user u ON a.user_id = u.id
       ORDER BY a.timestamp DESC
       LIMIT ?`,
      [String(limit)]
    );

    return res.status(200).json({
        activities
    })

    }catch(err){
          return res.status(500).json({ error: "Errore del server", specific: err.message });
    }


})

module.exports = router;