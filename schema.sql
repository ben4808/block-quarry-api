create table Puzzle (
	id varchar(11) not null primary key,
	[date] datetime not null,
	publicationId nvarchar(255),
	title nvarchar(255) not null,
	copyright nvarchar(255),
	notes nvarchar(255),
	width int not null,
	height int not null,
	sourceLink nvarchar(2047),
	sourcePuzLink nvarchar(2047),
	storedPuzLink nvarchar(2047),
	puzData varbinary(max)
);

create table Puzzle_Tag (
	puzzleId varchar(11) not null,
	tag nvarchar(63) not null,
	primary key (puzzleId, tag)
);
	
create table Author (
	[name] nvarchar(255) not null primary key
);

insert into Author([name]) values
('Brendan Emmett Quigley'), ('Tim Croce');

create table Puzzle_Author (
	puzzleId varchar(11) not null,
	authorId nvarchar(255) not null,
	primary key(puzzleId, authorId)
);

create table Publication (
	[name] nvarchar(255) not null primary key
);	

insert into Publication ([name]) values
('New York Times'), ('Brendan Emmett Quigley'), ('Club 72 by Tim Croce');

create table Entry (
	[entry] nvarchar(255) not null primary key,
	[raw] nvarchar(255),
	[source] int,
	finder nvarchar(255),
	debutPuzzle varchar(11),
	qualityScore float,
	obscurityScore float
);

create table Entry_Tag (
	[entry] nvarchar(255) not null,
	tag nvarchar(63) not null,
	primary key (entry, tag)
);

create table Clue (
	id varchar(11) not null primary key,
	[entry] nvarchar(255) not null,
	clue nvarchar(2047) not null,
	debutPuzzle varchar(11),
	author nvarchar(255),
	qualityScore float,
	obscurityScore float
);

create table Puzzle_Clue (
	puzzleId varchar(11) not null,
	clueId varchar(11) not null,
	[index] nvarchar(10) not null,
	primary key(puzzleId, clueId)
);

create table Entry_Score (
	[entry] nvarchar(255) not null,
	username nvarchar(255) not null,
	qualityScore int not null,
	obscurityScore int not null,
	primary key(entry, username)
);

create table Clue_Score (
	clueId varchar(11) not null,
	username nvarchar(255) not null,
	qualityScore int not null,
	obscurityScore int not null,
	primary key(clueId, username)
);

create table Entry_Source (
	id int not null primary key identity(1, 1),
	name nvarchar(255) not null,
);

create table EntrySource_Entry (
	entrySourceId int not null,
	[entry] nvarchar(255) not null,
	[raw] nvarchar(255),
	picked bit not null default 0,
	[views] int not null,
	primary key(entrySourceId, entry)
);

insert into Entry_Source ([name])
values ('Puzzle'), ('Manual Entry'), ('Curated Broda'), ('Ginsberg Clues');

-- Quality Scale
-- NotAThing 0
-- Iffy 1
-- Glue 2
-- Okay 3
-- Good 4
-- Lively 5

-- Obscurity Scale
-- NotAThing 0
-- Arcane 1
-- Obscure 2
-- Known 3
-- Common 4
-- Everyday 5