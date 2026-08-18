INSERT INTO career_role_skills(career_role_id,skill_id,importance,is_required)
SELECT cr.id,s.id,5,true
FROM career_roles cr,skills s
WHERE cr.title='Full Stack Developer' AND s.name IN ('JavaScript','TypeScript','React','Node.js','Express.js','REST API','PostgreSQL','SQL','Git');

INSERT INTO career_role_skills(career_role_id,skill_id,importance,is_required)
SELECT cr.id,s.id,5,true
FROM career_roles cr,skills s
WHERE cr.title='Backend Developer' AND s.name IN ('JavaScript','TypeScript','Node.js','Express.js','REST API','PostgreSQL','SQL','Git');

INSERT INTO career_role_skills(career_role_id,skill_id,importance,is_required)
SELECT cr.id,s.id,5,true
FROM career_roles cr,skills s
WHERE cr.title='Frontend Developer' AND s.name IN ('HTML','CSS','JavaScript','TypeScript','React','Git');

INSERT INTO career_role_skills(career_role_id,skill_id,importance,is_required)
SELECT cr.id,s.id,5,true
FROM career_roles cr,skills s
WHERE cr.title='Data Analyst' AND s.name IN ('Python','SQL','Excel','Pandas','NumPy','Data Analysis','Power BI');

INSERT INTO career_role_skills(career_role_id,skill_id,importance,is_required)
SELECT cr.id,s.id,5,true
FROM career_roles cr,skills s
WHERE cr.title='Data Scientist' AND s.name IN ('Python','SQL','Pandas','NumPy','Scikit-learn','Machine Learning','Data Analysis');

INSERT INTO career_role_skills(career_role_id,skill_id,importance,is_required)
SELECT cr.id,s.id,5,true
FROM career_roles cr,skills s
WHERE cr.title='Machine Learning Engineer' AND s.name IN ('Python','SQL','NumPy','Pandas','Scikit-learn','TensorFlow','Machine Learning','Git');

INSERT INTO career_role_skills(career_role_id,skill_id,importance,is_required)
SELECT cr.id,s.id,5,true
FROM career_roles cr,skills s
WHERE cr.title='Data Engineer' AND s.name IN ('Python','SQL','PostgreSQL','MySQL','Pandas','Git','Docker','AWS');

INSERT INTO career_role_skills(career_role_id,skill_id,importance,is_required)
SELECT cr.id,s.id,5,true
FROM career_roles cr,skills s
WHERE cr.title='Software Engineer' AND s.name IN ('Python','Java','C++','JavaScript','TypeScript','SQL','DBMS','Git','Problem Solving');

INSERT INTO career_role_skills(career_role_id,skill_id,importance,is_required)
SELECT cr.id,s.id,5,true
FROM career_roles cr,skills s
WHERE cr.title='Cloud Engineer' AND s.name IN ('Linux','Docker','Git','AWS','Azure','Python','REST API');

INSERT INTO career_role_skills(career_role_id,skill_id,importance,is_required)
SELECT cr.id,s.id,5,true
FROM career_roles cr,skills s
WHERE cr.title='DevOps Engineer' AND s.name IN ('Linux','Docker','Git','AWS','Azure','Python');

INSERT INTO career_role_skills(career_role_id,skill_id,importance,is_required)
SELECT cr.id,s.id,5,true
FROM career_roles cr,skills s
WHERE cr.title='Business Intelligence Analyst' AND s.name IN ('SQL','Excel','Power BI','Data Analysis','Python');

INSERT INTO career_role_skills(career_role_id,skill_id,importance,is_required)
SELECT cr.id,s.id,5,true
FROM career_roles cr,skills s
WHERE cr.title='AI Engineer' AND s.name IN ('Python','Machine Learning','TensorFlow','NumPy','Pandas','Scikit-learn','Git');
