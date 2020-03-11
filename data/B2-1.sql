/*
Составить статистику по пользователям в разрезе счетов
*/
------------------------------------------------------
 SELECT [User],
		[Account],
		SUM ([Entry_amount]) AS [Total_amount]
   FROM f_portal_dataset
  GROUP BY [User],
		[Account]
  ORDER BY 1,2