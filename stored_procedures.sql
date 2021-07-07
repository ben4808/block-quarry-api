CREATE TYPE StrType AS TABLE 
(
	Str1 nvarchar(255) not null,
    PRIMARY KEY (Str1)
)
GO

CREATE TYPE EntryType AS TABLE 
(
	[index] varchar(10),
	[entry] nvarchar(255),
	[clue] nvarchar(255),
    PRIMARY KEY ([index])
)
GO

CREATE PROCEDURE AddPuzzle
	@date datetime,
	@publicationId nvarchar(255),
	@title nvarchar(255),
	@copyright nvarchar(255),
	@notes nvarchar(255),
	@width int,
	@height int,
	@sourceLink nvarchar(2047),
	@sourcePuzLink nvarchar(2047),
	@storedPuzLink nvarchar(2047),
	@puzData varbinary(max)
AS
BEGIN
	INSERT INTO [Puzzle] (
        [date],
		publicationId,
		title,
		copyright,
		notes,
		width,
		height,
		sourceLink,
		sourcePuzLink,
		storedPuzLink,
		puzData
	 )
     VALUES
           (
           @date
           ,@publicationId
           ,@title
           ,@copyright
           ,@notes
           ,@width
           ,@height
           ,@sourceLink
           ,@sourcePuzLink
		   ,@storedPuzLink
           ,@puzData
	);
END
GO

CREATE PROCEDURE AddAuthors
	@PuzzleId varchar(11),
	@Authors dbo.StrType readonly
AS
BEGIN
	insert into Author ([name])
	select a.Str1 from @Authors a
	where not exists(select [name] from Authors au where au.[name] = a.Str1);

	insert into Puzzle_Author(puzzleId, authorId)
	select @PuzzleId, a.Str1 from @Authors a;
END
GO

CREATE PROCEDURE AddEntriesAndClues
	@PuzzleId varchar(11),
	@Entries dbo.EntryType readonly
AS
BEGIN
	declare @Author as nvarchar(255);
	set @Author = select top 1 authorId from Puzzle_Author where puzzleId = @PuzzleId;

	insert into [Entry] ([entry], [raw], [source], finder, debutPuzzle)
	select et.[entry], et.[entry], 1, @Author, @PuzzleId from @Entries et
	where not exists(select 1 from [Entry] where [entry] = et.[entry]); 

	insert into Clue (id, [entry], clue, debutPuzzle, author)
	select et.
END
GO