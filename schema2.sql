create table [Explored] (
	[entry] nvarchar(127) not null primary key,
	[displayText] nvarchar(127),
	qualityScore decimal(3, 2),
	obscurityScore decimal(3, 2),
    [length] int,
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

CREATE NONCLUSTERED INDEX IX_Len ON Explored([length] ASC);
CREATE NONCLUSTERED INDEX IX_Col1 ON Explored(col1 ASC);
CREATE NONCLUSTERED INDEX IX_Col2 ON Explored(col2 ASC);
CREATE NONCLUSTERED INDEX IX_Col3 ON Explored(col3 ASC);
CREATE NONCLUSTERED INDEX IX_Col4 ON Explored(col4 ASC);
CREATE NONCLUSTERED INDEX IX_Col5 ON Explored(col5 ASC);
CREATE NONCLUSTERED INDEX IX_Col6 ON Explored(col6 ASC);
CREATE NONCLUSTERED INDEX IX_Col7 ON Explored(col7 ASC);
CREATE NONCLUSTERED INDEX IX_Col8 ON Explored(col8 ASC);
CREATE NONCLUSTERED INDEX IX_Col9 ON Explored(col9 ASC);
CREATE NONCLUSTERED INDEX IX_Col10 ON Explored(col10 ASC);
CREATE NONCLUSTERED INDEX IX_Col11 ON Explored(col11 ASC);
CREATE NONCLUSTERED INDEX IX_Col12 ON Explored(col12 ASC);
CREATE NONCLUSTERED INDEX IX_Col13 ON Explored(col13 ASC);
CREATE NONCLUSTERED INDEX IX_Col14 ON Explored(col14 ASC);
CREATE NONCLUSTERED INDEX IX_Col15 ON Explored(col15 ASC);

-- Ginsberg, Podcasts, Nutrimatic, OneLook, Newspapers

create table [<Source>] (
	[entry] nvarchar(127) not null primary key,
	[displayText] nvarchar(127),
    dataSourceScore int,
    [views] int,
    [length] int
);

CREATE NONCLUSTERED INDEX IX_Len ON <Source>([length] ASC);

create table Edits (
    [entry] nvarchar(127) not null,
    userId varchar(11) not null,
    displayText nvarchar(127),
    qualityScore tinyint,
    obscurityScore tinyint,
    [modifiedDate] datetime not null,
    primary key([entry], userId)
);

CREATE TABLE Numbers (Number  int  not null)  
;WITH
  Pass0 as (select 1 as C union all select 1), --2 rows
  Pass1 as (select 1 as C from Pass0 as A, Pass0 as B),--4 rows
  Pass2 as (select 1 as C from Pass1 as A, Pass1 as B),--16 rows
  Pass3 as (select 1 as C from Pass2 as A, Pass2 as B),--256 rows
  Pass4 as (select 1 as C from Pass3 as A, Pass3 as B),--65536 rows
  --I removed Pass5, since I'm only populating the Numbers table to 10,000
  Tally as (select row_number() over(order by C) as Number from Pass4)
INSERT Numbers
        (Number)
    SELECT Number
        FROM Tally
        WHERE Number <= 10000
ALTER TABLE Numbers ADD CONSTRAINT PK_Numbers PRIMARY KEY CLUSTERED (Number)
