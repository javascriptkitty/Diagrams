/*
Выявление проводок на сумму, отличающуюся от заданного порога менее чем на заданное отклонение.
*/
----------------------------------------------------------------------------------
DECLARE @THRESHOLD DECIMAL (18, 2) = 1000000.00,
		@DEVIATION DECIMAL (18, 2) = 1.0 

 SELECT pwc_id, 'B4.3'
   FROM [dbo].[f_portal_dataset] 
  WHERE ABS([Entry_amount]) BETWEEN (@THRESHOLD * (1 - 0.01 * @DEVIATION)) AND @THRESHOLD
