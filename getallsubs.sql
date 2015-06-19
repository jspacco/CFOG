use cc_d13f;
-- select e.user_id, e.problem_id, e.timestamp, s.num_tests_attempted, s.num_tests_passed, c.text
select count(*)
from 
cc_changes c, 
cc_events e, 
cc_submission_receipts s
where c.event_id = e.id
and s.last_edit_event_id = c.event_id
and s.num_tests_attempted > 0
-- limit 10;