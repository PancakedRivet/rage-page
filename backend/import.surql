-- ------------------------------
-- OPTION
-- ------------------------------
OPTION IMPORT;
-- ------------------------------
-- SCOPES
-- ------------------------------
DEFINE SCOPE admin SESSION 12h SIGNIN (
    SELECT *
    FROM users
    WHERE user = 'admin'
        AND crypto::argon2::compare(pass, $pass)
);
DEFINE SCOPE basic SESSION 1d SIGNIN (
    SELECT *
    FROM users
    WHERE user = 'basic'
);
-- ------------------------------
-- TABLE: complaints
-- ------------------------------
DEFINE TABLE complaints SCHEMAFULL PERMISSIONS FOR
select,
    update,
    delete
WHERE $auth.user = 'admin',
    FOR create FULL;
DEFINE FIELD complaint ON complaints TYPE string ASSERT $value != NONE;
DEFINE FIELD submissionTime ON complaints TYPE datetime ASSERT $value != NONE;
DEFINE FIELD tags ON complaints FLEXIBLE TYPE array;
-- ------------------------------
-- TABLE: tags
-- ------------------------------
DEFINE TABLE tags SCHEMAFULL PERMISSIONS FOR
select,
    create,
    update,
    delete
WHERE $auth.user = 'admin';
DEFINE FIELD ispublic ON tags TYPE bool;
DEFINE FIELD name ON tags TYPE string ASSERT $value != NONE;
DEFINE INDEX idx_tag ON tags FIELDS name UNIQUE;
-- ------------------------------
-- TABLE: users
-- ------------------------------
DEFINE TABLE users SCHEMAFULL PERMISSIONS FOR
select,
    update
WHERE id = $auth.id,
    FOR create,
    delete NONE;
DEFINE FIELD pass ON users TYPE string;
DEFINE FIELD user ON users TYPE string;
DEFINE INDEX idx_user ON users FIELDS user UNIQUE;
-- ------------------------------
-- TRANSACTION
-- ------------------------------
BEGIN TRANSACTION;
-- ------------------------------
-- TABLE DATA: users
-- ------------------------------
UPDATE users:admin CONTENT { id: users:admin, pass: crypto::argon2::generate('REPLACE_ME'), user: 'admin' };
UPDATE users:basic CONTENT { id: users:basic, user: 'basic' };
-- ------------------------------
-- TRANSACTION
-- ------------------------------
COMMIT TRANSACTION;