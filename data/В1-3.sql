/*
¬ы€вить сторнированные проводки, сделанные в июле-сент€бре
*/
------------------------------------------------------
 SELECT *
   FROM f_portal_dataset
  WHERE Reversed = 'Yes'
		AND MONTH([Entry_date]) IN ('9', '8', '7')
