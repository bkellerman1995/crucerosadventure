UPDATE crucero
SET Foto = LOAD_FILE('C:\\xampp\\htdocs\\crucerosadventure\\uploads\\costaMexicana.jpg')
WHERE nombre LIKE '%mexicana%';

UPDATE crucero
SET Foto = LOAD_FILE('C:\\xampp\\htdocs\\crucerosadventure\\uploads\\mediterraneoOriental.jpg')
WHERE nombre LIKE '%oriental%';

UPDATE crucero
SET Foto = LOAD_FILE('C:\\xampp\\htdocs\\crucerosadventure\\uploads\\panama.jpg')
WHERE nombre LIKE '%panamá%';

