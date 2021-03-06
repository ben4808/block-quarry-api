CREATE TYPE ExploredType AS TABLE 
(
	[entry] nvarchar(127) not null,
	[displayText] nvarchar(127),
	[qualityScore] decimal(3, 2),
	[obscurityScore] decimal(3, 2),
    breakfastTestFailure tinyint,
    PRIMARY KEY ([entry])
)
GO

CREATE TYPE DataSourceType AS TABLE 
(
	[entry] nvarchar(127) not null,
	[displayText] nvarchar(127),
    [dataSourceScore] int,
    PRIMARY KEY ([entry])
)
GO

CREATE PROCEDURE LoadExploredTable
	@Entries dbo.ExploredType readonly
AS
BEGIN
    update ex set
        displayText = et.displayText,
        qualityScore = et.qualityScore,
        obscurityScore = et.obscurityScore,
        breakfastTestFailure = et.breakfastTestFailure
	from Explored ex
	inner join @Entries et on et.[entry] = ex.[entry];

    insert into Explored ([entry], [displayText], [qualityScore], [obscurityScore], [breakfastTestFailure], [length],
    col1, col2, col3, col4, col5, col6, col7, col8, col9, col10, col11, col12, col13, col14, col15)
	select distinct 
        et.[entry], 
        et.[displayText], 
        et.qualityScore,
        et.obscurityScore,
        et.breakfastTestFailure,
        len(et.[entry]),
        substring(et.entry, 1, 1),
        substring(et.entry, 2, 1),
        substring(et.entry, 3, 1),
        substring(et.entry, 4, 1),
        substring(et.entry, 5, 1),
        substring(et.entry, 6, 1),
        substring(et.entry, 7, 1),
        substring(et.entry, 8, 1),
        substring(et.entry, 9, 1),
        substring(et.entry, 10, 1),
        substring(et.entry, 11, 1),
        substring(et.entry, 12, 1),
        substring(et.entry, 13, 1),
        substring(et.entry, 14, 1),
        substring(et.entry, 15, 1)
        from @Entries et
	where not exists(select 1 from Explored where [entry] = et.[entry]);
END
GO

CREATE PROCEDURE LoadDataSourceTable
    @TableName varchar(127),
	@Entries dbo.DataSourceType readonly
AS
BEGIN
    declare @Query nvarchar(max);
    select @Query = '
    update en set
        displayText = et.displayText,
        dataSourceScore = et.dataSourceScore
	from {TableName} en
	inner join @Entries et on et.[entry] = en.[entry];

    insert into {TableName} ([entry], [displayText], dataSourceScore, [views], [length])
	select distinct 
        et.[entry], 
        et.[displayText], 
        et.dataSourceScore, 
        0,
        len(et.[entry])
        from @Entries et
	where not exists(select 1 from {TableName} where [entry] = et.[entry]);
    ';

	select @Query = replace(@Query, '{TableName}', @TableName);

    EXECUTE sp_executesql @Query, N'@Entries dbo.DataSourceType readonly', @Entries=@Entries;
END
GO

CREATE PROCEDURE ExploredQuery
    @Query nvarchar(127),
    @UserId nvarchar(127)
AS
BEGIN
    declare @Conds nvarchar(1024);
    select @Conds = stuff((
	select
        case
            when substring(a.b, n.Number, 1) = '.' then ''
            else concat(' and col', cast(n.Number as varchar), '=''', substring(a.b, n.Number, 1), '''')
        end
    from (select @Query b) a
    join Numbers n on n.number <= len(a.b)
    FOR XML PATH('')
	), 1, 1, '');

    declare @Q nvarchar(max);
    select @Q = '
    select ex.[entry], ex.displayText, 
    coalesce(ed.qualityScore, ex.qualityScore) as qualityScore, 
    coalesce(ed.obscurityScore, ex.obscurityScore) as obscurityScore,
    coalesce(ed.breakfastTestFailure, ex.breakfastTestFailure) as breakfastTestFailure
    from Explored ex
    left join Edits ed on ed.[entry] = ex.[entry] and ed.userId = @UserId
    where [length] = len(@Query)
    ' + @Conds;

    EXECUTE sp_executesql @Q, N'@Query nvarchar(127), @UserId nvarchar(127)', @Query=@Query, @UserId=@UserId;
END
GO

CREATE PROCEDURE [dbo].[FrontierQuery]
    @Query nvarchar(127),
    @DataSource nvarchar(127),
    @Page int,
	@RecordsPerPage int = 200
AS
BEGIN
    declare @Conds nvarchar(1024);
    select @Conds = ' and entry like ''' + replace(@Query, '.', '_') + '''';

    declare @Q nvarchar(max);
    select @Q = '
    from ' + @DataSource + ' ds
    where ds.[length] = len(@Query)
    ' + @Conds
    + ' order by ds.dataSourceScore desc, ds.entry'
    + ' OFFSET ((@Page - 1)*@RecordsPerPage) ROWS FETCH NEXT @RecordsPerPage ROWS ONLY';

	declare @Q1 nvarchar(max) = concat('insert into #resultsTable select ds.[entry], ds.displayText, ds.dataSourceScore, (ds.[views]-1) as [views] ', @Q);
	declare @Q2 nvarchar(max) = concat('update d SET [views] = d.[views] + 1 from ', @DataSource, ' d inner join #resultsTable r on d.entry = r.entry');

	create table #resultsTable (
		[entry] nvarchar(127),
		[displayText] nvarchar(127),
		[dataSourceScore] int,
		[views] int
	);

	EXECUTE sp_executesql @Q1, N'@Query nvarchar(127), @Page int, @RecordsPerPage int', @Query=@Query, @Page=@Page, @RecordsPerPage=@RecordsPerPage;
	EXECUTE sp_executesql @Q2, N'@Query nvarchar(127), @Page int, @RecordsPerPage int', @Query=@Query, @Page=@Page, @RecordsPerPage=@RecordsPerPage;

	select * from #resultsTable;
END
GO

CREATE PROCEDURE [dbo].[DiscoverEntries]
    @UserId nvarchar(127),
    @Entries dbo.ExploredType readonly
AS
BEGIN
    insert into Explored ([entry], displayText, qualityScore, obscurityScore, breakfastTestFailure, [length],
    col1, col2, col3, col4, col5, col6, col7, col8, col9, col10, col11, col12, col13, col14, col15)
    select distinct 
        et.[entry], 
        et.[displayText], 
        et.qualityScore,
        et.obscurityScore,
        et.breakfastTestFailure,
        len(et.[entry]),
        substring(et.entry, 1, 1),
        substring(et.entry, 2, 1),
        substring(et.entry, 3, 1),
        substring(et.entry, 4, 1),
        substring(et.entry, 5, 1),
        substring(et.entry, 6, 1),
        substring(et.entry, 7, 1),
        substring(et.entry, 8, 1),
        substring(et.entry, 9, 1),
        substring(et.entry, 10, 1),
        substring(et.entry, 11, 1),
        substring(et.entry, 12, 1),
        substring(et.entry, 13, 1),
        substring(et.entry, 14, 1),
        substring(et.entry, 15, 1)
        from @Entries et
	where not exists(select 1 from Explored where [entry] = et.[entry]);

    update ed set [displayText] = isnull(et.displayText, ed.displayText), 
        qualityScore = isnull(et.qualityScore, ed.qualityScore),
        obscurityScore = isnull(et.obscurityScore, ed.obscurityScore), 
        breakfastTestFailure = isnull(et.breakfastTestFailure, ed.breakfastTestFailure),
        modifiedDate = getDate()
    from Edits ed
    inner join @Entries et on et.[entry] = ed.[entry] 
	where ed.UserId = @UserId;

    insert into Edits ([entry], userId, displayText, qualityScore, obscurityScore, breakfastTestFailure, modifiedDate)
    select
        et.[entry],
        @UserId,
        et.displayText,
        et.qualityScore,
        et.obscurityScore,
        et.breakfastTestFailure,
        getdate()
    from @Entries et
    where not exists(select 1 from Edits where [entry] = et.[entry] and UserId = @UserId);

    update ex set
		displayText = isnull(et.displayText, ex.displayText),
        qualityScore = isnull(calc.qualityScore, ex.qualityScore),
        obscurityScore = isnull(calc.obscurityScore, ex.obscurityScore),
        breakfastTestFailure = isnull(et.breakfastTestFailure, ex.breakfastTestFailure)
    from Explored ex
    inner join @Entries et on et.[entry] = ex.[entry]
    inner join (
        select ed.[entry],
        cast(avg(cast(ed.qualityScore as decimal(3, 2))) as decimal(3, 2)) as qualityScore,
        cast(avg(cast(ed.obscurityScore as decimal(3, 2))) as decimal(3, 2)) as obscurityScore
        from Edits ed
        group by ed.[entry]
    ) calc on calc.[entry] = ex.[entry];
END
GO

CREATE PROCEDURE GetAllExplored
    @UserId nvarchar(127),
	@MinQuality int = 0,
	@MinObscurity int = 0
AS
BEGIN
	select ex.[entry], 
        isnull(ed.displayText, ex.displayText) as displayText,
        isnull(ed.qualityScore, ex.qualityScore) as qualityScore,
        isnull(ed.obscurityScore, ex.obscurityScore) as obscurityScore,
        isnull(ed.breakfastTestFailure, ex.breakfastTestFailure) as breakfastTestFailure
	from Explored ex
    left join Edits ed on ed.[entry] = ex.[entry] and ed.[userId] = @UserId
	where isnull(ed.qualityScore, ex.qualityScore) >= @MinQuality 
    and isnull(ed.obscurityScore, ex.obscurityScore) >= @MinObscurity
    order by [entry];
END
GO
