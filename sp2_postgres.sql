CREATE OR REPLACE FUNCTION public.load_explored_table(
	entries text)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
begin
	DROP TABLE IF EXISTS input_entries;
	create temp table input_entries as
	select * from jsonb_to_recordset(entries::jsonb)
	as x(entry text, display_text text, quality_score decimal(3, 2), obscurity_score decimal(3, 2));

    update explored ex set
        display_text = et.display_text,
        quality_score = et.quality_score,
        obscurity_score = et.obscurity_score
	from input_entries et 
	where et.entry = ex.entry;

    insert into explored (entry, display_text, quality_score, obscurity_score, length,
    col1, col2, col3, col4, col5, col6, col7, col8, col9, col10, col11, col12, col13, col14, col15)
	select distinct 
        et.entry, 
        et.display_text, 
        et.quality_score,
        et.obscurity_score,
        length(et.entry),
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
        from input_entries et
	where not exists(select 1 from explored where entry = et.entry);
end;
$BODY$;

CREATE OR REPLACE FUNCTION public.load_data_source_table(
	table_name text,
	entries text)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
	query text;
begin
    query := replace('
	DROP TABLE IF EXISTS input_entries;
	create temp table input_entries as
	select * from jsonb_to_recordset($1::jsonb)
	as x(entry text, display_text text, data_source_score int);				
					
    update {TableName} en set
        display_text = et.display_text,
        data_source_score = et.data_source_score
	from input_entries et
	where et.entry = en.entry;

    insert into {TableName} (entry, display_text, data_source_score, views, length)
	select distinct 
        et.entry, 
        et.display_text, 
        et.data_source_score, 
        0,
        length(et.entry)
        from input_entries et
	where not exists(select 1 from {TableName} where entry = et.entry);
    ', '{TableName}', table_name);
	
	EXECUTE query USING entries;
end;
$BODY$;

CREATE OR REPLACE FUNCTION public.explored_query(
	query text,
	user_id text)
    RETURNS table (
		entry text,
		display_text text,
		quality_score decimal(3, 2),
		obscurity_score decimal(3, 2)
	)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
	conds text;
	q text;
begin
    select result into conds from (
		select string_agg(
				case
					when substring(a.b, n.number, 1) = '.' then ''
					else concat(' and col', cast(n.number as varchar), '=''', substring(a.b, n.number, 1), '''')
				end
			, '') as result,
			1 as dummy
		from (select query b) a
		join numbers n on n.number <= length(a.b)
		group by dummy
	) agg;
	
	q := concat('
    select ex.entry, ex.display_text, 
    coalesce(ed.quality_score, ex.quality_score) as quality_score, 
    coalesce(ed.obscurity_score, ex.obscurity_score) as obscurity_score
    from explored ex
    left join edits ed on ed.entry = ex.entry and ed.user_id = $2
    where ex.length = length($1)
    ', conds);
	
	return query EXECUTE q USING query, user_id;
end;
$BODY$;

CREATE OR REPLACE FUNCTION public.frontier_query(
	query text,
	data_source text,
	page int,
	records_per_page int)
    RETURNS table (
		entry text,
		display_text text,
		data_source_score int,
		views int
	)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
	conds text;
	q text;
	q1 text;
	q2 text;
begin
	conds := concat(' and entry like ''', replace(query, '.', '_'), '''');
	
	q := concat('from ', data_source,  ' ds
    where ds.length = length($1)
    ', conds
    , ' order by ds.data_source_score desc, ds.entry desc'
    , ' offset (($2 - 1)*$3) limit $3');
	
    q1 := concat('insert into results_table select ds.entry, ds.display_text, ds.data_source_score, (ds.views-1) as views ', q);
	q2 := concat('update ', data_source, ' d set views = d.views+1 from results_table r where d.entry = r.entry');

	drop table if exists results_table;
	create temp table results_table (
		entry text,
		display_text text,
		data_source_score int,
		views int
	);

	EXECUTE q1 using query, page, records_per_page;
	EXECUTE q2 using query, page, records_per_page;
	
	return query select * from results_table;
end;
$BODY$;

CREATE OR REPLACE FUNCTION public.discover_entries(
	user_id_input text,
	entries text)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
begin
	DROP TABLE IF EXISTS input_entries;
	create temp table input_entries as
	select * from jsonb_to_recordset(entries::jsonb)
	as x(entry text, display_text text, quality_score decimal(3, 2), obscurity_score decimal(3, 2));
	
	insert into explored (entry, display_text, quality_score, obscurity_score, length,
    col1, col2, col3, col4, col5, col6, col7, col8, col9, col10, col11, col12, col13, col14, col15)
    select distinct 
        et.entry, 
        et.display_text, 
        et.quality_score,
        et.obscurity_score,
        length(et.entry),
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
        from input_entries et
	where not exists(select 1 from explored where entry = et.entry);

    update edits ed set 
		display_text = coalesce(et.display_text, ed.display_text), 
        quality_score = coalesce(et.quality_score, ed.quality_score),
        obscurity_score = coalesce(et.obscurity_score, ed.obscurity_score), 
        modified_date = now()
    from input_entries et 
	where et.entry = ed.entry and ed.user_id = user_id_input;

    insert into edits (entry, user_id, display_text, quality_score, obscurity_score, modified_date)
    select
        et.entry,
        user_id_input,
        et.display_text,
        et.quality_score,
        et.obscurity_score,
        now()
    from input_entries et
    where not exists(select 1 from edits where entry = et.entry and user_id = user_id_input);

    update explored ex set
		display_text = coalesce(et.display_text, ex.display_text),
        quality_score = coalesce(calc.quality_score, ex.quality_score),
        obscurity_score = coalesce(calc.obscurity_score, ex.obscurity_score)
    from input_entries et 
    inner join (
        select ed.entry,
        cast(avg(cast(ed.quality_score as decimal(3, 2))) as decimal(3, 2)) as quality_score,
        cast(avg(cast(ed.obscurity_score as decimal(3, 2))) as decimal(3, 2)) as obscurity_score
        from edits ed
        group by ed.entry
    ) calc on calc.entry = et.entry
	where et.entry = ex.entry;
end;
$BODY$;

CREATE OR REPLACE FUNCTION public.get_all_explored(
	user_id_input text,
	min_quality integer,
	min_obscurity integer)
    RETURNS TABLE(entry text, display_text text, quality_score numeric, obscurity_score numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
begin	
	return query select ex.entry, 
        coalesce(ed.display_text, ex.display_text) as display_text,
        coalesce(ed.quality_score, ex.quality_score) as quality_score,
        coalesce(ed.obscurity_score, ex.obscurity_score) as obscurity_score
	from explored ex
    left join edits ed on ed.entry = ex.entry and ed.user_id = user_id_input
	where coalesce(ed.quality_score, ex.quality_score) >= min_quality 
    and coalesce(ed.obscurity_score, ex.obscurity_score) >= min_obscurity
    order by entry;
end;
$BODY$;
