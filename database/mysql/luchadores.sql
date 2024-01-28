DROP DATABASE IF EXISTS luchadores_test;
CREATE DATABASE IF NOT EXISTS luchadores_test;
USE luchadores_test;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    is_admin BOOLEAN,
    is_staff BOOLEAN,
    is_active BOOLEAN,
    date_joined TIMESTAMP NOT NULL DEFAULT (NOW())
);

CREATE TABLE profile (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id INT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    profile_image VARCHAR(255),
    date TIMESTAMP NOT NULL DEFAULT (NOW())
);

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    post TEXT,
    post_image VARCHAR(255),
    date_publish TIMESTAMP NOT NULL DEFAULT (NOW())
);

CREATE TABLE medicines (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    medicine_name VARCHAR(60) NOT NULL,
    amount INT NOT NULL,
    hours INT NOT NULL
);

CREATE TABLE vital_signs (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    temperature DECIMAL(4, 2),
    heart_rate DECIMAL(5, 2),
    measured_date TIMESTAMP NOT NULL DEFAULT (NOW())
);