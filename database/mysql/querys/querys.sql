

-- INSERTS QUERYS

INSERT INTO users(username, first_name, last_name, email, password, is_admin) 
VALUES 
('jesusmachaca', 'Jesus Gonzalo', 'Machaca Hancco', 'falcorgd@gamil.com', 'godylody31', true),
('gonzalo10', 'Gonzalo', 'Hancco', 'falcorg@gamil.com', 'godylody31', false),
('machaca', 'Jesus Gonzalo', 'Machaca Hancco', 'falcod@gamil.com', 'godylody31', false);

INSERT INTO posts(user_id, post)
VALUES
(1, 'Cómo están todos, espero que se encuentren muy bien, aqui yo luchando contra esta enfermedad. Solo quiero decirles y pedires que no se rindan, por nada del mundo, l@s quiero mucho'),
(3, 'Cómo están todos, espero que se encuentren muy bien, aqui yo luchando contra esta enfermedad. Solo quiero decirles y pedires que no se rindan, por nada del mundo, l@s quiero mucho'),
(2, 'Cómo están todos, espero que se encuentren muy bien, aqui yo luchando contra esta enfermedad. Solo quiero decirles y pedires que no se rindan, por nada del mundo, l@s quiero mucho');

INSERT INTO recipes(user_id)
VALUES 
(1),
(1),
(1);


INSERT INTO medicines(recipe_id, medicine_name, amount, hours)
VALUES 
(1, 'Diclofenaco', 1, 8),
(1, 'Oxycodona', 1, 8),
(1, 'Ibuprofeno', 1, 12),
(2, 'Diclofenaco', 1, 8),
(2, 'Oxycodona', 1, 8),
(2, 'Ibuprofeno', 1, 12),

INSERT INTO vital_signs(user_id, temperature, heart_rate)
VALUES
(1, 20.50, 100.21),
(1, 19.50, 90.20),
(3, 22.50, 75.80),
(2, 21.30, 62.60);

-- SELECT QUERYS

SELECT * FROM users;

SELECT medicines.id, users.username, medicines.medicine_name, medicines.amount, hours 
FROM medicines 
INNER JOIN users
ON medicines.user_id=users.id
WHERE users.id=1;

SELECT vital_signs.id, users.username, vital_signs.temperature, vital_signs.heart_rate, vital_signs.measured_date
FROM vital_signs
JOIN users
ON vital_signs.user_id=users.id
WHERE users.id=1;

SELECT posts.id, users.username, posts.post, posts.date_publish
FROM posts
JOIN users
on posts.user_id=users.id
WHERE users.id=1;


SELECT recipes.id, users.username, medicines.medicine_name 
FROM recipes 
JOIN medicines 
ON recipes.id=medicines.recipe_id 
JOIN users ON recipes.user_id=users.id 
WHERE user_id=2;