CREATE TYPE ExploredType AS TABLE 
(
	[entry] nvarchar(127) not null,
	[displayText] nvarchar(127),
	[qualityScore] decimal(3, 2),
	[obscurityScore] decimal(3, 2),
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
        obscurityScore = et.obscurityScore
	from Explored ex
	inner join @Entries et on et.[entry] = ex.[entry];

    insert into Explored ([entry], [displayText], [qualityScore], [obscurityScore], [length]
    col1, col2, col3, col4, col5, col6, col7, col8, col9, col10, col11, col12, col13, col14, col15)
	select distinct 
        et.[entry], 
        et.[displayText], 
        et.qualityScore,
        et.obscurityScore,
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
    coalesce(ed.obscurityScore, ex.obscurityScore) as obscurityScore
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
    @Page int
AS
BEGIN
    declare @Conds nvarchar(1024);
    select @Conds = ' and entry like ''' + replace(@Query, '.', '_') + '''';

    declare @Q nvarchar(max);
    select @Q = '
    from ' + @DataSource + ' ds
    where ds.[length] = len(@Query)
    ' + @Conds
    + ' order by ds.dataSourceScore desc'
    + ' OFFSET ((@Page - 1)*200) ROWS FETCH NEXT 200 ROWS ONLY';

	declare @Q1 nvarchar(max) = concat('WITH q AS ( SELECT  * ', @Q, ') UPDATE  q SET [views] = [views] + 1');
	declare @Q2 nvarchar(max) = concat('select ds.[entry], ds.displayText, ds.dataSourceScore, (ds.[views]-1) as [views] ', @Q);

    EXECUTE sp_executesql @Q1, N'@Query nvarchar(127), @Page int', @Query=@Query, @Page=@Page;
    EXECUTE sp_executesql @Q2, N'@Query nvarchar(127), @Page int', @Query=@Query, @Page=@Page;
END
GO

CREATE PROCEDURE DiscoverEntries
    @UserId nvarchar(127),
    @Entries dbo.ExploredType readonly
AS
BEGIN
    insert into Explored ([entry], displayText, qualityScore, obscurityScore, [length],
    col1, col2, col3, col4, col5, col6, col7, col8, col9, col10, col11, col12, col13, col14, col15)
    select distinct 
        et.[entry], 
        et.[displayText], 
        et.qualityScore,
        et.obscurityScore,
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

    update ed set [displayText] = et.displayText, qualityScore = et.qualityScore, obscurityScore = et.obscurityScore
    from Edits ed
    inner join @Entries et on et.[entry] = ed.[entry] 
	where ed.UserId = @UserId;

    insert into Edits ([entry], userId, displayText, qualityScore, obscurityScore)
    select
        et.[entry],
        @UserId,
        et.displayText,
        et.qualityScore,
        et.obscurityScore
    from @Entries et
    where not exists(select 1 from Edits where [entry] = et.[entry] and UserId = @UserId);

    update ex set
		displayText = et.displayText,
        qualityScore = calc.qualityScore,
        obscurityScore = calc.obscurityScore
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

drop table #TestEntries;

create table #TestEntries (
	[entry] nvarchar(127) not null primary key,
	[displayText] nvarchar(127),
	qualityScore decimal(3, 2),
	obscurityScore decimal(3, 2)
);

insert into #TestEntries ([entry], displayText, qualityScore, obscurityScore)
values
('TESTA', 'testa', 1, 1),
('TESTO', 'Testo', 1, 2);

declare @UserId nvarchar(127) = 'bzoon';
