const express = require("express");
const router = express.Router();
const checkSuperadmin = require("../middleware/checkSuperadmin");
const db = require("../database/db");





router.get('/',checkSuperadmin,async (req,res)=>{

    const limit = Math.min(Number(req.query.limit) || 50, 200);


    try{
        const [activities] = await db.execute(
      `SELECT u.id as user_id, a.id, a.action, a.details, a.timestamp, a.project_id,
              u.nome, u.cognome, p.name AS project_name, ct.title AS checklist_name
       FROM audit_log a
       LEFT JOIN user u ON a.user_id = u.id
       LEFT JOIN project p ON p.id = a.project_id
       LEFT JOIN checklist_item ci ON ci.id = CAST(JSON_UNQUOTE(JSON_EXTRACT(a.details, '$.itemId')) AS UNSIGNED)
       LEFT JOIN checklist_template ct ON ct.id = COALESCE(
         CAST(JSON_UNQUOTE(JSON_EXTRACT(a.details, '$.checklistId')) AS UNSIGNED),
         CAST(JSON_UNQUOTE(JSON_EXTRACT(a.details, '$.templateId')) AS UNSIGNED),
         ci.template_id
       )
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