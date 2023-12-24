USE movie_app;
DELETE FROM users WHERE username = 'admin';
INSERT INTO users (email, name, year_of_birth, month_of_birth, day_of_birth, is_active, is_admin, is_content_admin, username, password_hash) 
VALUES ('admin', 'Admin', 1980, 1, 1, True, True, True, 'admin', '$2b$12$3TLgHhJR7s5o..LEVC1NS.t6xPLxJ65kr85pi8BHp5d7o4F1WXb7C');