const express = require("express");
const router = express.Router();
const checkSuperadmin = require("../middleware/checkSuperadmin");
const db = require("../database/db");





router.get('/',checkSuperadmin,async (req,res)=>{

    const limit = Math.min(Number(req.query.limit) || 50, 500);
    const { dateFrom, dateTo } = req.query;

    try{
        const whereClauses = [];
        const queryParams = [];
        if (dateFrom) { whereClauses.push("a.timestamp >= ?"); queryParams.push(dateFrom + " 00:00:00"); }
        if (dateTo)   { whereClauses.push("a.timestamp <= ?"); queryParams.push(dateTo   + " 23:59:59"); }
        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

        const [activities] = await db.execute(
      `SELECT u.id as user_id, a.id, a.action, a.details, a.timestamp, a.project_id,
              u.nome, u.cognome, p.name AS project_name, ct.title AS checklist_name, ci.description AS task_description,
              ru.nome AS related_user_nome, ru.cognome AS related_user_cognome, rs.started_at AS session_started_at
       FROM audit_log a
       LEFT JOIN user u ON a.user_id = u.id
       LEFT JOIN project p ON p.id = a.project_id
       LEFT JOIN checklist_item ci ON ci.id = CAST(JSON_UNQUOTE(JSON_EXTRACT(a.details, '$.itemId')) AS UNSIGNED)
       LEFT JOIN checklist_template ct ON ct.id = COALESCE(
         CAST(JSON_UNQUOTE(JSON_EXTRACT(a.details, '$.checklistId')) AS UNSIGNED),
         CAST(JSON_UNQUOTE(JSON_EXTRACT(a.details, '$.templateId')) AS UNSIGNED),
         ci.template_id
       )
       LEFT JOIN user ru ON ru.id = COALESCE(
         CAST(JSON_UNQUOTE(JSON_EXTRACT(a.details, '$.assignedTo')) AS UNSIGNED),
         CAST(JSON_UNQUOTE(JSON_EXTRACT(a.details, '$.userId')) AS UNSIGNED)
       )
       LEFT JOIN test_session rs ON rs.id = CAST(JSON_UNQUOTE(JSON_EXTRACT(a.details, '$.sessionId')) AS UNSIGNED)
       ${whereSQL}
       ORDER BY a.timestamp DESC
       LIMIT ?`,
      [...queryParams, String(limit)]
    );

    return res.status(200).json({
        activities
    })

    }catch(err){
          console.error(err);
          return res.status(500).json({ error: "Errore del server" });
    }


})

module.exports = router;