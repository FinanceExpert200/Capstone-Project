\echo 'Delete and recreate fin-expert db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE fin_expert;
CREATE DATABASE fin_expert;
\connect fin_expert;

\i capstone-schema.sql


