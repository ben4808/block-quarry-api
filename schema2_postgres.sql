create table explored (
	entry text not null primary key,
	display_text text,
	quality_score decimal(3, 2),
	obscurity_score decimal(3, 2),
    breakfast_test_failure boolean default 't' not null,
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
        WHERE number <= 10000;

-- ginsberg, podcasts, nutrimatic, onelook, newspapers, husic

create table ginsberg (
	entry text not null primary key,
	display_text text,
    data_source_score int,
    views int,
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

CREATE INDEX IX_Len_ginsberg ON ginsberg(length ASC);
CREATE INDEX IX_Col1_ginsberg ON ginsberg(col1 ASC);
CREATE INDEX IX_Col2_ginsberg ON ginsberg(col2 ASC);
CREATE INDEX IX_Col3_ginsberg ON ginsberg(col3 ASC);
CREATE INDEX IX_Col4_ginsberg ON ginsberg(col4 ASC);
CREATE INDEX IX_Col5_ginsberg ON ginsberg(col5 ASC);
CREATE INDEX IX_Col6_ginsberg ON ginsberg(col6 ASC);
CREATE INDEX IX_Col7_ginsberg ON ginsberg(col7 ASC);
CREATE INDEX IX_Col8_ginsberg ON ginsberg(col8 ASC);
CREATE INDEX IX_Col9_ginsberg ON ginsberg(col9 ASC);
CREATE INDEX IX_Col10_ginsberg ON ginsberg(col10 ASC);
CREATE INDEX IX_Col11_ginsberg ON ginsberg(col11 ASC);
CREATE INDEX IX_Col12_ginsberg ON ginsberg(col12 ASC);
CREATE INDEX IX_Col13_ginsberg ON ginsberg(col13 ASC);
CREATE INDEX IX_Col14_ginsberg ON ginsberg(col14 ASC);
CREATE INDEX IX_Col15_ginsberg ON ginsberg(col15 ASC);

create table podcasts (
	entry text not null primary key,
	display_text text,
    data_source_score int,
    views int,
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

CREATE INDEX IX_Len_podcasts ON podcasts(length ASC);
CREATE INDEX IX_Col1_podcasts ON podcasts(col1 ASC);
CREATE INDEX IX_Col2_podcasts ON podcasts(col2 ASC);
CREATE INDEX IX_Col3_podcasts ON podcasts(col3 ASC);
CREATE INDEX IX_Col4_podcasts ON podcasts(col4 ASC);
CREATE INDEX IX_Col5_podcasts ON podcasts(col5 ASC);
CREATE INDEX IX_Col6_podcasts ON podcasts(col6 ASC);
CREATE INDEX IX_Col7_podcasts ON podcasts(col7 ASC);
CREATE INDEX IX_Col8_podcasts ON podcasts(col8 ASC);
CREATE INDEX IX_Col9_podcasts ON podcasts(col9 ASC);
CREATE INDEX IX_Col10_podcasts ON podcasts(col10 ASC);
CREATE INDEX IX_Col11_podcasts ON podcasts(col11 ASC);
CREATE INDEX IX_Col12_podcasts ON podcasts(col12 ASC);
CREATE INDEX IX_Col13_podcasts ON podcasts(col13 ASC);
CREATE INDEX IX_Col14_podcasts ON podcasts(col14 ASC);
CREATE INDEX IX_Col15_podcasts ON podcasts(col15 ASC);

create table nutrimatic (
	entry text not null primary key,
	display_text text,
    data_source_score int,
    views int,
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

CREATE INDEX IX_Len_nutrimatic ON nutrimatic(length ASC);
CREATE INDEX IX_Col1_nutrimatic ON nutrimatic(col1 ASC);
CREATE INDEX IX_Col2_nutrimatic ON nutrimatic(col2 ASC);
CREATE INDEX IX_Col3_nutrimatic ON nutrimatic(col3 ASC);
CREATE INDEX IX_Col4_nutrimatic ON nutrimatic(col4 ASC);
CREATE INDEX IX_Col5_nutrimatic ON nutrimatic(col5 ASC);
CREATE INDEX IX_Col6_nutrimatic ON nutrimatic(col6 ASC);
CREATE INDEX IX_Col7_nutrimatic ON nutrimatic(col7 ASC);
CREATE INDEX IX_Col8_nutrimatic ON nutrimatic(col8 ASC);
CREATE INDEX IX_Col9_nutrimatic ON nutrimatic(col9 ASC);
CREATE INDEX IX_Col10_nutrimatic ON nutrimatic(col10 ASC);
CREATE INDEX IX_Col11_nutrimatic ON nutrimatic(col11 ASC);
CREATE INDEX IX_Col12_nutrimatic ON nutrimatic(col12 ASC);
CREATE INDEX IX_Col13_nutrimatic ON nutrimatic(col13 ASC);
CREATE INDEX IX_Col14_nutrimatic ON nutrimatic(col14 ASC);
CREATE INDEX IX_Col15_nutrimatic ON nutrimatic(col15 ASC);

create table onelook (
	entry text not null primary key,
	display_text text,
    data_source_score int,
    views int,
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

CREATE INDEX IX_Len_onelook ON onelook(length ASC);
CREATE INDEX IX_Col1_onelook ON onelook(col1 ASC);
CREATE INDEX IX_Col2_onelook ON onelook(col2 ASC);
CREATE INDEX IX_Col3_onelook ON onelook(col3 ASC);
CREATE INDEX IX_Col4_onelook ON onelook(col4 ASC);
CREATE INDEX IX_Col5_onelook ON onelook(col5 ASC);
CREATE INDEX IX_Col6_onelook ON onelook(col6 ASC);
CREATE INDEX IX_Col7_onelook ON onelook(col7 ASC);
CREATE INDEX IX_Col8_onelook ON onelook(col8 ASC);
CREATE INDEX IX_Col9_onelook ON onelook(col9 ASC);
CREATE INDEX IX_Col10_onelook ON onelook(col10 ASC);
CREATE INDEX IX_Col11_onelook ON onelook(col11 ASC);
CREATE INDEX IX_Col12_onelook ON onelook(col12 ASC);
CREATE INDEX IX_Col13_onelook ON onelook(col13 ASC);
CREATE INDEX IX_Col14_onelook ON onelook(col14 ASC);
CREATE INDEX IX_Col15_onelook ON onelook(col15 ASC);

create table newspapers (
	entry text not null primary key,
	display_text text,
    data_source_score int,
    views int,
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

CREATE INDEX IX_Len_newspapers ON newspapers(length ASC);
CREATE INDEX IX_Col1_newspapers ON newspapers(col1 ASC);
CREATE INDEX IX_Col2_newspapers ON newspapers(col2 ASC);
CREATE INDEX IX_Col3_newspapers ON newspapers(col3 ASC);
CREATE INDEX IX_Col4_newspapers ON newspapers(col4 ASC);
CREATE INDEX IX_Col5_newspapers ON newspapers(col5 ASC);
CREATE INDEX IX_Col6_newspapers ON newspapers(col6 ASC);
CREATE INDEX IX_Col7_newspapers ON newspapers(col7 ASC);
CREATE INDEX IX_Col8_newspapers ON newspapers(col8 ASC);
CREATE INDEX IX_Col9_newspapers ON newspapers(col9 ASC);
CREATE INDEX IX_Col10_newspapers ON newspapers(col10 ASC);
CREATE INDEX IX_Col11_newspapers ON newspapers(col11 ASC);
CREATE INDEX IX_Col12_newspapers ON newspapers(col12 ASC);
CREATE INDEX IX_Col13_newspapers ON newspapers(col13 ASC);
CREATE INDEX IX_Col14_newspapers ON newspapers(col14 ASC);
CREATE INDEX IX_Col15_newspapers ON newspapers(col15 ASC);

create table husic (
	entry text not null primary key,
	display_text text,
    data_source_score int,
    views int,
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

CREATE INDEX IX_Len_husic ON husic(length ASC);
CREATE INDEX IX_Col1_husic ON husic(col1 ASC);
CREATE INDEX IX_Col2_husic ON husic(col2 ASC);
CREATE INDEX IX_Col3_husic ON husic(col3 ASC);
CREATE INDEX IX_Col4_husic ON husic(col4 ASC);
CREATE INDEX IX_Col5_husic ON husic(col5 ASC);
CREATE INDEX IX_Col6_husic ON husic(col6 ASC);
CREATE INDEX IX_Col7_husic ON husic(col7 ASC);
CREATE INDEX IX_Col8_husic ON husic(col8 ASC);
CREATE INDEX IX_Col9_husic ON husic(col9 ASC);
CREATE INDEX IX_Col10_husic ON husic(col10 ASC);
CREATE INDEX IX_Col11_husic ON husic(col11 ASC);
CREATE INDEX IX_Col12_husic ON husic(col12 ASC);
CREATE INDEX IX_Col13_husic ON husic(col13 ASC);
CREATE INDEX IX_Col14_husic ON husic(col14 ASC);
CREATE INDEX IX_Col15_husic ON husic(col15 ASC);

create table jeopardy (
	entry text not null primary key,
	display_text text,
    data_source_score int,
    views int,
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

CREATE INDEX IX_Len_jeopardy ON jeopardy(length ASC);
CREATE INDEX IX_Col1_jeopardy ON jeopardy(col1 ASC);
CREATE INDEX IX_Col2_jeopardy ON jeopardy(col2 ASC);
CREATE INDEX IX_Col3_jeopardy ON jeopardy(col3 ASC);
CREATE INDEX IX_Col4_jeopardy ON jeopardy(col4 ASC);
CREATE INDEX IX_Col5_jeopardy ON jeopardy(col5 ASC);
CREATE INDEX IX_Col6_jeopardy ON jeopardy(col6 ASC);
CREATE INDEX IX_Col7_jeopardy ON jeopardy(col7 ASC);
CREATE INDEX IX_Col8_jeopardy ON jeopardy(col8 ASC);
CREATE INDEX IX_Col9_jeopardy ON jeopardy(col9 ASC);
CREATE INDEX IX_Col10_jeopardy ON jeopardy(col10 ASC);
CREATE INDEX IX_Col11_jeopardy ON jeopardy(col11 ASC);
CREATE INDEX IX_Col12_jeopardy ON jeopardy(col12 ASC);
CREATE INDEX IX_Col13_jeopardy ON jeopardy(col13 ASC);
CREATE INDEX IX_Col14_jeopardy ON jeopardy(col14 ASC);
CREATE INDEX IX_Col15_jeopardy ON jeopardy(col15 ASC);

create table fortune (
	entry text not null primary key,
	display_text text,
    data_source_score int,
    views int,
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

CREATE INDEX IX_Len_fortune ON fortune(length ASC);
CREATE INDEX IX_Col1_fortune ON fortune(col1 ASC);
CREATE INDEX IX_Col2_fortune ON fortune(col2 ASC);
CREATE INDEX IX_Col3_fortune ON fortune(col3 ASC);
CREATE INDEX IX_Col4_fortune ON fortune(col4 ASC);
CREATE INDEX IX_Col5_fortune ON fortune(col5 ASC);
CREATE INDEX IX_Col6_fortune ON fortune(col6 ASC);
CREATE INDEX IX_Col7_fortune ON fortune(col7 ASC);
CREATE INDEX IX_Col8_fortune ON fortune(col8 ASC);
CREATE INDEX IX_Col9_fortune ON fortune(col9 ASC);
CREATE INDEX IX_Col10_fortune ON fortune(col10 ASC);
CREATE INDEX IX_Col11_fortune ON fortune(col11 ASC);
CREATE INDEX IX_Col12_fortune ON fortune(col12 ASC);
CREATE INDEX IX_Col13_fortune ON fortune(col13 ASC);
CREATE INDEX IX_Col14_fortune ON fortune(col14 ASC);
CREATE INDEX IX_Col15_fortune ON fortune(col15 ASC);

create table twitter (
	entry text not null primary key,
	display_text text,
    data_source_score int,
    views int,
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

CREATE INDEX IX_Len_twitter ON twitter(length ASC);
CREATE INDEX IX_Col1_twitter ON twitter(col1 ASC);
CREATE INDEX IX_Col2_twitter ON twitter(col2 ASC);
CREATE INDEX IX_Col3_twitter ON twitter(col3 ASC);
CREATE INDEX IX_Col4_twitter ON twitter(col4 ASC);
CREATE INDEX IX_Col5_twitter ON twitter(col5 ASC);
CREATE INDEX IX_Col6_twitter ON twitter(col6 ASC);
CREATE INDEX IX_Col7_twitter ON twitter(col7 ASC);
CREATE INDEX IX_Col8_twitter ON twitter(col8 ASC);
CREATE INDEX IX_Col9_twitter ON twitter(col9 ASC);
CREATE INDEX IX_Col10_twitter ON twitter(col10 ASC);
CREATE INDEX IX_Col11_twitter ON twitter(col11 ASC);
CREATE INDEX IX_Col12_twitter ON twitter(col12 ASC);
CREATE INDEX IX_Col13_twitter ON twitter(col13 ASC);
CREATE INDEX IX_Col14_twitter ON twitter(col14 ASC);
CREATE INDEX IX_Col15_twitter ON twitter(col15 ASC);
