UPDATE templates
SET is_premium = FALSE
WHERE id = 1;

UPDATE users
SET premium = TRUE
WHERE uuid = '88cc80d5-cde0-46b6-815e-d64de2e0c26d';
