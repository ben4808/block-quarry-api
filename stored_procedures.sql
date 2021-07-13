CREATE TYPE StrType AS TABLE 
(
	Str1 nvarchar(255) not null,
    PRIMARY KEY (Str1)
)
GO

CREATE TYPE EntryType AS TABLE 
(
	[clueId] varchar(11),
	[index] varchar(10),
	[entry] nvarchar(127),
	[clue] nvarchar(2047),
    PRIMARY KEY ([index])
)
GO

CREATE PROCEDURE [dbo].[AddPuzzle]
	@puzzleId varchar(11),
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
	if not exists(select 1 from Puzzle where publicationId = @publicationId and title = @title)
	begin

	INSERT INTO [Puzzle] (
		id,
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
     values(
		   @puzzleId
           ,@date
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
		   )
	end
END
GO

CREATE PROCEDURE AddAuthors
	@PuzzleId varchar(11),
	@Authors dbo.StrType readonly
AS
BEGIN
	insert into Author ([name])
	select a.Str1 from @Authors a
	where not exists(select [name] from Author au where au.[name] = a.Str1);

	insert into Puzzle_Author(puzzleId, authorId)
	select @PuzzleId, a.Str1 from @Authors a;
END
GO

CREATE PROCEDURE AddEntriesAndClues
	@PuzzleId varchar(11),
	@Entries dbo.EntryType readonly
AS
BEGIN
	declare @PuzzleDate datetime;
	select @PuzzleDate = [date] from Puzzle where id = @PuzzleId;

	update en set debutPuzzle = @PuzzleId
	from [Entry] en
	inner join @Entries et on et.[entry] = en.[entry]
	inner join Puzzle curDebut on curDebut.id = en.debutPuzzle
	where en.debutPuzzle is null or curDebut.date > @PuzzleDate;

	insert into [Entry] ([entry], [raw], [source], debutPuzzle)
	select et.[entry], et.[entry], 1, @PuzzleId from @Entries et
	where not exists(select 1 from [Entry] where [entry] = et.[entry]);

	update [Clue] set debutPuzzle = @PuzzleId
	from Clue cl
	inner join @Entries et on et.[entry] = cl.[entry] and et.clue = cl.clue
	inner join Puzzle curDebut on curDebut.id = cl.debutPuzzle
	where cl.debutPuzzle is null or curDebut.date > @PuzzleDate;

	insert into Clue (id, [entry], clue, debutPuzzle)
	select et.clueId, et.[entry], et.clue, @PuzzleId from @Entries et
	where not exists(select 1 from Clue where [entry] = et.[entry] and clue = et.clue);

	insert into Puzzle_Clue(puzzleId, clueId, [index])
	select @PuzzleId, et.clueId, et.[index] from @Entries et;
END
GO
