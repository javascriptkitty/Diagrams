/*
Необходимо выявить нетипичную корреспонденцию со счетами выручки (90.01).
Типичной считается корреспонденция кредит 90.01 + кредит 68 с дебетом 62 и 76 счетов.

Счета считаются корреспондирующими, если в рамках одного документа ([Document_number]) сумма оборотов по счетам по кредиту (отрицательные суммы)
равна сумме оборотов по счетам по дебету (положительные суммы)
*/
---------------------------------------------------------------------
  SELECT pwc_id, 'C1'
  FROM f_portal_dataset
  JOIN
    (
      SELECT rev.[Document_number], rev_amount + ISNULL (vat_amount, 0.00) AS rev_amount
	    FROM
        (
          SELECT [Document_number], SUM ([Entry_amount]) AS rev_amount
          FROM f_portal_dataset
          WHERE LEFT ([Account], 5) = '90.01'
          GROUP BY [Document_number]
        ) AS rev
		  LEFT JOIN
			  (
          SELECT [Document_number], SUM ([Entry_amount]) as vat_amount
          FROM f_portal_dataset
          WHERE LEFT ([Account], 2) = '68'
          GROUP BY [Document_number]
        ) AS vat
      ON rev.[Document_number] = vat.[Document_number]
    ) rev_v
  ON f_portal_dataset.[Document_number] = rev_v.[Document_number]
  LEFT JOIN
    (
      SELECT [Document_number], SUM ([Entry_amount]) as norm_amount
      FROM f_portal_dataset
      WHERE LEFT ([Account], 2) IN ('62', '76')
      GROUP BY [Document_number]
    ) AS norm
  ON rev_v.[Document_number] = norm.[Document_number]
  AND rev_v.rev_amount = -norm.norm_amount
  WHERE norm.[Document_number] IS NULL
