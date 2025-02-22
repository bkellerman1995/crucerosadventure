UPDATE crucero
SET Foto = LOAD_FILE('C:\\xampp\\htdocs\\crucerosadventure\\uploads\\costaMexicana.jpg')
WHERE nombre LIKE '%mexicana%';