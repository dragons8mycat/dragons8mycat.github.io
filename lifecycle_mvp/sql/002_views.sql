create or replace view data_lifecycles_mvp.v_gap_candidates as
select
    sar.requirement_id,
    pt.name as project_type,
    ps.stage_name,
    sar.common_name,
    sar.stage_data_role,
    sar.used_in_stage,
    a.match_status,
    a.source,
    case
        when coalesce(a.match_status, '') ilike '%review%' then 'needs_review'
        when coalesce(a.match_status, '') ilike '%no common data match%' then 'gap'
        else 'covered'
    end as lifecycle_status
from data_lifecycles_mvp.stage_asset_requirement sar
join data_lifecycles_mvp.project_type pt on pt.project_type_id = sar.project_type_id
join data_lifecycles_mvp.project_stage ps on ps.stage_id = sar.stage_id
left join data_lifecycles_mvp.asset a on a.asset_id = sar.asset_id
where coalesce(sar.used_in_stage, '') = 'Yes';
