Для генерации ttl файла из csv нужно:
  - задать имя csv-файла в скрипте маппинга 'f_portal_dataset.rqg' (первый параметр в блоке 'ITERATOR iter:CSV') в формате <http://example.com/resource/*имя_файла*>;
  - запустить утилиту 'sparql-generate-2.0-SNAPSHOT.jar' командой:
 `java -jar sparql-generate-2.0-SNAPSHOT.jar -q f_portal_dataset.rqg -b http://example.com/resource/ -o f_portal_dataset.ttl -of TTL -l INFO`  
В результате получим файл f_portal_dataset.ttl, который можно использовать при создании проектаю
