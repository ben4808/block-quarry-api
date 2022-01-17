create table explored (
	entry text not null primary key,
	display_text text,
	quality_score decimal(3, 2),
	obscurity_score decimal(3, 2),
    breakfast_test_failure boolean default 0 not null,
    length int,
    col1 char(1),
    col2 char(1),
    col3 char(1),
    col4 char(1),
    col5 char(1),
    col6 char(1),
    col7 char(1),
    col8 char(1),
    col9 char(1),
    col10 char(1),
    col11 char(1),
    col12 char(1),
    col13 char(1),
    col14 char(1),
    col15 char(1)
);

CREATE INDEX IX_Len ON Explored(length ASC);
CREATE INDEX IX_Col1 ON Explored(col1 ASC);
CREATE INDEX IX_Col2 ON Explored(col2 ASC);
CREATE INDEX IX_Col3 ON Explored(col3 ASC);
CREATE INDEX IX_Col4 ON Explored(col4 ASC);
CREATE INDEX IX_Col5 ON Explored(col5 ASC);
CREATE INDEX IX_Col6 ON Explored(col6 ASC);
CREATE INDEX IX_Col7 ON Explored(col7 ASC);
CREATE INDEX IX_Col8 ON Explored(col8 ASC);
CREATE INDEX IX_Col9 ON Explored(col9 ASC);
CREATE INDEX IX_Col10 ON Explored(col10 ASC);
CREATE INDEX IX_Col11 ON Explored(col11 ASC);
CREATE INDEX IX_Col12 ON Explored(col12 ASC);
CREATE INDEX IX_Col13 ON Explored(col13 ASC);
CREATE INDEX IX_Col14 ON Explored(col14 ASC);
CREATE INDEX IX_Col15 ON Explored(col15 ASC);

create table edits (
    entry text not null,
    user_id text not null,
    display_text text,
    quality_score smallint,
    obscurity_score smallint,
    breakfast_test_failure boolean,
    modified_date timestamp not null,
    primary key(entry, user_id)
);

CREATE TABLE numbers (number  int primary key  not null)  
;WITH
  Pass0 as (select 1 as C union all select 1), --2 rows
  Pass1 as (select 1 as C from Pass0 as A, Pass0 as B),--4 rows
  Pass2 as (select 1 as C from Pass1 as A, Pass1 as B),--16 rows
  Pass3 as (select 1 as C from Pass2 as A, Pass2 as B),--256 rows
  Pass4 as (select 1 as C from Pass3 as A, Pass3 as B),--65536 rows
  --I removed Pass5, since I'm only populating the Numbers table to 10,000
  Tally as (select row_number() over(order by C) as Number from Pass4)
INSERT INTO numbers
        (number)
    SELECT number
        FROM Tally
        WHERE number <= 10000

-- ginsberg, podcasts, nutrimatic, onelook, newspapers, husic
-- create table <Source> (
-- 	entry text not null primary key,
-- 	display_text text,
--     data_source_score int,
--     views int,
--     length int
-- );

CREATE INDEX IX_Len_<Source> ON <Source>(length ASC);

create table ginsberg (
	entry text not null primary key,
	display_text text,
    data_source_score int,
    views int,
    length int
);

CREATE INDEX IX_Len_ginsberg ON ginsberg(length ASC);

create table podcasts (
	entry text not null primary key,
	display_text text,
    data_source_score int,
    views int,
    length int
);

CREATE INDEX IX_Len_podcasts ON podcasts(length ASC);

create table nutrimatic (
	entry text not null primary key,
	display_text text,
    data_source_score int,
    views int,
    length int
);

CREATE INDEX IX_Len_nutrimatic ON nutrimatic(length ASC);

create table onelook (
	entry text not null primary key,
	display_text text,
    data_source_score int,
    views int,
    length int
);

CREATE INDEX IX_Len_onelook ON onelook(length ASC);

create table newspapers (
	entry text not null primary key,
	display_text text,
    data_source_score int,
    views int,
    length int
);

CREATE INDEX IX_Len_newspapers ON newspapers(length ASC);

create table husic (
	entry text not null primary key,
	display_text text,
    data_source_score int,
    views int,
    length int
);

CREATE INDEX IX_Len_husic ON husic(length ASC);
