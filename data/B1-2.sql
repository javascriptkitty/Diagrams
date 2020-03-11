/*
Необходимо выявить проводки по счетам, использовавшимся менее 4 раз
*/
-------------------------------------------------------- 
 SELECT pwc_id, 'B1.2'
   FROM f_portal_dataset
   JOIN
	(SELECT [Account], COUNT(*) AS [Quantity]
	   FROM f_portal_dataset
	  GROUP BY [Account]
	 HAVING COUNT(*) < 4) AS stat
ON f_portal_dataset.[Account] = stat.[Account]
