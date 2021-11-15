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
